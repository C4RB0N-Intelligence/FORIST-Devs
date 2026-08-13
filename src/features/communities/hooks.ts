import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunity, getCommunityByTag, getCommunityMembers } from "./api";

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discover-posts"] });
      queryClient.invalidateQueries({ queryKey: ["your-communities"] });
    },
  });
}

export function useCommunity(tag: string) {
  return useQuery({
    queryKey: ["community", tag],
    queryFn: () => getCommunityByTag(tag),
    enabled: !!tag,
  });
}

export function useCommunityMembers(communityId?: string) {
  return useQuery({
    queryKey: ["members", communityId],
    queryFn: () => getCommunityMembers(communityId!),
    enabled: !!communityId,
  });
}
export function useUserCommunities() {
  return useQuery({
    queryKey: ["your-communities"],
    queryFn: getUserCommunities,
  });
}

export function useRecommendedCommunities() {
  return useQuery({
    queryKey: ["recommended-communities"],
    queryFn: getRecommendedCommunities,
  });
}