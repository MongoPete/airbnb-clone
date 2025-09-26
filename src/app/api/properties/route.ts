import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { PropertyFilters } from "@/lib/models/Property";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

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
        { name: { $regex: filters.search, $options: "i" } },
        { "address.street": { $regex: filters.search, $options: "i" } },
        { "address.market": { $regex: filters.search, $options: "i" } },
        { "address.country": { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { summary: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.location) {
      query.$or = [
        { "address.street": { $regex: filters.location, $options: "i" } },
        { "address.market": { $regex: filters.location, $options: "i" } },
        { "address.country": { $regex: filters.location, $options: "i" } },
      ];
    }

    if (filters.priceMin || filters.priceMax) {
      query["price.$numberDecimal"] = {};
      if (filters.priceMin)
        (query["price.$numberDecimal"] as Record<string, unknown>).$gte =
          filters.priceMin.toString();
      if (filters.priceMax)
        (query["price.$numberDecimal"] as Record<string, unknown>).$lte =
          filters.priceMax.toString();
    }

    if (filters.type) {
      query.property_type = filters.type;
    }

    const properties = await db
      .collection("listingsAndReviews")
      .find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 20)
      .toArray();

    const total = await db
      .collection("listingsAndReviews")
      .countDocuments(query);

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
    const db = client.db("sample_airbnb");

    const propertyData = await request.json();

    // Create property object without _id (MongoDB will generate it)
    const property = {
      name: propertyData.name,
      property_type: propertyData.type,
      room_type: propertyData.room_type || "Entire home/apt",
      accommodates: propertyData.accommodates || 1,
      number_of_reviews: 0,
      amenities: propertyData.amenities || [],
      price: { $numberDecimal: propertyData.price.toString() },
      images: {
        picture_url: propertyData.images?.[0] || "/placeholder-property.jpg",
      },
      host: {
        host_id: generateId(),
        host_name: propertyData.host || "Host",
        host_is_superhost: false,
        host_has_profile_pic: true,
        host_identity_verified: true,
      },
      address: {
        street: propertyData.location || "",
        country: propertyData.country || "Unknown",
        location: { type: "Point", coordinates: [0, 0] },
      },
      description: propertyData.description || "",
      summary: propertyData.summary || "",
      // Add other fields as necessary, with default values or from propertyData
    };

    const result = await db
      .collection("listingsAndReviews")
      .insertOne(property);

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

export async function DELETE(request: NextRequest) {
  try {
    // Check for MongoDB URI in production
    if (
      !process.env.MONGODB_URI ||
      process.env.MONGODB_URI.includes("placeholder")
    ) {
      return Response.json(
        { error: "Database not configured. Please set up MongoDB Atlas." },
        { status: 503 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("id");

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const result = await db.collection("listingsAndReviews").deleteOne({
      _id: propertyId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
