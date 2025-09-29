/**
 * Schema Validation Stats API
 *
 * Provides validation statistics and metrics
 * Demonstrates MongoDB schema validation monitoring
 */

import { NextResponse } from "next/server";
import { SchemaValidationFeature } from "@/lib/mongodb-features/schema-validation";

export async function GET() {
  try {
    // Check if feature is enabled
    if (!SchemaValidationFeature.isEnabled()) {
      return NextResponse.json(
        { error: "Schema validation feature is not enabled" },
        { status: 404 }
      );
    }

    // Get validation statistics
    const stats = await SchemaValidationFeature.getValidationStats();

    // Calculate compliance rate
    const totalDocuments = stats.propertiesValidated + stats.bookingsValidated;
    const complianceRate =
      totalDocuments > 0
        ? ((totalDocuments - stats.validationErrors) / totalDocuments) * 100
        : 100;

    return NextResponse.json({
      ...stats,
      complianceRate: Math.round(complianceRate * 10) / 10, // Round to 1 decimal
    });
  } catch (error) {
    console.error("Failed to fetch validation stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch validation statistics" },
      { status: 500 }
    );
  }
}
