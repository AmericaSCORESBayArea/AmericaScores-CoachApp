import type { GetRegion } from '@/interfaces/entities/region/regions-entities';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const GetRegionAdapter = createEntityAdapter<GetRegion, string>({
  selectId: (region) => region.Region,
});
