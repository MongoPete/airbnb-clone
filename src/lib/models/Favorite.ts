import { ObjectId } from "mongodb";

export interface Favorite {
  _id?: ObjectId;
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
}

export interface CreateFavoriteRequest {
  userId: string;
  propertyId: string;
}

export interface FavoriteFilters {
  userId?: string;
  propertyId?: string;
  limit?: number;
  offset?: number;
}
