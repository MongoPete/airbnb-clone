import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Favorite, FavoriteFilters } from "@/lib/models/Favorite";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const { searchParams } = new URL(request.url);
    const filters: FavoriteFilters = {
      userId: searchParams.get("userId") || undefined,
      propertyId: searchParams.get("propertyId") || undefined,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    };

    // Build MongoDB query
    const query: Record<string, unknown> = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.propertyId) {
      query.propertyId = filters.propertyId;
    }

    const favorites = await db
      .collection("favorites")
      .find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 20)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection("favorites").countDocuments(query);

    // If fetching for a specific user, also get the property details
    if (filters.userId && !filters.propertyId) {
      const propertyIds = favorites.map((fav) => fav.propertyId);
      const properties = await db
        .collection("properties")
        .find({ id: { $in: propertyIds } })
        .toArray();

      return NextResponse.json({
        favorites: favorites.map((fav) => ({
          ...fav,
          property: properties.find((prop) => prop.id === fav.propertyId),
        })),
        total,
        page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
        limit: filters.limit || 20,
      });
    }

    return NextResponse.json({
      favorites,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
      limit: filters.limit || 20,
    });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const { userId, propertyId } = await request.json();

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: "userId and propertyId are required" },
        { status: 400 }
      );
    }

    // Check if favorite already exists
    const existingFavorite = await db.collection("favorites").findOne({
      userId,
      propertyId,
    });

    if (existingFavorite) {
      // Remove from favorites (toggle off)
      await db.collection("favorites").deleteOne({
        userId,
        propertyId,
      });

      return NextResponse.json({
        message: "Removed from favorites",
        isFavorite: false,
      });
    } else {
      // Add to favorites (toggle on)
      const favorite: Favorite = {
        id: generateId(),
        userId,
        propertyId,
        createdAt: new Date(),
      };

      const result = await db.collection("favorites").insertOne(favorite);

      return NextResponse.json(
        {
          id: result.insertedId,
          favorite,
          message: "Added to favorites",
          isFavorite: true,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
