export type HairCategory =
  | 'brazilian'
  | 'peruvian'
  | 'malaysian'
  | 'indian'
  | 'weavon'
  | 'closure'
  | 'frontal'
  | 'wig'
  | 'accessory';

export type HairTexture =
  | 'straight'
  | 'body-wave'
  | 'deep-wave'
  | 'curly'
  | 'kinky-curly'
  | 'loose-wave'
  | 'water-wave';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: HairCategory;
  texture?: HairTexture;
  lengthInches?: number;
  /**
   * Money is stored as an integer in kobo (1 NGN = 100 kobo).
   * This avoids floating-point rounding errors (e.g. 0.1 + 0.2 !== 0.3 in JS),
   * which matters a lot once real money is involved.
   */
  priceInKobo: number;
  currency: 'NGN';
  stockQuantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
