import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIsFollowing, fetchProfileByHandle, fetchProfilePosts, toggleFollow } from "./api";

export function useProfile(handle: string) {
  return useQuery({
    queryKey: ["profile", handle],
    queryFn: () => fetchProfileByHandle(handle),
  });
}

export function useProfilePosts(profileId: string | undefined) {
  return useQuery({
    queryKey: ["profile-posts", profileId],
    queryFn: () => fetchProfilePosts(profileId as string),
    enabled: Boolean(profileId),
  });
}

export function useFollowStatus(profileId: string | undefined) {
  return useQuery({
    queryKey: ["follow-status", profileId],
    queryFn: () => fetchIsFollowing(profileId as string),
    enabled: Boolean(profileId),
  });
}

export function useToggleFollow(profileId: string, isPrivateTarget: boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFollow(profileId, isPrivateTarget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", profileId] });
    },
  });
}