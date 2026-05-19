// API configuration and service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Property {
  id: number;
  title: string;
  description: string;
  property_type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial';
  status: 'sale' | 'rent' | 'sold' | 'rented';
  price: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  parking_spaces: number;
  has_garage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  primary_image?: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  caption: string;
  is_primary: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Fetch all properties with optional filters
export async function fetchProperties(params?: {
  property_type?: string;
  status?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<Property>> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/properties/?${queryParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch a single property by ID
export async function fetchPropertyById(id: number): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}/`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch featured properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  const response = await fetch(`${API_BASE_URL}/properties/featured/`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured properties: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch properties for sale
export async function fetchPropertiesForSale(page?: number): Promise<PaginatedResponse<Property>> {
  const queryParams = page ? `?page=${page}` : '';
  const response = await fetch(`${API_BASE_URL}/properties/for_sale/${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch properties for sale: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch properties for rent
export async function fetchPropertiesForRent(page?: number): Promise<PaginatedResponse<Property>> {
  const queryParams = page ? `?page=${page}` : '';
  const response = await fetch(`${API_BASE_URL}/properties/for_rent/${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch properties for rent: ${response.statusText}`);
  }
  
  return response.json();
}
