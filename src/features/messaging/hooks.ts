import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversation,
  fetchConversations,
  fetchMessageableProfiles,
  fetchMessages,
  sendMessage,
  startConversation,
} from "./api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    staleTime: 10_000,
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => fetchConversation(conversationId),
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { body: string; replyToMessageId: string | null }) =>
      sendMessage({ conversationId, ...input }),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messages", conversationId], (old: unknown) =>
        Array.isArray(old) ? [...old, newMessage] : [newMessage],
      );
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMessageableProfiles(query: string) {
  return useQuery({
    queryKey: ["messageable-profiles", query],
    queryFn: () => fetchMessageableProfiles(query),
    staleTime: 10_000,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (participantProfileIds: string[]) => startConversation(participantProfileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
