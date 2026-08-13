import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeedPosts, fetchRecommendedAccounts, createPost, fetchDiscoverPosts } from "./api";

export function useFeedPosts() {
  return useQuery({
    queryKey: ["feed-posts"],
    queryFn: fetchFeedPosts,
  });
}

// --- NEW HOOK ---
export function useDiscoverPosts(searchQuery?: string | null) {
  return useQuery({
    queryKey: ["discover-posts", searchQuery],
    queryFn: () => fetchDiscoverPosts(searchQuery),
  });
}

export function useRecommendedAccounts() {
  return useQuery({
    queryKey: ["recommended-accounts"],
    queryFn: fetchRecommendedAccounts,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["discover-posts"] });
    },
  });
}