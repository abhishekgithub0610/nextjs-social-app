import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import agent from "../api/agent";
import { usePathname } from "next/navigation";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { currentUser } = useAccount();

  const {
    activityStore: { filter, startDate },
  } = useStore();

  /**
   * Infinite Activities Query
   */
  const {
    data: activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PagedList<Activity, string>>({
    queryKey: ["activities", filter, startDate],
    queryFn: async ({ pageParam }) => {
      const { data } = await agent.get<PagedList<Activity, string>>(
        "/activities",
        {
          params: {
            cursor: pageParam ?? null,
            pageSize: 3,
            filter,
            startDate,
          },
        },
      );
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    enabled: !id && pathname === "/activities" && !!currentUser,

    /**
     * Transform activities once inside cache
     */
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map((activity) => {
          const host = activity.attendees.find((x) => x.id === activity.hostId);

          return {
            ...activity,
            isHost: currentUser?.id === activity.hostId,
            isGoing: activity.attendees.some((x) => x.id === currentUser?.id),
            hostImageUrl: host?.imageUrl,
          };
        }),
      })),
    }),
  });

  /**
   * Single Activity Query
   */
  const { data: activity, isLoading: isLoadingActivity } = useQuery<Activity>({
    queryKey: ["activities", id],
    queryFn: async () => {
      const { data } = await agent.get<Activity>(`/activities/${id}`);
      return data;
    },
    enabled: !!id && !!currentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      const host = data.attendees.find((x) => x.id === data.hostId);

      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees.some((x) => x.id === currentUser?.id),
        hostImageUrl: host?.imageUrl,
      };
    },
  });

  /**
   * Create Activity
   */
  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const { data } = await agent.post("/activities", activity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  /**
   * Update Activity
   */
  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put(`/activities/${activity.id}`, activity);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.id],
      });
    },
  });

  /**
   * Delete Activity
   */
  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  /**
   * Update Attendance (Optimistic Update)
   */
  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      await agent.post(`/activities/${id}/attend`);
    },

    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["activities", activityId],
      });

      const previousActivity = queryClient.getQueryData<Activity>([
        "activities",
        activityId,
      ]);

      queryClient.setQueryData<Activity>(["activities", activityId], (old) => {
        if (!old || !currentUser) return old;

        const isHost = old.hostId === currentUser.id;
        const isAttending = old.attendees.some((x) => x.id === currentUser.id);

        return {
          ...old,
          isCancelled: isHost ? !old.isCancelled : old.isCancelled,
          attendees: isAttending
            ? isHost
              ? old.attendees
              : old.attendees.filter((x) => x.id !== currentUser.id)
            : [
                ...old.attendees,
                {
                  id: currentUser.id,
                  displayName: currentUser.displayName,
                  imageUrl: currentUser.imageUrl,
                },
              ],
        };
      });

      return { previousActivity };
    },

    onError: (_error, activityId, context) => {
      if (context?.previousActivity) {
        queryClient.setQueryData(
          ["activities", activityId],
          context.previousActivity,
        );
      }
    },

    onSettled: (_data, _error, activityId) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", activityId],
      });
    },
  });

  return {
    activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,

    activity,
    isLoadingActivity,

    createActivity,
    updateActivity,
    deleteActivity,
    updateAttendance,
  };
};

// import {
//   keepPreviousData,
//   useInfiniteQuery,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import agent from "../api/agent";
// import { usePathname } from "next/navigation";
// import { useAccount } from "./useAccount";
// import { useStore } from "./useStore";

// export const useActivities = (id?: string) => {
//   const queryClient = useQueryClient();
//   const pathname = usePathname();
//   const { currentUser } = useAccount();
//   const {
//     activityStore: { filter, startDate },
//   } = useStore();

//   const {
//     data: activitiesGroup,
//     isLoading,
//     isFetchingNextPage,
//     fetchNextPage,
//     hasNextPage,
//   } = useInfiniteQuery<PagedList<Activity, string>>({
//     queryKey: ["activities", filter, startDate],
//     queryFn: async ({ pageParam = null }) => {
//       const response = await agent.get<PagedList<Activity, string>>(
//         "/activities",
//         {
//           params: {
//             cursor: pageParam,
//             pageSize: 3,
//             filter,
//             startDate,
//           },
//         },
//       );
//       return response.data;
//     },
//     placeholderData: keepPreviousData,
//     initialPageParam: null,
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//     //enabled: !id && location.pathname === "/activities" && !!currentUser,
//     enabled: !id && pathname === "/activities" && !!currentUser,

//     select: (data) => ({
//       ...data,
//       pages: data.pages.map((page) => ({
//         ...page,
//         items: page.items.map((activity) => {
//           const host = activity.attendees.find((x) => x.id === activity.hostId);
//           return {
//             ...activity,
//             isHost: currentUser?.id === activity.hostId,
//             isGoing: activity.attendees.some((x) => x.id === currentUser?.id),
//             hostImageUrl: host?.imageUrl,
//           };
//         }),
//       })),
//     }),
//   });

//   const { isLoading: isLoadingActivity, data: activity } = useQuery<Activity>({
//     queryKey: ["activities", id],
//     queryFn: async () => {
//       const response = await agent.get<Activity>(`/activities/${id}`);
//       return response.data;
//     },
//     enabled: !!id && !!currentUser,
//     select: (data) => {
//       const host = data.attendees.find((x) => x.id === data.hostId);
//       return {
//         ...data,
//         isHost: currentUser?.id === data.hostId,
//         isGoing: data.attendees.some((x) => x.id === currentUser?.id),
//         hostImageUrl: host?.imageUrl,
//       };
//     },
//   });

//   const updateActivity = useMutation({
//     mutationFn: async (activity: Activity) => {
//       await agent.put(`/activities/${activity.id}`, activity);
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ["activities", activity?.id],
//       });
//     },
//   });

//   const createActivity = useMutation({
//     mutationFn: async (activity: Activity) => {
//       const response = await agent.post("/activities", activity);
//       return response.data;
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ["activities"],
//       });
//     },
//   });

//   const deleteActivity = useMutation({
//     mutationFn: async (id: string) => {
//       await agent.delete(`/activities/${id}`);
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ["activities"],
//       });
//     },
//   });

//   const updateAttendance = useMutation({
//     mutationFn: async (id: string) => {
//       await agent.post(`/activities/${id}/attend`);
//     },
//     onMutate: async (activityId: string) => {
//       await queryClient.cancelQueries({ queryKey: ["activities", activityId] });

//       const prevActivity = queryClient.getQueryData<Activity>([
//         "activities",
//         activityId,
//       ]);

//       queryClient.setQueryData<Activity>(
//         ["activities", activityId],
//         (oldActivity) => {
//           if (!oldActivity || !currentUser) {
//             return oldActivity;
//           }

//           const isHost = oldActivity.hostId === currentUser.id;
//           const isAttending = oldActivity.attendees.some(
//             (x) => x.id === currentUser.id,
//           );

//           return {
//             ...oldActivity,
//             isCancelled: isHost
//               ? !oldActivity.isCancelled
//               : oldActivity.isCancelled,
//             attendees: isAttending
//               ? isHost
//                 ? oldActivity.attendees
//                 : oldActivity.attendees.filter((x) => x.id !== currentUser.id)
//               : [
//                   ...oldActivity.attendees,
//                   {
//                     id: currentUser.id,
//                     displayName: currentUser.displayName,
//                     imageUrl: currentUser.imageUrl,
//                   },
//                 ],
//           };
//         },
//       );

//       return { prevActivity };
//     },
//     onError: (error, activityId, context) => {
//       console.error("Error updating attendance:", error);

//       if (context?.prevActivity) {
//         queryClient.setQueryData(
//           ["activities", activityId],
//           context.prevActivity,
//         );
//       }
//     },
//   });

//   return {
//     activitiesGroup,
//     isFetchingNextPage,
//     fetchNextPage,
//     hasNextPage,
//     isLoading,
//     updateActivity,
//     createActivity,
//     deleteActivity,
//     activity,
//     isLoadingActivity,
//     updateAttendance,
//   };
// };
