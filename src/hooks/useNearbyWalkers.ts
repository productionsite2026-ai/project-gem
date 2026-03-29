import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNearbyWalkers = () => {
  return useQuery({
    queryKey: ["nearby_walkers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("walker_profiles")
        .select("*, profiles:user_id(id, first_name, last_name, avatar_url)")
        .eq("verified", true)
        .order("rating", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });
};
