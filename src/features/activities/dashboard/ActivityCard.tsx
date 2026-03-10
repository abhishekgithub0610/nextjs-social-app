"use client";
import AccessTime from "@mui/icons-material/AccessTime";
import Place from "@mui/icons-material/Place";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { memo } from "react";
import { formatDate } from "../../../lib/util/util";
import AvatarPopover from "../../../components/shared/AvatarPopover";

type Props = {
  activity: Activity;
};

const ActivityCard = memo(function ActivityCard({ activity }: Props) {
  const label = activity.isHost ? "You are hosting" : "You are going";

  const color: "secondary" | "warning" | "default" = activity.isHost
    ? "secondary"
    : activity.isGoing
      ? "warning"
      : "default";

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between">
        <CardHeader
          avatar={
            <Avatar
              src={activity.hostImageUrl || "/images/user.png"}
              alt={`${activity.hostDisplayName}'s avatar`}
              sx={{ height: 64, width: 64 }}
            />
          }
          title={activity.title}
          subheader={
            <Typography variant="body2">
              Hosted by{" "}
              <Link href={`/profiles/${activity.hostId}`}>
                {activity.hostDisplayName}
              </Link>
            </Typography>
          }
          slotProps={{
            title: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />

        <Box display="flex" flexDirection="column" gap={1} mr={2} mt={2}>
          {(activity.isHost || activity.isGoing) && (
            <Chip label={label} variant="outlined" color={color} />
          )}

          {activity.isCancelled && <Chip label="Cancelled" color="error" />}
        </Box>
      </Box>

      <Divider />

      <CardContent sx={{ pt: 2 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Box display="flex" alignItems="center">
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2">{formatDate(activity.date)}</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Place sx={{ mr: 1 }} />
            <Typography variant="body2">{activity.venue}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          display="flex"
          gap={1}
          flexWrap="wrap"
          sx={{ backgroundColor: "grey.200", py: 2, px: 2, borderRadius: 2 }}
        >
          {activity.attendees.map((a) => (
            <AvatarPopover key={a.id} profile={a} />
          ))}
        </Box>
      </CardContent>

      <CardContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {activity.description}
        </Typography>

        <Box display="flex" justifyContent="flex-end">
          <Button
            component={Link}
            href={`/activities/${activity.id}`}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

export default ActivityCard;

// "use client";
// import AccessTime from "@mui/icons-material/AccessTime";
// import Place from "@mui/icons-material/Place";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Chip,
//   Divider,
//   Typography,
// } from "@mui/material";
// import Link from "next/link";
// import { formatDate } from "../../../lib/util/util";
// import AvatarPopover from "../../../components/shared/AvatarPopover";

// type Props = {
//   activity: Activity;
// };

// export default function ActivityCard({ activity }: Props) {
//   const label = activity.isHost ? "You are hosting" : "You are going";
//   const color = activity.isHost
//     ? "secondary"
//     : activity.isGoing
//       ? "warning"
//       : "default";

//   return (
//     <Card elevation={3} sx={{ borderRadius: 3 }}>
//       <Box display="flex" alignItems="center" justifyContent="space-between">
//         <CardHeader
//           avatar={
//             <Avatar
//               sx={{ height: 80, width: 80 }}
//               src={activity.hostImageUrl}
//               alt="Image of host"
//             />
//           }
//           title={activity.title}
//           slotProps={{
//             title: {
//               fontWeight: "bold",
//               fontSize: 20,
//             },
//           }}
//           subheader={
//             <>
//               Hosted by <Link href={`/profiles/${activity.hostId}`}>Bob</Link>
//             </>
//           }
//         />
//         <Box display="flex" flexDirection="column" gap={2} mr={2}>
//           {(activity.isHost || activity.isGoing) && (
//             <Chip
//               label={label}
//               variant="outlined"
//               color={color}
//               sx={{ borderRadius: 2 }}
//             />
//           )}
//           {activity.isCancelled && (
//             <Chip label="Cancelled" color="error" sx={{ borderRadius: 2 }} />
//           )}
//         </Box>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
//       <CardContent sx={{ p: 0 }}>
//         <Box display="flex" alignItems="center" mb={2} px={2}>
//           <Box display="flex" flexGrow={0} alignItems="center">
//             <AccessTime sx={{ mr: 1 }} />
//             <Typography variant="body2" noWrap>
//               {formatDate(activity.date)}
//             </Typography>
//           </Box>

//           <Place sx={{ ml: 3, mr: 1 }} />
//           <Typography variant="body2">{activity.venue}</Typography>
//         </Box>
//         <Divider />
//         <Box
//           display="flex"
//           gap={2}
//           sx={{ backgroundColor: "grey.200", py: 3, pl: 3 }}
//         >
//           {activity.attendees.map((a) => (
//             <AvatarPopover profile={a} key={a.id} />
//           ))}
//         </Box>
//       </CardContent>
//       <CardContent sx={{ paddingBottom: 3 }}>
//         <Typography variant="body2">{activity.description}</Typography>
//         <Button
//           component={Link}
//           href={`/activities/${activity.id}`}
//           variant="contained"
//           color="primary"
//           sx={{ display: "flex", justifySelf: "self-end", borderRadius: 3 }}
//         >
//           View
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
