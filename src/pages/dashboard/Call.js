import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MagnifyingGlass, Phone } from "phosphor-react";
import { useTheme } from "@mui/material/styles";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { CallList } from "../../data";
import { CallLogElement } from "../../components/CallElement";
import StartCall from "../../sections/Dashboard/StartCall.js";
import { FetchCallLogs } from "../../redux/slices/app";

import { UpdateTab } from "../../redux/slices/app";
import { SimpleBarStyle } from "../../components/Scrollbar";

import useResponsive from "../../hooks/useResponsive";

const Call = () => {
  const isDesktop = useResponsive("up", "md");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchCallLogs());
    dispatch(UpdateTab({ tab: 2 }));
  }, []);
  const { call_logs } = useSelector((state) => state.app);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" sx={{ width: "100%", }}>

        <Box
          sx={{
            // overflowY: "scroll",
            // '&::-webkit-scrollbar': {
            //   display: 'none',
            // },

            width: isDesktop ? 340 : "100vw",
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
              <Typography variant="h5">Call Log</Typography>
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass style={{ color: theme.palette.primary.main }} />
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
              <Typography variant="subtitle2" component={Link}>
                Start a conversation
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Phone style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              sx={{
                flexGrow: 1,
                overflow: "scroll",
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>

              <Stack spacing={!isDesktop ? 0.7 : 1.8}>
                {
                  call_logs.map((el, idx) => {
                    return <CallLogElement key={idx} {...el} />;
                  })
                }
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack >
      {
        openDialog && (
          <StartCall open={openDialog} handleClose={handleCloseDialog} />
        )
      }

    </>
  );
};

export default Call;
