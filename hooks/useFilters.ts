import { useState } from "react";
import { FilterState } from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  language: "en",
  tempoMin: 80,
  tempoMax: 140,
  danceabilityMin: 0.5,
  genres: [],
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return { filters, setFilters, resetFilters };
}
