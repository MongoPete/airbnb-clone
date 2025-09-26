import { ObjectId } from "mongodb";

export interface Booking {
  _id?: ObjectId;
  id: string;
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}

export interface BookingFilters {
  userId?: string;
  propertyId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
