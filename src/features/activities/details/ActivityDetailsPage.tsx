"use client";
import { Grid } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

//export default function ActivityDetailsPage() {
export default function ActivityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) return <div>Loading activity...</div>;

  if (!activity) return <div>Activity not found</div>;

  return (
    <Grid container spacing={3}>
      <Grid size={8}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </Grid>
      <Grid size={4}>
        <ActivityDetailsSidebar activity={activity} />
      </Grid>
    </Grid>
  );
}
