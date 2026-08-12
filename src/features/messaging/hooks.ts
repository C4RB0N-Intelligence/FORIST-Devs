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
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => fetchConversation(conversationId),
    enabled: !!conversationId,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useMessageableProfiles() {
  return useQuery({
    queryKey: ["messageableProfiles"],
    queryFn: fetchMessageableProfiles,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      sendMessage(conversationId, text),
    onSuccess: (_, variables) => {
      // Refresh the chat room the user is actively in
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      // Refresh the inbox list so the preview text updates
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}