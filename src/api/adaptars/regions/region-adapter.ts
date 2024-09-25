import type { Region } from '@/interfaces/entities/region/regions-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const regionAdapter = createEntityAdapter<Region, string>({
  selectId: (region) => region.Region,
});
