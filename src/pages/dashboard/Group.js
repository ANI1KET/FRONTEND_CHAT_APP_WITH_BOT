import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";

import { ChatList } from "../../data";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import CreateGroup from "../../sections/Dashboard/CreateGroup.js";

import { store } from "../../redux/store";
import { UpdateTab } from "../../redux/slices/app";
import useResponsive from "../../hooks/useResponsive";
import { SimpleBarStyle } from "../../components/Scrollbar";

const Group = () => {
  const isDesktop = useResponsive("up", "md");

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }
  const handleOpenDialog = () => {
    setOpenDialog(true);
  }
  const theme = useTheme();

  store.dispatch(UpdateTab({ tab: 1 }));

  return (
    < >
      <Stack direction="row" sx={{ width: "100%", }}>

        <Box
          sx={{
            width: isDesktop ? 320 : "100vw",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{
            height: isDesktop ? "100vh" : "calc(100vh - 70px)",
            paddingBottom: isDesktop ? "" : "68px",
          }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Groups</Typography>
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
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
              <Typography variant="subtitle2" sx={{}} component={Link}>
                Create New Group
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack sx={{
              flexGrow: 1,
              overflow: "scroll",
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}>
              <Stack spacing={isDesktop ? 2.6 : 1.3}>
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  Pinned
                </Typography>
                {
                  ChatList.filter((el) => el.pinned).map((el, idx) => {
                    return <ChatElement {...el} key={idx} />;
                  })
                }
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  All Chats
                </Typography>
                {
                  ChatList.filter((el) => !el.pinned).map((el, idx) => {
                    return <ChatElement {...el} key={idx} />;
                  })
                }
              </Stack>
            </Stack>
          </Stack>
        </Box >

      </Stack >
      {
        openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      }
    </>
  );
};

export default Group;
