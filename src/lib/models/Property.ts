import { ObjectId } from "mongodb";

export interface Property {
  _id?: ObjectId;
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  host: string;
  type:
    | "Entire apartment"
    | "Private room"
    | "Shared room"
    | "Entire house"
    | "Entire villa";
  amenities: string[];
  superhost: boolean;
  isFavorite?: boolean;
  description?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePropertyRequest {
  title: string;
  location: string;
  price: number;
  type: string;
  amenities: string[];
  images: string[];
  host: string;
  description?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  amenities?: string[];
  limit?: number;
  offset?: number;
}
