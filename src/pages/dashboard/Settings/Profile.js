import React, { useEffect } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import { useDispatch } from "react-redux";

import ProfileForm from "../../../sections/Dashboard/Settings/ProfileForm";
import { FetchUserProfile } from "../../../redux/slices/app";
import useResponsive from "../../../hooks/useResponsive";

const Profile = () => {
  const dispatch = useDispatch();

  const isDesktop = useResponsive("up", "md");

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);

  return (
    <>
      <Stack direction="row" sx={{ width: "100%", }}>

        <Box
          sx={{
            width: isDesktop ? 320 : "100%",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            <Stack direction="row" alignItems={"center"} spacing={3}>
              <IconButton>
                <CaretLeft size={24} color={"#4B4B4B"} />
              </IconButton>

              <Typography variant="h5">Profile</Typography>
            </Stack>

            <ProfileForm />
          </Stack>
        </Box>

        {
          isDesktop &&
          <Box
            sx={{
              height: "100%",
              width: "calc(100vw - 420px )",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.background.paper,
              borderBottom: "6px solid #0162C4",
            }}
          >
          </Box>
        }

      </Stack>
    </>
  );
};

export default Profile;
