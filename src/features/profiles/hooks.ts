import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowStatus, toggleFollow, getProfileByHandle, getProfilePosts } from "./api";

export function useProfile(handle: string) {
  return useQuery({
    queryKey: ["profile", handle],
    queryFn: () => getProfileByHandle(handle),
    enabled: !!handle,
  });
}

export function useProfilePosts(profileId?: string) {
  return useQuery({
    queryKey: ["profilePosts", profileId],
    queryFn: () => getProfilePosts(profileId!),
    enabled: !!profileId,
  });
}

export function useFollowStatus(targetProfileId?: string) {
  return useQuery({
    queryKey: ["followStatus", targetProfileId],
    queryFn: () => getFollowStatus(targetProfileId!),
    enabled: !!targetProfileId,
  });
}

export function useToggleFollow(targetProfileId: string, isPrivate: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFollow(targetProfileId, isPrivate),
    onSuccess: () => {
      // Refresh the button state
      queryClient.invalidateQueries({ queryKey: ["followStatus", targetProfileId] });
      
      // Refresh the profile so the Follower/Following counts instantly update!
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Also refresh the feed so new posts instantly appear
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
}