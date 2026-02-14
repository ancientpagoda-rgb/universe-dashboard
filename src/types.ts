export type UniverseData = {
  updatedAt: string;
  exoplanets: {
    totalConfirmed: number;
    totalHosts: number;
    sourceUrl: string;
    byYear: Array<{ year: number; count: number }>;
    byMethod: Array<{ method: string; count: number }>;
  };
  facts: Array<{ id: string; label: string; value: string; unit?: string; sourceUrl: string }>;
};
