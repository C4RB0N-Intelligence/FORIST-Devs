import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChannelMessages, sendChannelMessage } from "./api";
import { getCommunityMembers } from "../communities/api";

export function useCommunityMembers(communityId?: string) {
  return useQuery({
    queryKey: ["members", communityId],
    queryFn: () => getCommunityMembers(communityId!),
    enabled: !!communityId,
  });
}

export function useChannelMessages(channelId?: string) {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => getChannelMessages(channelId!),
    enabled: !!channelId,
    refetchInterval: 3000, // Quick polling for real-time feel until we add WebSockets
  });
}

export function useSendChannelMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendChannelMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.channelId] });
    },
  });
}