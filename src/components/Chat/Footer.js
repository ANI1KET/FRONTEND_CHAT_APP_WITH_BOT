import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDispatch, useSelector } from "react-redux";

import useResponsive from "../../hooks/useResponsive";
import { socket } from "../../socket";
import { AddDirectMessage } from "../../redux/slices/conversation";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    icon: <Image size={24} />,
    y: 80,
    title: "Photo/Video",
  },
  {
    icon: <Sticker size={24} />,
    y: 150,
    title: "Stickers",
  },
  {
    icon: <Camera size={24} />,
    y: 220,
    title: "Image",
  },
  {
    icon: <File size={24} />,
    y: 290,
    title: "Document",
  },
  {
    icon: <User size={24} />,
    y: 360,
    title: "Contact",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  setOpenActions,
  openActions,
  sendMessage
}) => {

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onFocus={() =>
        openPicker === true && setOpenPicker(false)
      }
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendMessage();
        }
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {
                Actions.map((el) => (
                  <Tooltip placement="right" title={el.title}>
                    <Fab
                      onClick={() => {
                        setOpenActions(!openActions);
                      }}
                      sx={{
                        position: "absolute",
                        top: -el.y,
                      }}
                      aria-label="add"
                    >
                      {el.icon}
                    </Fab>
                  </Tooltip>
                ))
              }
            </Stack>

            <IconButton
              onClick={() => {
                setOpenActions(!openActions);
              }}
            >
              <LinkSimple />
            </IconButton>
          </Stack >
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = ({ setOpenActions, openActions }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const user_id = window.localStorage.getItem("user_id");

  const isMobile = useResponsive("between", "md", "xs", "sm");
  const isDesktop = useResponsive("up", "md");

  const { room_id } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = React.useState(false);

  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const sendMessage = () => {
    if (value.trim() === "") {
      return;
    }

    dispatch(
      AddDirectMessage({
        type: "msg",
        subtype: containsUrl(value) ? "Link" : "Text",
        message: value,
        incoming: false,
        outgoing: true,
      })
    );

    socket.emit("text_message", {
      message: value,
      conversation_id: room_id,
      from: user_id,
      to: current_conversation.user_id,
      type: containsUrl(value) ? "Link" : "Text",
    });

    setValue("");
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: isDesktop ? 87 : 148,
                right: 98,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>

            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              openActions={openActions}
              setOpenActions={setOpenActions}
              sendMessage={sendMessage}
            />
          </Stack>

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
              <IconButton onClick={sendMessage} >
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>

        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
