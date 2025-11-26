/**
 * MongoDB Feature Flags System
 *
 * This system allows toggling advanced MongoDB features for demonstrations
 * Each feature can be enabled/disabled without breaking the application
 *
 * Usage:
 * - Set feature flags to true/false to enable/disable features
 * - Components check these flags before rendering advanced functionality
 * - API endpoints conditionally implement advanced MongoDB operations
 *
 * Branch Strategy:
 * - Each feature has its own dedicated Git branch
 * - Feature flags allow combining multiple features within branches
 * - Solution architects can customize per client needs
 */

export const MONGODB_FEATURES = {
  // Foundation - Always enabled
  BASIC_CRUD: true, // Basic Create, Read, Update, Delete operations
  SIMPLE_SEARCH: true, // Basic regex-based text search

  // Advanced Features - Toggle for demonstrations
  GEOSPATIAL_SEARCH: false, // 2dsphere indexes, $near, $geoWithin queries
  ATLAS_TEXT_SEARCH: false, // Atlas Search with full-text indexing
  AGGREGATION_ANALYTICS: false, // Complex aggregation pipelines & analytics
  CHANGE_STREAMS: false, // Real-time updates with Change Streams
  TRANSACTIONS: false, // ACID multi-document transactions
  TIME_SERIES: false, // Time Series collections for metrics
  VECTOR_SEARCH: false, // AI-powered vector search & recommendations
  SCHEMA_VALIDATION: false, // JSON Schema validation & data quality
  ADVANCED_INDEXING: false, // Compound indexes, partial indexes, etc.
  MONGODB_CHARTS: false, // MongoDB Charts integration
} as const;

export type MongoDBFeature = keyof typeof MONGODB_FEATURES;

/**
 * Feature metadata for documentation and UI
 */
export const FEATURE_METADATA = {
  BASIC_CRUD: {
    name: "Basic CRUD Operations",
    description:
      "Standard Create, Read, Update, Delete operations with MongoDB",
    branch: "foundation-reset",
    complexity: "Beginner",
    useCase: "Basic data management",
    mongodbConcepts: ["Collections", "Documents", "Queries", "Updates"],
  },
  SIMPLE_SEARCH: {
    name: "Text Search with Regex",
    description: "Basic text search using MongoDB regex operators",
    branch: "foundation-reset",
    complexity: "Beginner",
    useCase: "Simple search functionality",
    mongodbConcepts: ["$regex", "$options", "Text Queries"],
  },
  GEOSPATIAL_SEARCH: {
    name: "Geospatial Queries",
    description: "Location-based search with 2dsphere indexes and geo queries",
    branch: "geospatial-search",
    complexity: "Intermediate",
    useCase: "Location-based property search, radius filtering",
    mongodbConcepts: ["2dsphere Index", "$near", "$geoWithin", "GeoJSON"],
  },
  ATLAS_TEXT_SEARCH: {
    name: "Atlas Search",
    description:
      "Full-text search with autocomplete, typo tolerance, and relevance scoring",
    branch: "atlas-search",
    complexity: "Intermediate",
    useCase: "Smart search with suggestions and ranking",
    mongodbConcepts: [
      "Atlas Search",
      "Search Indexes",
      "Autocomplete",
      "Faceting",
    ],
  },
  AGGREGATION_ANALYTICS: {
    name: "Aggregation Pipelines",
    description:
      "Complex data processing and analytics with aggregation framework",
    branch: "aggregation-analytics",
    complexity: "Advanced",
    useCase: "Property analytics, price trends, host statistics",
    mongodbConcepts: [
      "$match",
      "$group",
      "$project",
      "$facet",
      "$bucket",
      "$lookup",
    ],
  },
  CHANGE_STREAMS: {
    name: "Real-time Updates",
    description: "Live data updates using MongoDB Change Streams",
    branch: "real-time-updates",
    complexity: "Advanced",
    useCase: "Live booking updates, real-time notifications",
    mongodbConcepts: [
      "Change Streams",
      "Resume Tokens",
      "Real-time Processing",
    ],
  },
  TRANSACTIONS: {
    name: "ACID Transactions",
    description: "Multi-document transactions for data consistency",
    branch: "atomic-transactions",
    complexity: "Advanced",
    useCase: "Atomic booking process, inventory management",
    mongodbConcepts: [
      "Multi-document Transactions",
      "ACID Properties",
      "Session Management",
    ],
  },
  TIME_SERIES: {
    name: "Time Series Collections",
    description: "Specialized collections for time-stamped data and analytics",
    branch: "time-series-analytics",
    complexity: "Advanced",
    useCase: "Booking trends, price history, occupancy metrics",
    mongodbConcepts: [
      "Time Series Collections",
      "Time-based Queries",
      "Data Bucketing",
    ],
  },
  VECTOR_SEARCH: {
    name: "Vector Search & AI",
    description: "AI-powered recommendations using vector embeddings",
    branch: "ai-recommendations",
    complexity: "Expert",
    useCase: "Similar property recommendations, AI-powered search",
    mongodbConcepts: [
      "Vector Search",
      "Embeddings",
      "Similarity Queries",
      "AI Integration",
    ],
  },
  SCHEMA_VALIDATION: {
    name: "Schema Validation",
    description: "Data quality enforcement with JSON Schema validation",
    branch: "schema-validation",
    complexity: "Intermediate",
    useCase: "Data integrity, compliance, quality assurance",
    mongodbConcepts: ["JSON Schema", "Validation Rules", "Data Quality"],
  },
  ADVANCED_INDEXING: {
    name: "Advanced Indexing",
    description: "Performance optimization with specialized indexes",
    branch: "performance-optimization",
    complexity: "Expert",
    useCase: "Query performance, complex filtering",
    mongodbConcepts: [
      "Compound Indexes",
      "Partial Indexes",
      "Text Indexes",
      "Performance",
    ],
  },
  MONGODB_CHARTS: {
    name: "MongoDB Charts",
    description: "Native data visualization and business intelligence",
    branch: "data-visualization",
    complexity: "Intermediate",
    useCase: "Business dashboards, data visualization",
    mongodbConcepts: [
      "MongoDB Charts",
      "Data Visualization",
      "Business Intelligence",
    ],
  },
} as const;

/**
 * Utility functions for feature management
 */
export class FeatureManager {
  /**
   * Check if a feature is enabled
   */
  static isEnabled(feature: MongoDBFeature): boolean {
    return MONGODB_FEATURES[feature];
  }

  /**
   * Get enabled features
   */
  static getEnabledFeatures(): MongoDBFeature[] {
    return Object.entries(MONGODB_FEATURES)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature as MongoDBFeature);
  }

  /**
   * Get feature metadata
   */
  static getFeatureInfo(feature: MongoDBFeature) {
    return FEATURE_METADATA[feature];
  }

  /**
   * Get features by complexity level
   */
  static getFeaturesByComplexity(complexity: string) {
    return Object.entries(FEATURE_METADATA)
      .filter(([_, info]) => info.complexity === complexity)
      .map(([feature, _]) => feature as MongoDBFeature);
  }
}
