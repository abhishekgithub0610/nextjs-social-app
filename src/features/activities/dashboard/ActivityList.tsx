"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";

const ActivityList = observer(function ActivityList() {
  const {
    activitiesGroup,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useActivities();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", // pre-load before reaching bottom
  });

  // Flatten pages into a single array for easier rendering
  const activities = useMemo(() => {
    if (!activitiesGroup?.pages) return [];
    return activitiesGroup.pages.flatMap((page) => page.items);
  }, [activitiesGroup]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initial loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={120} />
        ))}
      </Box>
    );
  }

  // Empty state
  if (!activities.length) {
    return <Typography>No activities found</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activities.map((activity, index) => {
        const isLastItem = index === activities.length - 1;

        return (
          <Box key={activity.id} ref={isLastItem ? ref : undefined}>
            <ActivityCard activity={activity} />
          </Box>
        );
      })}

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </Box>
      )}
    </Box>
  );
});

export default ActivityList;

// "use client";
// import { Box, Typography } from "@mui/material";
// import ActivityCard from "./ActivityCard";
// import { useActivities } from "../../../lib/hooks/useActivities";
// import { useInView } from "react-intersection-observer";
// import { useEffect } from "react";
// import { observer } from "mobx-react-lite";

// const ActivityList = observer(function ActivityList() {
//   const { activitiesGroup, isLoading, fetchNextPage, hasNextPage } =
//     useActivities();

//   const { ref, inView } = useInView({
//     threshold: 0.5,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, fetchNextPage]);

//   if (isLoading) return <Typography>Loading...</Typography>;

//   if (!activitiesGroup) return <Typography>No activities found</Typography>;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//       <>
//         {activitiesGroup.pages.map((activities, index) => (
//           <Box
//             key={index}
//             ref={index === activitiesGroup.pages.length - 1 ? ref : null}
//             display="flex"
//             flexDirection="column"
//             gap={3}
//           >
//             {activities.items.map((activity) => (
//               <ActivityCard key={activity.id} activity={activity} />
//             ))}
//           </Box>
//         ))}
//       </>
//     </Box>
//   );
// });

// export default ActivityList;
