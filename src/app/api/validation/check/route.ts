/**
 * Schema Validation Check API
 *
 * Runs validation checks and setup
 * Demonstrates MongoDB schema validation implementation
 */

import { NextResponse } from "next/server";
import { SchemaValidationFeature } from "@/lib/mongodb-features/schema-validation";

export async function POST() {
  try {
    // Check if feature is enabled
    if (!SchemaValidationFeature.isEnabled()) {
      return NextResponse.json(
        { error: "Schema validation feature is not enabled" },
        { status: 404 }
      );
    }

    // Setup validation schemas
    await SchemaValidationFeature.setupValidation();

    return NextResponse.json({
      message: "Schema validation setup completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to setup validation:", error);
    return NextResponse.json(
      { error: "Failed to setup schema validation" },
      { status: 500 }
    );
  }
}
