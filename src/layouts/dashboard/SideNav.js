import React from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Divider, IconButton, Stack } from "@mui/material";

import AntSwitch from "../../components/AntSwitch";
import Logo from "../../assets/Images/logo.ico";
import useSettings from "../../hooks/useSettings";
import { Nav_Buttons, Nav_Setting } from "../../data";
import ProfileMenu from "./ProfileMenu";
import { UpdateTab } from "../../redux/slices/app";
import ChatBotInterface from "../../components/Bot/bot";
import { SelectConversation } from "../../redux/slices/app"

const getPath = (index) => {
  switch (index) {
    case 0:
      return "/app";

    case 1:
      return "/group";

    case 2:
      return "/call";

    case 3:
      return "/settings";

    default:
      break;
  }
};

const SideBar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { tab } = useSelector((state) => state.app);

  const navigate = useNavigate();

  const { onToggleMode } = useSettings();

  const selectedTab = tab;

  const handleChangeTab = (index) => {
    dispatch(UpdateTab({ tab: index }));
    navigate(getPath(index));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: 100,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F0F4FA"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        py={3}
        alignItems={"center"}
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Stack alignItems={"center"} spacing={4}>

          <Box
            sx={{
              height: 64,
              width: 64,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              style={{ width: '100%', height: '60%', objectFit: 'cover' }}
              src={Logo} alt="Chat App Logo" />
          </Box>

          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems={"center"}
            spacing={3}
          >
            {
              Nav_Buttons.map((el, key) => {
                return el.index === selectedTab ? (
                  <Box
                    key={key}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1.5,
                    }}
                    p={1}
                  >
                    <IconButton
                      onClick={() => {
                        dispatch(SelectConversation({ room_id: null }));
                      }}
                      sx={{ width: "max-content", color: "#ffffff" }}
                    >
                      {el.icon}
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    key={key}
                    onClick={() => {
                      handleChangeTab(el.index);
                    }}
                    sx={{
                      width: "max-content",
                      color:
                        theme.palette.mode === "light"
                          ? "#080707"
                          : theme.palette.text.primary,
                    }}
                  >
                    {el.icon}
                  </IconButton>
                );
              })
            }

            <Divider sx={{ width: 48 }} />

            {
              Nav_Setting.map((el, key) => {
                return el.index === selectedTab ? (
                  <Box
                    key={key}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1.5,
                    }}
                    p={1}
                  >
                    <IconButton
                      onClick={() => {
                        handleChangeTab(el.index);
                      }}
                      sx={{ width: "max-content", color: "#ffffff" }}
                    >
                      {el.icon}
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    key={key}
                    onClick={() => {
                      handleChangeTab(el.index);
                    }}
                    sx={{
                      width: "max-content",
                      color:
                        theme.palette.mode === "light"
                          ? "#080707"
                          : theme.palette.text.primary,
                    }}
                  >
                    {el.icon}
                  </IconButton>
                );
              })
            }
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <AntSwitch
            defaultChecked={theme.palette.mode === "dark"}
            onChange={onToggleMode}
          />

          <ChatBotInterface />

          <ProfileMenu />
        </Stack>

      </Stack>
    </Box>
  );
};

export default SideBar;
