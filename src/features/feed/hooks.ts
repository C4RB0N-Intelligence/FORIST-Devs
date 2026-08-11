import { useQuery } from "@tanstack/react-query"; 
import { fetchFeedPosts, fetchRecommendedAccounts } from "./api"; 

export function useFeedPosts() {   
  return useQuery({     
    queryKey: ["feed-posts"],     
    queryFn: fetchFeedPosts,     
    staleTime: 30_000,   
  }); 
}

export function useRecommendedAccounts() {   
  return useQuery({     
    queryKey: ["recommended-accounts"],     
    queryFn: fetchRecommendedAccounts,   
  }); 
}