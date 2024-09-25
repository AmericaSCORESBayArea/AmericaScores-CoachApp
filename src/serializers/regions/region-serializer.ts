import type { Region } from '@/interfaces/entities/region/regions-entities';

export function regionSerializer(region: Region): Region {
  const { Region } = region;

  return {
    Region,
  };
}
