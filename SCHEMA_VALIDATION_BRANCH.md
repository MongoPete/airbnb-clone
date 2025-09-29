# 🛡️ MongoDB Schema Validation Branch

**Branch**: `schema-validation`  
**Feature**: JSON Schema Validation & Data Quality  
**Complexity**: Intermediate

## 🎯 What This Demonstrates

### MongoDB Features

- **JSON Schema Validation** - Enforce data structure and types
- **Validation Levels** - Moderate vs Strict validation policies
- **Data Quality Metrics** - Monitor compliance and validation stats
- **Real-time Validation** - Client and server-side validation

### Business Value

- **Data Integrity** - Ensure property listings meet quality standards
- **Compliance** - Enforce business rules and requirements
- **Error Prevention** - Catch data issues before database insertion

## 🚀 Quick Demo

1. **Switch to branch**: `git checkout schema-validation`
2. **Start app**: `npm run dev`
3. **Open MongoDB tab** (shield icon) in navigation
4. **Explore validation dashboard** with real-time metrics

## 🔧 Key Implementation

### Property Validation Schema

```javascript
{
  $jsonSchema: {
    required: ["name", "property_type", "accommodates", "price"],
    properties: {
      name: { bsonType: "string", minLength: 5, maxLength: 100 },
      property_type: { enum: ["Apartment", "House", "Villa", ...] },
      accommodates: { bsonType: "int", minimum: 1, maximum: 20 }
    }
  }
}
```

### Feature Toggle

```typescript
export const MONGODB_FEATURES = {
  SCHEMA_VALIDATION: true, // Enable/disable validation
};
```

## 📊 Dashboard Features

- **Validation Stats** - Properties/bookings validated, error counts
- **Schema Viewer** - Complete JSON schemas with rules
- **Recent Validations** - Real-time validation results
- **Compliance Rate** - Overall data quality percentage

## 🎓 Learning Outcomes

- JSON Schema design for document validation
- Validation levels (moderate/strict) and actions (error/warn)
- Data quality monitoring and metrics
- Client-side and server-side validation patterns

## 🔄 Compare Branches

- **foundation-reset** - No validation, basic CRUD
- **schema-validation** - Enforced data quality and validation

**Perfect for demonstrating MongoDB's data integrity capabilities!**
