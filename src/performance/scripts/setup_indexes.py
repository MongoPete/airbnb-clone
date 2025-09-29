"""
MongoDB Performance Indexes Setup

This script creates optimized indexes for the Airbnb demo application
to demonstrate performance improvements in MongoDB queries.

Usage:
    python setup_indexes.py
"""

import os
import sys
from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT, GEO2D
from pymongo.errors import OperationFailure
from datetime import datetime

class MongoDBIndexManager:
    def __init__(self, connection_string=None):
        """Initialize MongoDB connection"""
        self.connection_string = connection_string or os.getenv(
            'MONGODB_URI', 
            'mongodb+srv://demoPete:demoPete@back-to-basics-crud.fvu2crg.mongodb.net/sample_airbnb'
        )
        self.client = MongoClient(self.connection_string)
        self.db = self.client.sample_airbnb
        self.properties = self.db.listingsAndReviews
        self.bookings = self.db.bookings
        
    def remove_performance_indexes(self):
        """Remove all performance indexes to establish baseline"""
        print("🧹 Removing performance indexes for baseline testing...")
        
        indexes_to_remove = [
            "property_search_compound",
            "location_2dsphere", 
            "text_search_compound",
            "price_range_index",
            "reviews_rating_index",
            "high_rated_properties_partial",
            "market_type_compound",
            "accommodates_reviews_compound"
        ]
        
        for index_name in indexes_to_remove:
            try:
                self.properties.drop_index(index_name)
                print(f"   ✅ Removed: {index_name}")
            except OperationFailure as e:
                if "index not found" in str(e).lower():
                    print(f"   ⚠️  Index not found: {index_name}")
                else:
                    print(f"   ❌ Error removing {index_name}: {e}")
        
        print("🏁 Baseline setup complete - no performance indexes!")
        
    def setup_performance_indexes(self):
        """Create optimized indexes for performance testing"""
        print("🚀 Setting up MongoDB performance indexes...")
        print("=" * 50)
        
        # 1. Compound index for property search
        try:
            self.properties.create_index([
                ("address.market", ASCENDING),
                ("property_type", ASCENDING),
                ("accommodates", ASCENDING),
                ("number_of_reviews", ASCENDING)
            ], 
            name="property_search_compound",
            background=True)
            print("✅ Created: property_search_compound")
            print("   Optimizes: Market + Property Type + Guests + Reviews queries")
        except Exception as e:
            print(f"❌ Error creating property_search_compound: {e}")

        # 2. 2dsphere index for geospatial queries
        try:
            self.properties.create_index([
                ("address.location", "2dsphere")
            ], 
            name="location_2dsphere",
            background=True)
            print("✅ Created: location_2dsphere")
            print("   Optimizes: $near, $geoWithin, $geoIntersects queries")
        except Exception as e:
            print(f"❌ Error creating location_2dsphere: {e}")

        # 3. Text index for search functionality
        try:
            self.properties.create_index([
                ("name", TEXT),
                ("description", TEXT),
                ("summary", TEXT),
                ("space", TEXT)
            ], 
            name="text_search_compound",
            background=True,
            weights={
                "name": 10,
                "summary": 5,
                "description": 2,
                "space": 1
            })
            print("✅ Created: text_search_compound")
            print("   Optimizes: $text search with relevance scoring")
        except Exception as e:
            print(f"❌ Error creating text_search_compound: {e}")

        # 4. Price range index
        try:
            self.properties.create_index([
                ("price.$numberDecimal", ASCENDING)
            ], 
            name="price_range_index",
            background=True)
            print("✅ Created: price_range_index")
            print("   Optimizes: Price range queries")
        except Exception as e:
            print(f"❌ Error creating price_range_index: {e}")

        # 5. Reviews and rating index
        try:
            self.properties.create_index([
                ("number_of_reviews", DESCENDING),
                ("review_scores.review_scores_rating", DESCENDING)
            ], 
            name="reviews_rating_index",
            background=True)
            print("✅ Created: reviews_rating_index")
            print("   Optimizes: Sorting by reviews and ratings")
        except Exception as e:
            print(f"❌ Error creating reviews_rating_index: {e}")

        # 6. Partial index for high-rated properties only
        try:
            self.properties.create_index([
                ("property_type", ASCENDING),
                ("review_scores.review_scores_rating", DESCENDING),
                ("number_of_reviews", DESCENDING)
            ], 
            name="high_rated_properties_partial",
            partialFilterExpression={
                "number_of_reviews": {"$gte": 10},
                "review_scores.review_scores_rating": {"$gte": 80}
            },
            background=True)
            print("✅ Created: high_rated_properties_partial")
            print("   Optimizes: Queries for well-reviewed properties only")
        except Exception as e:
            print(f"❌ Error creating high_rated_properties_partial: {e}")

        # 7. Compound index for market analysis
        try:
            self.properties.create_index([
                ("address.market", ASCENDING),
                ("property_type", ASCENDING),
                ("price.$numberDecimal", ASCENDING)
            ], 
            name="market_type_compound",
            background=True)
            print("✅ Created: market_type_compound")
            print("   Optimizes: Market analysis and aggregations")
        except Exception as e:
            print(f"❌ Error creating market_type_compound: {e}")

        # 8. Accommodates and reviews compound
        try:
            self.properties.create_index([
                ("accommodates", ASCENDING),
                ("number_of_reviews", DESCENDING),
                ("review_scores.review_scores_rating", DESCENDING)
            ], 
            name="accommodates_reviews_compound",
            background=True)
            print("✅ Created: accommodates_reviews_compound")
            print("   Optimizes: Guest capacity with quality sorting")
        except Exception as e:
            print(f"❌ Error creating accommodates_reviews_compound: {e}")

        print("\n🎯 Performance indexes setup complete!")
        
    def create_booking_indexes(self):
        """Create indexes for booking collection"""
        print("\n📅 Setting up booking collection indexes...")
        
        try:
            # Booking lookup index
            self.bookings.create_index([
                ("userId", ASCENDING),
                ("status", ASCENDING),
                ("checkIn", ASCENDING)
            ], 
            name="user_booking_lookup",
            background=True)
            print("✅ Created: user_booking_lookup")
            
            # Property booking history
            self.bookings.create_index([
                ("propertyId", ASCENDING),
                ("checkOut", DESCENDING)
            ], 
            name="property_booking_history",
            background=True)
            print("✅ Created: property_booking_history")
            
        except Exception as e:
            print(f"❌ Error creating booking indexes: {e}")
    
    def show_index_stats(self):
        """Display current index statistics"""
        print("\n📊 Current Index Statistics:")
        print("=" * 50)
        
        try:
            indexes = list(self.properties.list_indexes())
            
            print(f"📋 Total Indexes: {len(indexes)}")
            print("\n🗂️  Index Details:")
            
            for idx in indexes:
                name = idx.get('name', 'unknown')
                key = idx.get('key', {})
                size = idx.get('indexSizes', {}).get(name, 'unknown')
                
                print(f"   📌 {name}")
                print(f"      Fields: {dict(key)}")
                if 'partialFilterExpression' in idx:
                    print(f"      Partial: {idx['partialFilterExpression']}")
                if 'weights' in idx:
                    print(f"      Weights: {idx['weights']}")
                print()
                
        except Exception as e:
            print(f"❌ Error getting index stats: {e}")
    
    def run_index_performance_check(self):
        """Run sample queries to verify index usage"""
        print("\n🔍 Running Index Performance Check:")
        print("-" * 40)
        
        test_queries = [
            {
                "name": "Property Search",
                "query": {
                    "address.market": {"$regex": "New York", "$options": "i"},
                    "property_type": "Apartment",
                    "accommodates": {"$gte": 2}
                }
            },
            {
                "name": "Geospatial Query",
                "query": {
                    "address.location": {
                        "$near": {
                            "$geometry": {"type": "Point", "coordinates": [-73.985, 40.758]},
                            "$maxDistance": 1000
                        }
                    }
                }
            },
            {
                "name": "Price Range",
                "query": {
                    "price.$numberDecimal": {"$gte": "100", "$lte": "300"}
                }
            },
            {
                "name": "Text Search",
                "query": {
                    "$text": {"$search": "modern apartment"}
                }
            }
        ]
        
        for test in test_queries:
            try:
                start_time = datetime.now()
                count = self.properties.count_documents(test["query"])
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds() * 1000
                
                print(f"✅ {test['name']}: {count} docs in {duration:.2f}ms")
                
            except Exception as e:
                print(f"❌ {test['name']}: Error - {e}")
    
    def close(self):
        """Close MongoDB connection"""
        self.client.close()


def main():
    """Main execution function"""
    print("🍃 MongoDB Performance Index Manager")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        action = sys.argv[1].lower()
    else:
        print("Available actions:")
        print("  setup    - Create performance indexes")
        print("  remove   - Remove performance indexes (for baseline)")
        print("  stats    - Show current index statistics")
        print("  check    - Run performance check")
        print()
        action = input("Choose action (setup/remove/stats/check): ").lower()
    
    manager = MongoDBIndexManager()
    
    try:
        if action == "setup":
            manager.setup_performance_indexes()
            manager.create_booking_indexes()
            manager.show_index_stats()
            manager.run_index_performance_check()
            
        elif action == "remove":
            manager.remove_performance_indexes()
            
        elif action == "stats":
            manager.show_index_stats()
            
        elif action == "check":
            manager.run_index_performance_check()
            
        else:
            print(f"❌ Unknown action: {action}")
            
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        manager.close()
        print("\n👋 MongoDB connection closed")


if __name__ == "__main__":
    main()
