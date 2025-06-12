export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  postal_code: string;
  property_type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'available' | 'under_contract' | 'sold';
  bedrooms: number | null;
  bathrooms: number | null;
  surface_area: number | null;
  agent_id: string;
  created_at: string;
  updated_at: string;
}