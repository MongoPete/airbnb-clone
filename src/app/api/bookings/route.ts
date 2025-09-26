import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Booking, BookingFilters } from "@/lib/models/Booking";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb-localhost");

    const { searchParams } = new URL(request.url);
    const filters: BookingFilters = {
      userId: searchParams.get("userId") || undefined,
      propertyId: searchParams.get("propertyId") || undefined,
      status: searchParams.get("status") || undefined,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    };

    // Build MongoDB query
    const query: any = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.propertyId) {
      query.propertyId = filters.propertyId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const bookings = await db
      .collection("bookings")
      .find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 20)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection("bookings").countDocuments(query);

    return NextResponse.json({
      bookings,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
      limit: filters.limit || 20,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("airbnb-localhost");

    const bookingData = await request.json();

    const booking: Booking = {
      id: generateId(),
      ...bookingData,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check for conflicting bookings
    const existingBooking = await db.collection("bookings").findOne({
      propertyId: booking.propertyId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: booking.checkOut },
          checkOut: { $gte: booking.checkIn },
        },
      ],
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Property is not available for selected dates" },
        { status: 409 }
      );
    }

    const result = await db.collection("bookings").insertOne(booking);

    return NextResponse.json(
      {
        id: result.insertedId,
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
