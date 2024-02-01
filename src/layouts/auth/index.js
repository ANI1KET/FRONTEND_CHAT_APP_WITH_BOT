import React from "react";
import { Container, Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

import Logo from "../../assets/Images/logo.ico";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to={"/app"} />;
  }

  return (
    <Container maxWidth="sm"
      sx={{ pt: 5 }}
    >
      <Stack spacing={4}>
        <Stack
          sx={{ width: "100%" }}
          direction="column"
          alignItems={"center"}
        >
          <img style={{ height: 120, width: 220 }} src={Logo} alt="Logo" />
        </Stack>
        <Outlet />
      </Stack>
    </Container>
  );
};

export default AuthLayout;
