"""
MongoDB Performance Testing - Baseline (No Indexes)

This script tests MongoDB performance WITHOUT proper indexing
to establish baseline metrics for comparison.

Usage:
    locust -f baseline_tests.py --host mongodb+srv://your-connection --users 50 --spawn-rate 5 --run-time 60s
"""

from locust import User, task, between, events
from pymongo import MongoClient
import random
import time
import os
from datetime import datetime, timedelta

class MongoDBBaselineUser(User):
    wait_time = between(0.1, 0.5)
    
    def on_start(self):
        """Initialize MongoDB connection"""
        connection_string = os.getenv('MONGODB_URI', 'mongodb+srv://demoPete:demoPete@back-to-basics-crud.fvu2crg.mongodb.net/sample_airbnb')
        self.client = MongoClient(connection_string)
        self.db = self.client.sample_airbnb
        self.properties = self.db.listingsAndReviews
        self.bookings = self.db.bookings
        
        # Sample data for testing
        self.test_markets = ["New York", "San Francisco", "London", "Paris", "Tokyo", "Sydney"]
        self.property_types = ["Apartment", "House", "Condominium", "Loft", "Villa"]
        self.coordinates = [
            [-73.985, 40.758],  # NYC
            [-122.419, 37.775], # SF
            [-0.127, 51.507],   # London
            [2.349, 48.853],    # Paris
            [139.691, 35.689],  # Tokyo
            [151.209, -33.867]  # Sydney
        ]

    @task(3)
    def search_properties_no_index(self):
        """Property search without compound indexes - SLOW"""
        start_time = time.time()
        market = random.choice(self.test_markets)
        property_type = random.choice(self.property_types)
        min_guests = random.randint(1, 4)
        
        try:
            # This query will be slow without proper indexes
            cursor = self.properties.find({
                "address.market": {"$regex": market, "$options": "i"},
                "property_type": property_type,
                "accommodates": {"$gte": min_guests},
                "number_of_reviews": {"$gte": 10}
            }).limit(20)
            
            results = list(cursor)
            
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="property_search_no_index",
                response_time=total_time,
                response_length=len(results),
                exception=None,
                context={"market": market, "type": property_type}
            )
            
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="property_search_no_index",
                response_time=total_time,
                response_length=0,
                exception=e,
                context={}
            )

    @task(2)
    def geospatial_query_no_index(self):
        """Geospatial query without 2dsphere index - VERY SLOW"""
        start_time = time.time()
        coords = random.choice(self.coordinates)
        
        try:
            # This will fail or be extremely slow without 2dsphere index
            cursor = self.properties.find({
                "address.location": {
                    "$near": {
                        "$geometry": {"type": "Point", "coordinates": coords},
                        "$maxDistance": 5000  # 5km radius
                    }
                }
            }).limit(10)
            
            results = list(cursor)
            
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="geospatial_no_index",
                response_time=total_time,
                response_length=len(results),
                exception=None,
                context={"coordinates": coords}
            )
            
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="geospatial_no_index",
                response_time=total_time,
                response_length=0,
                exception=e,
                context={}
            )

    @task(2)
    def price_range_query_no_index(self):
        """Price range query without index - SLOW"""
        start_time = time.time()
        min_price = random.randint(50, 150)
        max_price = min_price + random.randint(100, 300)
        
        try:
            # Price queries without index on price field
            cursor = self.properties.find({
                "price.$numberDecimal": {
                    "$gte": str(min_price),
                    "$lte": str(max_price)
                }
            }).limit(20)
            
            results = list(cursor)
            
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="price_range_no_index",
                response_time=total_time,
                response_length=len(results),
                exception=None,
                context={"price_range": f"${min_price}-${max_price}"}
            )
            
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="price_range_no_index",
                response_time=total_time,
                response_length=0,
                exception=e,
                context={}
            )

    @task(1)
    def text_search_no_index(self):
        """Text search without text index - VERY SLOW"""
        start_time = time.time()
        search_terms = ["beach", "downtown", "modern", "cozy", "luxury", "spacious"]
        term = random.choice(search_terms)
        
        try:
            # Text search using regex instead of text index - very slow
            cursor = self.properties.find({
                "$or": [
                    {"name": {"$regex": term, "$options": "i"}},
                    {"description": {"$regex": term, "$options": "i"}},
                    {"summary": {"$regex": term, "$options": "i"}}
                ]
            }).limit(20)
            
            results = list(cursor)
            
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="text_search_no_index",
                response_time=total_time,
                response_length=len(results),
                exception=None,
                context={"search_term": term}
            )
            
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="text_search_no_index",
                response_time=total_time,
                response_length=0,
                exception=e,
                context={}
            )

    @task(1)
    def complex_aggregation_no_index(self):
        """Complex aggregation without supporting indexes - SLOW"""
        start_time = time.time()
        
        try:
            # Complex aggregation that would benefit from indexes
            pipeline = [
                {"$match": {"number_of_reviews": {"$gte": 5}}},
                {"$group": {
                    "_id": {
                        "market": "$address.market",
                        "property_type": "$property_type"
                    },
                    "avg_price": {"$avg": {"$toDouble": "$price.$numberDecimal"}},
                    "count": {"$sum": 1},
                    "avg_rating": {"$avg": "$review_scores.review_scores_rating"}
                }},
                {"$match": {"count": {"$gte": 10}}},
                {"$sort": {"avg_price": -1}},
                {"$limit": 20}
            ]
            
            results = list(self.properties.aggregate(pipeline))
            
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="aggregation_no_index",
                response_time=total_time,
                response_length=len(results),
                exception=None,
                context={}
            )
            
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request.fire(
                request_type="MongoDB",
                name="aggregation_no_index",
                response_time=total_time,
                response_length=0,
                exception=e,
                context={}
            )

    def on_stop(self):
        """Clean up MongoDB connection"""
        if hasattr(self, 'client'):
            self.client.close()


@events.init.add_listener
def on_locust_init(environment, **kwargs):
    """Initialize performance test"""
    print("🚀 Starting MongoDB Baseline Performance Test")
    print("⚠️  This test runs WITHOUT indexes to establish baseline metrics")
    print("📊 Expect slow response times - this is intentional!")
    print("=" * 60)


@events.test_start.add_listener  
def on_test_start(environment, **kwargs):
    """Log test start"""
    print(f"🏁 Test started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"👥 Users: {environment.runner.user_count}")
    print(f"⚡ Spawn rate: {getattr(environment.runner, 'spawn_rate', 'N/A')}")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Log test completion and results summary"""
    print("=" * 60)
    print(f"✅ Baseline test completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Print summary statistics
    stats = environment.stats
    print("\n📊 BASELINE PERFORMANCE SUMMARY:")
    print("-" * 40)
    
    for stat in stats.entries.values():
        if stat.method == "MongoDB":
            print(f"🔍 {stat.name}:")
            print(f"   Requests: {stat.num_requests}")
            print(f"   Avg Response: {stat.avg_response_time:.2f}ms")
            print(f"   Max Response: {stat.max_response_time:.2f}ms")
            print(f"   Failures: {stat.num_failures}")
            print()
    
    print("⚠️  These are BASELINE metrics without indexes")
    print("🚀 Next: Run optimized_tests.py to see the improvement!")
