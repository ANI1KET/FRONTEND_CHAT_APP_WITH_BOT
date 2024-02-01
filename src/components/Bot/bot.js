import React, { useRef, useState, useEffect } from "react";
import Popover from '@mui/material/Popover';
import { PaperPlaneTilt } from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import {
    Box,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";

import { TextMsg } from "../../sections/Dashboard/Conversation";
import useResponsive from "../../hooks/useResponsive";
import { socket } from "../../socket";
import DefaultMessages from "./defaultMessages";

const user_id = window.localStorage.getItem("user_id");

const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
        paddingTop: "12px !important",
        paddingBottom: "12px !important",
    },
}));

const ChatInput = ({
    setValue,
    value,
    inputRef,
    messages,
    setMessages,
    setDefaultMessage
}) => {
    return (
        <StyledInput
            inputRef={inputRef}
            value={value}
            onChange={(event) => {
                setValue(event.target.value);
            }}
            onKeyPress={(e) => {
                if (value.trim() === "") {
                    return;
                }

                if (e.key === "Enter") {
                    e.preventDefault();

                    setValue("");
                    setMessages([...messages,
                    { incoming: false, message: value, outgoing: true },
                    ]);

                    setDefaultMessage(false);

                    socket.emit("bot_request_message", {
                        message: value,
                        from: user_id,
                    });
                }
            }}
            fullWidth
            placeholder="Write your query..."
            variant="filled"
            InputProps={{
                disableUnderline: true,
            }}
        />
    );
};

const Conversation = ({ messageListRef, anchorEl, messages, isMobile }) => {
    useEffect(() => {
        if (anchorEl != null) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [anchorEl, messageListRef, messages]);

    return (
        <Box p={isMobile ? 1 : 3}>
            <Stack spacing={3}>
                {
                    messages.map((el, idx) => {
                        return (<TextMsg el={el} key={idx} />);
                    })
                }
            </Stack>
        </Box>
    );
};

const ChatBotInterface = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [messages, setMessages] = useState([
        { incoming: true, message: "👋 Hi there! Welcome to KIIT SOCIAL Chat Bot", outgoing: false },
    ]);

    const [value, setValue] = useState("");
    const inputRef = useRef(null);

    const theme = useTheme();

    const isMobile = useResponsive("between", "md", "xs", "sm");
    const isDesktop = useResponsive("up", "md");

    useEffect(() => {
        if (socket) {
            socket.on("bot_response_message", (value) => {
                setMessages([...messages, value]);
            });
        }

        return () => {
            if (socket) {
                socket?.off("bot_response_message");
            }
        };
    }, [messages]);

    const messageListRef = useRef(null);

    const defaultMessages = [
        "Who is Your Developer?",
        // "How can you help me?",
    ]

    const [defaultMessage, setDefaultMessage] = useState(true);

    return (
        <>
            <IconButton
                aria-describedby="chat-interface"
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                    <path d="M116,120a12,12,0,1,1,12,12A12,12,0,0,1,116,120Zm56,12a12,12,0,1,0-12-12A12,12,0,0,0,172,132Zm60-76V184a16,16,0,0,1-16,16H156.53l-14.84,24.29a16,16,0,0,1-27.41-.06L99.47,200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V184H99.47a16.08,16.08,0,0,1,13.7,7.73L128,216l14.82-24.32A16.07,16.07,0,0,1,156.53,184H216ZM84,132a12,12,0,1,0-12-12A12,12,0,0,0,84,132Z">
                    </path>
                </svg>
            </IconButton>

            <Popover
                id="chat-interface"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: isDesktop ? 'left' : 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Box
                    ref={messageListRef}
                    width={isDesktop ? "400px" : "92vw"}
                    height={isDesktop ? "50vh" : "60vh"}
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        overflow: "scroll",
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        backgroundColor:
                            theme.palette.mode === "light"
                                ? "#F0F4FA"
                                : theme.palette.background,
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <Conversation messageListRef={messageListRef} anchorEl={anchorEl} messages={messages} isMobile={isMobile} />

                    <Box
                        display={defaultMessage ? '' : "none"}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            padding: "12px",
                            // backdropFilter: "blur(5px)"
                        }}
                        onClick={() => setDefaultMessage(false)}
                    >
                        <DefaultMessages
                            theme={theme}
                            defaultMessages={defaultMessages}
                            messages={messages}
                            setMessages={setMessages}
                            user_id={user_id}
                        />
                    </Box>
                </Box>

                <Stack
                    alignItems={"center"}
                    justifyContent="center"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <ChatInput
                        inputRef={inputRef}
                        value={value}
                        setValue={setValue}
                        messages={messages}
                        setMessages={setMessages}
                        setDefaultMessage={setDefaultMessage}
                    />
                    <Box
                        sx={{
                            height: 48,
                            width: 48,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1.5,
                        }}
                    >
                        <Stack
                            sx={{ height: "100%" }}
                            alignItems={"center"}
                            justifyContent="center"
                        >
                            <IconButton onClick={() => {
                                if (value.trim() === "") {
                                    return;
                                }

                                setValue("");
                                setMessages([...messages,
                                { incoming: false, message: value, outgoing: true },
                                ]);

                                setDefaultMessage(false)

                                socket.emit("bot_request_message", {
                                    message: value,
                                    from: user_id,
                                });
                            }}>
                                <PaperPlaneTilt color="#ffffff" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Stack>
            </Popover >
        </ >
    );
};

export default ChatBotInterface;
