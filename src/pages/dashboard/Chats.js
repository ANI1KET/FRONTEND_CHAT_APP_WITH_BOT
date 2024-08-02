import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import { SimpleBarStyle } from "../../components/Scrollbar";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import { ChatList } from "../../data";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import Friends from "../../sections/Dashboard/Friends.js";
import { socket, connectSocket } from "../../socket";
import { FetchDirectConversations, UpdateDirectConversation } from "../../redux/slices/conversation";

const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const { user_id } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { conversations } = useSelector((state) => state.conversation.direct_chat);

  useEffect(() => {
    if (!socket.connected) {
      connectSocket(user_id);
    }

    socket.on("user_On_Off", (data) => {
      dispatch(UpdateDirectConversation({ conversation: data }));
    });

    // socket.emit("user_On_Off", { user_id });

    // socket.emit("get_direct_conversations", { user_id }, (data) => {
    //   console.log("object")
    //   dispatch(FetchDirectConversations({ user_id: user_id, conversations: data }));
    // });
  }, [dispatch, user_id]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >

        <Stack p={2} spacing={2}>

          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                <Users />
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>

          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>

          <Stack spacing={1}>
            <Stack direction={"row"} spacing={1.5} alignItems="center">
              <ArchiveBox size={24} />
              <Button variant="text">Archive</Button>
            </Stack>
            <Divider />
          </Stack>

        </Stack >

        <Stack sx={{
          flexGrow: 1,
          height: isDesktop ? "calc(100vh - 26vh)" : "calc(73vh - 70px)",
          paddingBottom: !isDesktop ? "58px" : "0px",
          overflow: "scroll",
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        }}>

          <Stack p={1} spacing={!isDesktop ? 0.8 : 1.5}>
            <Typography variant="subtitle2" sx={{ color: "#676667" }}>
              Pinned
            </Typography>
            {
              conversations.filter((el) => !el.pinned).map((el, idx) => {
                return <ChatElement {...el} key={idx} />;
              })
            }
            <Typography variant="subtitle2" sx={{ color: "#676667" }}>
              All Chats
            </Typography>
            {
              conversations.filter((el) => !el.pinned).map((el, idx) => {
                return <ChatElement {...el} key={idx} />;
              })
            }
          </Stack>
        </Stack>

      </Box >

      {
        openDialog && (
          <Friends open={openDialog} handleClose={handleCloseDialog} />
        )
      }

    </>
  );
};

export default Chats;
