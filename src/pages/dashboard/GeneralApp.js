import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ChatComponent from "./Conversation";
import Chats from "./Chats";
import Contact from "../../sections/Dashboard/Contact";
import NoChat from "../../assets/Illustration/NoChat";
import StarredMessages from "../../sections/Dashboard/StarredMessages";
import Media from "../../sections/Dashboard/SharedMessages";
import useResponsive from "../../hooks/useResponsive";
import { ToggleSidebar } from "../../redux/slices/app";

import { UpdateTab } from "../../redux/slices/app";

const GeneralApp = () => {
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  dispatch(UpdateTab({ tab: 0 }));
  return (
    <>
      {
        isDesktop ? (
          <Stack direction="row" sx={{ width: "100%", }}

            onClick={() => sideBar.open === true ? dispatch(ToggleSidebar()) : " "}

          >
            <Chats />


            <Box
              sx={{

                width: "calc(100vw - 420px )",

                // width: sideBar.open
                //   ? "calc(100vw - 740px )"
                //   : "calc(100vw - 420px )",

                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#FFF"
                    : theme.palette.background.paper,
                // borderBottom:
                //   searchParams.get("type") === "individual-chat" &&
                //     searchParams.get("id")
                //     ? "0px"
                //     : `6px solid ${theme.palette.primary.main}`,
              }}
            >

              {
                chat_type === "individual" &&
                  room_id !== null ? (

                  <ChatComponent />

                ) : (

                  <Stack
                    spacing={2}
                    sx={{ height: "100%", width: "100%" }}
                    alignItems="center"
                    justifyContent={"center"}
                  >

                    <NoChat />

                    <Typography variant="subtitle2">
                      Select a conversation or start a{" "}
                      <Link
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}
                        to="/"
                      >
                        new one
                      </Link>
                    </Typography>
                  </Stack>
                )
              }

            </Box >

          </Stack >
        ) : (
          <>
            {
              chat_type === "individual" &&
                room_id !== null ? (
                <Stack
                  direction="row"
                  alignItems={"center"}
                >
                  <ChatComponent />
                </Stack>
              ) : (
                <Chats />
              )
            }
          </>
        )
      }

      {
        sideBar.open &&
        (() => {
          switch (sideBar.type) {
            case "CONTACT":
              return <Contact />

            case "STARRED":
              return <StarredMessages />;

            case "SHARED":
              return <Media />;

            default:
              break;
          }
        })()
      }

    </>
  );
};

export default GeneralApp;
