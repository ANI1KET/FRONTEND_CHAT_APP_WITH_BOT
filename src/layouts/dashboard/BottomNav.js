import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProfileMenu from "./ProfileMenu";
import { Nav_Buttons } from "../../data";
import { UpdateTab } from "../../redux/slices/app";
import { SelectConversation } from "../../redux/slices/app"
import ChatBotInterface from "../../components/Bot/bot";
import AntSwitch from "../../components/AntSwitch";
import useSettings from "../../hooks/useSettings";

const getPath = (index) => {
  switch (index) {
    case 0:
      return "/app";

    case 1:
      return "/group";

    case 2:
      return "/call";

    default:
      break;
  }
};

const BottomNav = () => {
  const theme = useTheme();
  const { onToggleMode } = useSettings();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tab } = useSelector((state) => state.app);
  const selectedTab = tab;

  const handleChangeTab = (index) => {
    dispatch(UpdateTab({ tab: index }));
    navigate(getPath(index));
  };

  return (
    <Box
      sx={{
        zIndex: 10,
        // position: "absolute",
        position: "fixed",
        bottom: 0,
        width: "100vw",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        sx={{ width: "100%" }}
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        spacing={2}
        p={1}
      >
        {
          Nav_Buttons.map((el, key) => {
            return el.index === selectedTab ? (
              <Box key={key} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }} p={1}>
                <IconButton sx={{ width: "max-content", height: "40px", color: "#ffffff" }}
                  onClick={() => {
                    if (el.index === 0) {
                      dispatch(SelectConversation({ room_id: null }));
                    }
                  }}
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

        <ChatBotInterface />

        <Stack spacing={4}>
          <AntSwitch
            defaultChecked={theme.palette.mode === "dark"}
            onChange={onToggleMode}
          />
        </Stack>

        <ProfileMenu />
      </Stack>
    </Box >
  );
};

export default BottomNav;
