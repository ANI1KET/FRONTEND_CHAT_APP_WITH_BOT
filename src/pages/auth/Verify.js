import { Link as RouterLink } from "react-router-dom";
import { Stack, Typography, Link } from "@mui/material";
import { useSelector } from "react-redux";

import AuthSocial from "../../sections/auth/AuthSocial";
import Login from "../../sections/auth/LoginForm";
import VerifyForm from "../../sections/auth/VerifyForm";

export default function LoginPage() {
  const { email } = useSelector((state) => state.auth);

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Please Verify OTP</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">
            Sent to email ({email})
          </Typography>
        </Stack>
      </Stack>

      <VerifyForm />

    </>
  );
}
