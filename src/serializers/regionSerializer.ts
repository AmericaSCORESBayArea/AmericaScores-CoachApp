import type { Region } from '@/interfaces/entities/region/region';

export function regionSerializer(region: Region): Region {
  const { Region } = region;

  return {
    Region,
  };
}
