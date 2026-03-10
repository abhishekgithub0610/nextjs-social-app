"use client";
import { Grid, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useProfile } from "../../lib/hooks/useProfile";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { profile, loadingProfile } = useProfile(id);

  if (loadingProfile) return <Typography>Loading profile...</Typography>;

  if (!profile) return <Typography>Profile not found</Typography>;
  return (
    <Grid container>
      <Grid size={12}>
        <ProfileHeader />
        <ProfileContent />
      </Grid>
    </Grid>
  );
}
