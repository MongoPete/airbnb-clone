/**
 * MongoDB Schema Validation Feature
 *
 * Demonstrates JSON Schema validation for data quality and compliance
 * Features:
 * - Property validation schema
 * - Booking validation schema
 * - User validation schema
 * - Data quality checks
 * - Validation error handling
 */

import { MONGODB_FEATURES } from "@/lib/features";
import clientPromise from "@/lib/mongodb";
import { Db, Collection } from "mongodb";

export class SchemaValidationFeature {
  static isEnabled = () => MONGODB_FEATURES.SCHEMA_VALIDATION;

  /**
   * Property validation schema
   */
  static readonly PROPERTY_SCHEMA = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "name",
        "property_type",
        "room_type",
        "accommodates",
        "price",
        "host",
        "address",
      ],
      properties: {
        name: {
          bsonType: "string",
          minLength: 5,
          maxLength: 100,
          description: "Property name must be 5-100 characters",
        },
        property_type: {
          bsonType: "string",
          enum: [
            "Apartment",
            "House",
            "Condominium",
            "Loft",
            "Villa",
            "Townhouse",
            "Cabin",
            "Boat",
            "Other",
          ],
          description: "Property type must be from allowed list",
        },
        room_type: {
          bsonType: "string",
          enum: [
            "Entire home/apt",
            "Private room",
            "Shared room",
            "Hotel room",
          ],
          description: "Room type must be from allowed list",
        },
        accommodates: {
          bsonType: "int",
          minimum: 1,
          maximum: 20,
          description: "Must accommodate 1-20 guests",
        },
        bedrooms: {
          bsonType: ["int", "null"],
          minimum: 0,
          maximum: 10,
          description: "Bedrooms must be 0-10",
        },
        bathrooms: {
          bsonType: "object",
          required: ["$numberDecimal"],
          properties: {
            $numberDecimal: {
              bsonType: "string",
              pattern: "^[0-9]+(\\.[0-9]+)?$",
              description: "Bathrooms must be a valid decimal number",
            },
          },
        },
        price: {
          bsonType: "object",
          required: ["$numberDecimal"],
          properties: {
            $numberDecimal: {
              bsonType: "string",
              pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
              description: "Price must be a valid currency amount",
            },
          },
        },
        amenities: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1,
          },
          maxItems: 50,
          description: "Amenities must be array of strings, max 50 items",
        },
        host: {
          bsonType: "object",
          required: ["host_id", "host_name", "host_is_superhost"],
          properties: {
            host_id: {
              bsonType: "string",
              minLength: 1,
              description: "Host ID is required",
            },
            host_name: {
              bsonType: "string",
              minLength: 2,
              maxLength: 50,
              description: "Host name must be 2-50 characters",
            },
            host_is_superhost: {
              bsonType: "bool",
              description: "Superhost status must be boolean",
            },
          },
        },
        address: {
          bsonType: "object",
          required: ["street", "country", "location"],
          properties: {
            street: {
              bsonType: "string",
              minLength: 5,
              maxLength: 200,
              description: "Street address must be 5-200 characters",
            },
            country: {
              bsonType: "string",
              minLength: 2,
              maxLength: 100,
              description: "Country is required",
            },
            location: {
              bsonType: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  bsonType: "string",
                  enum: ["Point"],
                  description: "Location type must be 'Point'",
                },
                coordinates: {
                  bsonType: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: {
                    bsonType: "double",
                    minimum: -180,
                    maximum: 180,
                  },
                  description:
                    "Coordinates must be [longitude, latitude] within valid range",
                },
              },
            },
          },
        },
      },
      additionalProperties: true,
    },
  };

  /**
   * Booking validation schema
   */
  static readonly BOOKING_SCHEMA = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "propertyId",
        "userId",
        "checkIn",
        "checkOut",
        "guests",
        "totalPrice",
        "status",
      ],
      properties: {
        propertyId: {
          bsonType: "string",
          minLength: 1,
          description: "Property ID is required",
        },
        userId: {
          bsonType: "string",
          minLength: 1,
          description: "User ID is required",
        },
        checkIn: {
          bsonType: "date",
          description: "Check-in date is required",
        },
        checkOut: {
          bsonType: "date",
          description: "Check-out date is required",
        },
        guests: {
          bsonType: "int",
          minimum: 1,
          maximum: 20,
          description: "Number of guests must be 1-20",
        },
        totalPrice: {
          bsonType: "double",
          minimum: 0,
          description: "Total price must be positive",
        },
        status: {
          bsonType: "string",
          enum: ["pending", "confirmed", "cancelled", "completed"],
          description: "Status must be from allowed list",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation date is required",
        },
      },
      additionalProperties: false,
    },
  };

  /**
   * Apply schema validation to collections
   */
  static async setupValidation(): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      const client = await clientPromise;
      const db = client.db("sample_airbnb");

      // Apply property validation
      await this.applyPropertyValidation(db);

      // Apply booking validation
      await this.applyBookingValidation(db);

      console.log("✅ Schema validation applied successfully");
    } catch (error) {
      console.error("❌ Failed to setup schema validation:", error);
      throw error;
    }
  }

  /**
   * Apply validation to properties collection
   */
  private static async applyPropertyValidation(db: Db): Promise<void> {
    try {
      await db.command({
        collMod: "listingsAndReviews",
        validator: this.PROPERTY_SCHEMA,
        validationLevel: "moderate", // Only validate new inserts and updates
        validationAction: "error", // Reject invalid documents
      });

      console.log("✅ Property validation schema applied");
    } catch (error: any) {
      // Collection might not exist yet, create it with validation
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("listingsAndReviews", {
          validator: this.PROPERTY_SCHEMA,
          validationLevel: "moderate",
          validationAction: "error",
        });
        console.log("✅ Created properties collection with validation");
      } else {
        console.warn("⚠️  Property validation setup warning:", error.message);
      }
    }
  }

  /**
   * Apply validation to bookings collection
   */
  private static async applyBookingValidation(db: Db): Promise<void> {
    try {
      await db.command({
        collMod: "bookings",
        validator: this.BOOKING_SCHEMA,
        validationLevel: "strict", // Validate all documents
        validationAction: "error", // Reject invalid documents
      });

      console.log("✅ Booking validation schema applied");
    } catch (error: any) {
      // Collection might not exist yet, create it with validation
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("bookings", {
          validator: this.BOOKING_SCHEMA,
          validationLevel: "strict",
          validationAction: "error",
        });
        console.log("✅ Created bookings collection with validation");
      } else {
        console.warn("⚠️  Booking validation setup warning:", error.message);
      }
    }
  }

  /**
   * Validate a property document before insertion
   */
  static validateProperty(property: any): {
    isValid: boolean;
    errors: string[];
  } {
    if (!this.isEnabled()) return { isValid: true, errors: [] };

    const errors: string[] = [];

    // Required field checks
    if (
      !property.name ||
      property.name.length < 5 ||
      property.name.length > 100
    ) {
      errors.push("Property name must be 5-100 characters");
    }

    if (
      !property.property_type ||
      ![
        "Apartment",
        "House",
        "Condominium",
        "Loft",
        "Villa",
        "Townhouse",
        "Cabin",
        "Boat",
        "Other",
      ].includes(property.property_type)
    ) {
      errors.push("Property type must be from allowed list");
    }

    if (
      !property.accommodates ||
      property.accommodates < 1 ||
      property.accommodates > 20
    ) {
      errors.push("Must accommodate 1-20 guests");
    }

    if (!property.price || !property.price.$numberDecimal) {
      errors.push("Price is required and must be a valid decimal");
    }

    if (!property.host || !property.host.host_id || !property.host.host_name) {
      errors.push("Host information is required");
    }

    if (
      !property.address ||
      !property.address.street ||
      !property.address.country
    ) {
      errors.push("Address with street and country is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a booking document before insertion
   */
  static validateBooking(booking: any): { isValid: boolean; errors: string[] } {
    if (!this.isEnabled()) return { isValid: true, errors: [] };

    const errors: string[] = [];

    // Required field checks
    if (!booking.propertyId) {
      errors.push("Property ID is required");
    }

    if (!booking.userId) {
      errors.push("User ID is required");
    }

    if (!booking.checkIn || !booking.checkOut) {
      errors.push("Check-in and check-out dates are required");
    }

    if (
      booking.checkIn &&
      booking.checkOut &&
      new Date(booking.checkIn) >= new Date(booking.checkOut)
    ) {
      errors.push("Check-out date must be after check-in date");
    }

    if (!booking.guests || booking.guests < 1 || booking.guests > 20) {
      errors.push("Number of guests must be 1-20");
    }

    if (typeof booking.totalPrice !== "number" || booking.totalPrice <= 0) {
      errors.push("Total price must be a positive number");
    }

    if (
      !["pending", "confirmed", "cancelled", "completed"].includes(
        booking.status
      )
    ) {
      errors.push(
        "Status must be: pending, confirmed, cancelled, or completed"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get validation statistics
   */
  static async getValidationStats(): Promise<{
    propertiesValidated: number;
    bookingsValidated: number;
    validationErrors: number;
  }> {
    if (!this.isEnabled()) {
      return {
        propertiesValidated: 0,
        bookingsValidated: 0,
        validationErrors: 0,
      };
    }

    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const propertiesCount = await db
      .collection("listingsAndReviews")
      .countDocuments();
    const bookingsCount = await db.collection("bookings").countDocuments();

    return {
      propertiesValidated: propertiesCount,
      bookingsValidated: bookingsCount,
      validationErrors: 0, // Would need to track this in a separate collection
    };
  }
}
