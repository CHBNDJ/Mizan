import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { LawyerSearchResult, SearchFilters } from "@/types";

export function useSearch(filters: SearchFilters = {}) {
  const supabase = createClient();
  const [results, setResults] = useState<LawyerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("lawyers")
        .select(
          `
          id,
          bar_number,
          specializations,
          wilayas,
          experience_years,
          consultation_price,
          rating,
          rating_google,
          rating_mizan,
          reviews_count,
          reviews_count_google,
          reviews_count_mizan,
          is_verified,
          subscription_status,
          subscription_plan,
          ranking_score,
          users!inner (
            first_name,
            last_name,
            gender,
            avatar_url,
            location,
            languages,
            verified
          )
        `,
          { count: "exact" }
        )
        .eq("is_verified", true)
        .eq("users.verified", true);

      if (filters.specialization) {
        query = query.contains("specializations", [filters.specialization]);
      }
      if (filters.wilaya) {
        query = query.or(
          `wilayas.cs.{${filters.wilaya}},users.location.ilike.%${filters.wilaya}%`
        );
      }
      if (filters.minRating) {
        query = query.gte("rating", filters.minRating);
      }
      if (filters.query) {
        query = query.or(
          `users.first_name.ilike.%${filters.query}%,users.last_name.ilike.%${filters.query}%`
        );
      }

      switch (filters.sortBy) {
        case "rating":
          query = query.order("rating", {
            ascending: false,
            nullsFirst: false,
          });
          break;
        case "experience":
          query = query.order("experience_years", {
            ascending: false,
            nullsFirst: false,
          });
          break;
        default:
          query = query.order("ranking_score", {
            ascending: false,
            nullsFirst: false,
          });
          break;
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Erreur recherche:", error);
        setResults([]);
        return;
      }

      const formatted: LawyerSearchResult[] = (data || []).map((item: any) => ({
        id: item.id,
        bar_number: item.bar_number,
        specializations: item.specializations || [],
        wilayas: item.wilayas || [],
        experience_years: item.experience_years,
        consultation_price: item.consultation_price,
        rating: item.rating ? parseFloat(item.rating) : null,
        rating_google: item.rating_google,
        rating_mizan: item.rating_mizan,
        reviews_count: item.reviews_count || 0,
        reviews_count_google: item.reviews_count_google || 0,
        reviews_count_mizan: item.reviews_count_mizan || 0,
        is_verified: item.is_verified,
        subscription_status: item.subscription_status,
        subscription_plan: item.subscription_plan,
        ranking_score: item.ranking_score || 0,
        first_name: item.users?.first_name || "",
        last_name: item.users?.last_name || "",
        gender: item.users?.gender || null,
        avatar_url: item.users?.avatar_url || null,
        location: item.users?.location || null,
        languages: item.users?.languages || [],
      }));

      setResults(formatted);
      setTotal(count || 0);
    } finally {
      setLoading(false);
    }
  }, [
    filters.query,
    filters.specialization,
    filters.wilaya,
    filters.minRating,
    filters.sortBy,
  ]);

  useEffect(() => {
    search();
  }, [search]);

  return { results, loading, total, refetch: search };
}
