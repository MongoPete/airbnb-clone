import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Property, PropertyFilters } from "@/lib/models/Property";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb-localhost");

    const { searchParams } = new URL(request.url);
    const filters: PropertyFilters = {
      search: searchParams.get("search") || undefined,
      location: searchParams.get("location") || undefined,
      priceMin: searchParams.get("priceMin")
        ? parseInt(searchParams.get("priceMin")!)
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? parseInt(searchParams.get("priceMax")!)
        : undefined,
      type: searchParams.get("type") || undefined,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    };

    // Build MongoDB query
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { location: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.priceMin || filters.priceMax) {
      query.price = {};
      if (filters.priceMin) query.price.$gte = filters.priceMin;
      if (filters.priceMax) query.price.$lte = filters.priceMax;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const properties = await db
      .collection("properties")
      .find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 20)
      .toArray();

    const total = await db.collection("properties").countDocuments(query);

    return NextResponse.json({
      properties,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
      limit: filters.limit || 20,
    });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb-localhost");

    const propertyData = await request.json();

    const property: Property = {
      id: generateId(),
      ...propertyData,
      rating: 0,
      reviewCount: 0,
      superhost: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("properties").insertOne(property);

    return NextResponse.json(
      {
        id: result.insertedId,
        property,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
