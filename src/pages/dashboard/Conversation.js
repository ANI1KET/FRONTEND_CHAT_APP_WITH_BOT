import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { Key } from "phosphor-react";

import { SimpleBarStyle } from "../../components/Scrollbar";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History } from "../../data";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/Dashboard/Conversation";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const user_id = window.localStorage.getItem("user_id");

const Conversation = ({ isMobile, menu }) => {
  const dispatch = useDispatch();

  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchCurrentMessages({ user_id: user_id, messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, [conversations, dispatch, room_id]);

  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {
          current_messages.map((el, idx) => {
            switch (el.type) {
              case "divider":
                return (
                  // Timeline
                  <Timeline el={el} key={idx} />
                );
              case "msg":
                switch (el.subtype) {
                  case "img":
                    return (
                      // Media Message
                      <MediaMsg el={el} menu={menu} key={idx} />
                    );
                  case "doc":
                    return (
                      // Doc Message
                      <DocMsg el={el} menu={menu} key={idx} />
                    );
                  case "Link":
                    return (
                      //  Link Message
                      <LinkMsg el={el} menu={menu} key={idx} />
                    );
                  case "reply":
                    return (
                      //  ReplyMessage
                      <ReplyMsg el={el} menu={menu} key={idx} />
                    );
                  default:
                    return (
                      // Text Message
                      <TextMsg el={el} menu={menu} key={idx} />
                    );
                }
              default:
                return <></>;
            }
          })
        }
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isDesktop = useResponsive("up", "md");

  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  // const { conversations } = useSelector((state) => state.conversation.direct_chat);
  // console.log(conversations);

  const messageListRef = useRef(null);

  const [openActions, setOpenActions] = React.useState(false);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages, isDesktop]);

  return (
    <Stack
      height={isDesktop ? "100vh" : "calc(100vh - 70px)"}
      paddingBottom={!isDesktop ? "58px" : "0px"}
      width={isDesktop ? "auto" : "100vw"}
      onClick={() => {
        openActions === true && setOpenActions(false);
      }}
    >

      <ChatHeader />

      <Box
        ref={messageListRef}
        width={"100%"}
        height={"100%"}
        sx={{
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
        <Conversation menu={true} isMobile={isMobile} />
      </Box>

      <ChatFooter openActions={openActions} setOpenActions={setOpenActions} />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
