import React from "react"
import { Typography, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { socket } from "../../socket";

const defaultMessages = ({ theme, defaultMessages, messages, setMessages, user_id }) => {
    return (
        <Stack spacing={1}>
            {
                defaultMessages.map((msg, index) => {
                    return (
                        <Typography
                            key={index}
                            variant="h5"
                            color={theme.palette.text}
                            sx={{
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                borderRadius: '10px',
                                padding: '5px',
                                cursor: 'pointer'
                            }}

                            onClick={() => {
                                setMessages([...messages,
                                { incoming: false, message: msg, outgoing: true },
                                ]);

                                socket.emit("bot_request_message", {
                                    message: msg,
                                    from: user_id,
                                });
                            }}
                        >
                            {msg}
                        </Typography>
                    );
                })
            }
        </Stack>
    );
};

export default defaultMessages;
