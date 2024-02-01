import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../../redux/slices/app";
import { Conversation } from "../../pages/dashboard/Conversation";

const StarredMessages = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  return (
    <Box sx={{
      width: !isDesktop ? "100vw" : 400,
      height: isDesktop ? "100%" : "calc(100vh - 70px)",
      paddingBottom: !isDesktop ? "58px" : "0px",
      marginRight: isDesktop ? "10px" : "0px",

      position: "fixed", right: "0",
      backgroundColor:
        theme.palette.mode === "light"
          ? "#F0F4FA"
          : "#212B36",
      overflow: "hidden",
      zIndex: 10,
      borderLeft: theme.palette.mode === "light" ? "2px solid #dedcdc" : "2px solid #3c3939"
    }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",

            // backgroundColor:
            //   theme.palette.mode === "light"
            //     ? "#F8FAFF"
            //     : theme.palette.background,

          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Messages</Typography>
          </Stack>
        </Box>

        <Stack
          sx={{
            height: "90vh",
            position: "relative",
            flexGrow: 1,

            overflow: "scroll",
            '&::-webkit-scrollbar': {
              display: 'none',
            },

          }}
          spacing={3}
        >
          <Conversation />
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMessages;
