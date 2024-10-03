import type { GetRegion } from '@/interfaces/entities/region/regions-entities';

export function GetRegionSerializer(region: GetRegion): GetRegion {
  const { Region } = region;

  return {
    Region,
  };
}
