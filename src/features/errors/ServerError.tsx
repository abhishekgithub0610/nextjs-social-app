"use client";
import { Divider, Paper, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function ServerError() {
  //const { state } = useLocation();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const details = searchParams.get("details");
  return (
    <Paper>
      {message ? (
        <>
          <Typography
            gutterBottom
            variant="h3"
            sx={{ px: 4, pt: 2 }}
            color="secondary"
          >
            {/* CHANGE: message from query param instead of state.error.message */}
            {message || "There has been an error!"}
          </Typography>

          <Divider />

          <Typography variant="body1" sx={{ p: 4 }}>
            {/* CHANGE: details from query param instead of state.error.details */}
            {details || "Internal server error"}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          Server error
        </Typography>
      )}
    </Paper>
    // <Paper>
    //   {state.error ? (
    //     <>
    //       <Typography
    //         gutterBottom
    //         variant="h3"
    //         sx={{ px: 4, pt: 2 }}
    //         color="secondary"
    //       >
    //         {state.error.message || "There has been an error!"}
    //       </Typography>
    //       <Divider />
    //       <Typography variant="body1" sx={{ p: 4 }}>
    //         {state.error.details || "Internal server error"}
    //       </Typography>
    //     </>
    //   ) : (
    //     <Typography variant="h5" gutterBottom>
    //       Server error
    //     </Typography>
    //   )}
    // </Paper>
  );
}
