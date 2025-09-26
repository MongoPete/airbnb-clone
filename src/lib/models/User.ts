import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  verified: boolean;
  superhost: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
}
