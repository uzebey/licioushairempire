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
  priceInKobo: number;
  currency: 'NGN';
  stockQuantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
