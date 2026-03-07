"use client";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { EmailRounded } from "@mui/icons-material";
import { useAccount } from "../../lib/hooks/useAccount";
//import { useAccount } from "../../lib/hooks/useAccount.ts";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const { verifyEmail, resendConfirmationEmail } = useAccount();
  //const [status, setStatus] = useState("verifying");
  const [status, setStatus] = useState<"verifying" | "verified" | "failed">(
    "verifying",
  );
  //const [searchParams] = useSearchParams();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const code = searchParams.get("code");
  const hasRun = useRef(false);

  useEffect(() => {
    if (code && userId && !hasRun.current) {
      hasRun.current = true;
      verifyEmail
        .mutateAsync({ userId, code })
        .then(() => setStatus("verified"))
        .catch(() => setStatus("failed"));
    }
  }, [code, userId, verifyEmail]);

  const getBody = () => {
    switch (status) {
      case "verifying":
        return <Typography>Verifying...</Typography>;
      case "failed":
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            justifyContent="center"
          >
            <Typography>
              Verification failed. You can try resending the verify link to your
              email
            </Typography>
            {/* CHANGE: MUI Button does not support loading prop */}
            <Button
              onClick={() => resendConfirmationEmail.mutateAsync({ userId })}
              disabled={resendConfirmationEmail.isPending}
            >
              {resendConfirmationEmail.isPending
                ? "Sending..."
                : "Resend verification email"}
            </Button>
            {/* <Button
              onClick={() => resendConfirmationEmail.mutateAsync({ userId })}
              loading={resendConfirmationEmail.isPending}
            >
              Resend verification email
            </Button> */}
          </Box>
        );
      case "verified":
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            justifyContent="center"
          >
            <Typography>Email has been verified - you can now login</Typography>
            <Button component={Link} href="/login">
              Go to login
            </Button>
          </Box>
        );
    }
  };

  return (
    <Paper
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
      }}
    >
      <EmailRounded sx={{ fontSize: 100 }} color="primary" />
      <Typography gutterBottom variant="h3">
        Email verification
      </Typography>
      <Divider sx={{ my: 2 }} />
      {getBody()}
    </Paper>
  );
}
