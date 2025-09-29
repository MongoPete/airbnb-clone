"""
MongoDB Performance Testing Suite

Orchestrates complete performance testing workflow:
1. Baseline testing (no indexes)
2. Index creation
3. Optimized testing (with indexes)  
4. Performance comparison and reporting

Usage:
    python run_performance_suite.py
"""

import subprocess
import os
import json
import csv
import time
from datetime import datetime
from pathlib import Path
import sys

# Add the scripts directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from setup_indexes import MongoDBIndexManager

class PerformanceTestSuite:
    def __init__(self):
        """Initialize performance test suite"""
        self.results_dir = Path("src/performance/results")
        self.results_dir.mkdir(exist_ok=True, parents=True)
        
        self.locust_dir = Path("src/performance/locust")
        self.baseline_script = self.locust_dir / "baseline_tests.py"
        self.optimized_script = self.locust_dir / "optimized_tests.py"
        
        self.mongodb_uri = os.getenv('MONGODB_URI', 'mongodb+srv://demoPete:demoPete@back-to-basics-crud.fvu2crg.mongodb.net/sample_airbnb')
        
        # Test configuration
        self.test_config = {
            "users": 50,
            "spawn_rate": 5,
            "run_time": "60s"
        }
        
        self.results = {}
        
    def check_dependencies(self):
        """Check if required dependencies are installed"""
        print("🔍 Checking dependencies...")
        
        try:
            import locust
            print("✅ Locust installed")
        except ImportError:
            print("❌ Locust not found. Install with: pip install locust")
            return False
            
        try:
            import pymongo
            print("✅ PyMongo installed")
        except ImportError:
            print("❌ PyMongo not found. Install with: pip install pymongo")
            return False
            
        return True
    
    def run_baseline_test(self):
        """Run performance test without indexes"""
        print("\n🔄 Running Baseline Performance Test (No Indexes)")
        print("=" * 60)
        
        # Remove indexes first
        print("🧹 Removing performance indexes...")
        index_manager = MongoDBIndexManager()
        index_manager.remove_performance_indexes()
        index_manager.close()
        
        # Wait for index removal to complete
        time.sleep(5)
        
        # Run baseline test
        baseline_csv = self.results_dir / "baseline"
        
        cmd = [
            "locust",
            "-f", str(self.baseline_script),
            "--host", self.mongodb_uri,
            "--users", str(self.test_config["users"]),
            "--spawn-rate", str(self.test_config["spawn_rate"]),
            "--run-time", self.test_config["run_time"],
            "--headless",
            "--csv", str(baseline_csv),
            "--html", str(self.results_dir / "baseline_report.html")
        ]
        
        print(f"🚀 Running: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                print("✅ Baseline test completed successfully")
                self.results['baseline'] = self.parse_csv_results(f"{baseline_csv}_stats.csv")
                return True
            else:
                print(f"❌ Baseline test failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print("❌ Baseline test timed out")
            return False
        except Exception as e:
            print(f"❌ Error running baseline test: {e}")
            return False
    
    def run_optimized_test(self):
        """Run performance test with indexes"""
        print("\n🚀 Running Optimized Performance Test (With Indexes)")
        print("=" * 60)
        
        # Create indexes first
        print("🏗️  Creating performance indexes...")
        index_manager = MongoDBIndexManager()
        index_manager.setup_performance_indexes()
        index_manager.create_booking_indexes()
        index_manager.close()
        
        # Wait for index creation to complete
        time.sleep(10)
        
        # Run optimized test
        optimized_csv = self.results_dir / "optimized"
        
        cmd = [
            "locust",
            "-f", str(self.optimized_script),
            "--host", self.mongodb_uri,
            "--users", str(self.test_config["users"]),
            "--spawn-rate", str(self.test_config["spawn_rate"]),
            "--run-time", self.test_config["run_time"],
            "--headless",
            "--csv", str(optimized_csv),
            "--html", str(self.results_dir / "optimized_report.html")
        ]
        
        print(f"🚀 Running: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                print("✅ Optimized test completed successfully")
                self.results['optimized'] = self.parse_csv_results(f"{optimized_csv}_stats.csv")
                return True
            else:
                print(f"❌ Optimized test failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print("❌ Optimized test timed out")
            return False
        except Exception as e:
            print(f"❌ Error running optimized test: {e}")
            return False
    
    def parse_csv_results(self, csv_file):
        """Parse Locust CSV results"""
        results = {}
        
        try:
            with open(csv_file, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row['Type'] == 'MongoDB':
                        results[row['Name']] = {
                            'requests': int(row['Request Count']),
                            'failures': int(row['Failure Count']),
                            'avg_response_time': float(row['Average Response Time']),
                            'min_response_time': float(row['Min Response Time']),
                            'max_response_time': float(row['Max Response Time']),
                            'rps': float(row['Average Content Size'])  # Requests per second approximation
                        }
        except Exception as e:
            print(f"⚠️  Error parsing {csv_file}: {e}")
            
        return results
    
    def generate_comparison_report(self):
        """Generate detailed performance comparison report"""
        print("\n📊 Generating Performance Comparison Report")
        print("=" * 60)
        
        if not self.results.get('baseline') or not self.results.get('optimized'):
            print("❌ Missing test results for comparison")
            return
        
        baseline = self.results['baseline']
        optimized = self.results['optimized']
        
        # Console report
        print("\n🎯 MONGODB PERFORMANCE COMPARISON")
        print("=" * 50)
        
        improvements = {}
        
        for operation in baseline:
            if operation in optimized:
                baseline_time = baseline[operation]['avg_response_time']
                optimized_time = optimized[operation]['avg_response_time']
                
                if baseline_time > 0:
                    improvement_pct = ((baseline_time - optimized_time) / baseline_time) * 100
                    speed_multiplier = baseline_time / optimized_time if optimized_time > 0 else float('inf')
                else:
                    improvement_pct = 0
                    speed_multiplier = 1
                
                improvements[operation] = {
                    'baseline_ms': baseline_time,
                    'optimized_ms': optimized_time,
                    'improvement_pct': improvement_pct,
                    'speed_multiplier': speed_multiplier
                }
                
                print(f"\n🔍 {operation.replace('_', ' ').title()}:")
                print(f"   📊 Baseline:    {baseline_time:8.2f}ms")
                print(f"   🚀 Optimized:   {optimized_time:8.2f}ms")
                print(f"   📈 Improvement: {improvement_pct:8.1f}% faster")
                print(f"   ⚡ Speed:       {speed_multiplier:.1f}x faster")
                
                # Failure comparison
                baseline_failures = baseline[operation]['failures']
                optimized_failures = optimized[operation]['failures']
                print(f"   ❌ Failures:    {baseline_failures} → {optimized_failures}")
        
        # Overall summary
        if improvements:
            avg_improvement = sum(imp['improvement_pct'] for imp in improvements.values()) / len(improvements)
            avg_speedup = sum(imp['speed_multiplier'] for imp in improvements.values()) / len(improvements)
            
            print(f"\n🎯 OVERALL PERFORMANCE SUMMARY:")
            print(f"   📈 Average Improvement: {avg_improvement:.1f}% faster")
            print(f"   ⚡ Average Speedup:     {avg_speedup:.1f}x faster")
        
        # Save detailed JSON report
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'test_config': self.test_config,
            'mongodb_uri': self.mongodb_uri.split('@')[1] if '@' in self.mongodb_uri else 'localhost',
            'baseline_results': baseline,
            'optimized_results': optimized,
            'improvements': improvements,
            'summary': {
                'avg_improvement_pct': avg_improvement if improvements else 0,
                'avg_speedup_multiplier': avg_speedup if improvements else 1,
                'total_operations_tested': len(improvements)
            }
        }
        
        report_file = self.results_dir / "performance_comparison_report.json"
        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n💾 Detailed report saved: {report_file}")
        
        # Generate markdown summary for demos
        self.generate_demo_summary(report_data)
        
    def generate_demo_summary(self, report_data):
        """Generate a markdown summary perfect for client demos"""
        summary_file = self.results_dir / "DEMO_SUMMARY.md"
        
        with open(summary_file, 'w') as f:
            f.write("# 🚀 MongoDB Performance Optimization Results\n\n")
            f.write(f"**Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Test Duration**: {self.test_config['run_time']} per test\n")
            f.write(f"**Concurrent Users**: {self.test_config['users']}\n\n")
            
            f.write("## 📊 Performance Improvements\n\n")
            
            improvements = report_data['improvements']
            for operation, data in improvements.items():
                f.write(f"### {operation.replace('_', ' ').title()}\n")
                f.write(f"- **Before Indexing**: {data['baseline_ms']:.2f}ms\n")
                f.write(f"- **After Indexing**: {data['optimized_ms']:.2f}ms\n")
                f.write(f"- **Improvement**: {data['improvement_pct']:.1f}% faster\n")
                f.write(f"- **Speed Multiplier**: {data['speed_multiplier']:.1f}x\n\n")
            
            f.write("## 🎯 Summary\n\n")
            summary = report_data['summary']
            f.write(f"- **Average Performance Improvement**: {summary['avg_improvement_pct']:.1f}%\n")
            f.write(f"- **Average Speed Multiplier**: {summary['avg_speedup_multiplier']:.1f}x\n")
            f.write(f"- **Operations Tested**: {summary['total_operations_tested']}\n\n")
            
            f.write("## 🏗️ MongoDB Optimizations Applied\n\n")
            f.write("- **Compound Indexes** for multi-field queries\n")
            f.write("- **2dsphere Indexes** for geospatial queries\n")
            f.write("- **Text Indexes** for full-text search\n")
            f.write("- **Partial Indexes** for filtered datasets\n")
            f.write("- **Strategic Index Design** based on query patterns\n\n")
            
            f.write("---\n")
            f.write("*Generated by MongoDB Performance Testing Suite*\n")
        
        print(f"📄 Demo summary created: {summary_file}")
    
    def run_full_suite(self):
        """Run the complete performance testing suite"""
        print("🍃 MongoDB Performance Testing Suite")
        print("=" * 60)
        print(f"🎯 Testing Configuration:")
        print(f"   Users: {self.test_config['users']}")
        print(f"   Spawn Rate: {self.test_config['spawn_rate']}")
        print(f"   Duration: {self.test_config['run_time']}")
        print(f"   MongoDB: {self.mongodb_uri.split('@')[1] if '@' in self.mongodb_uri else 'localhost'}")
        
        start_time = datetime.now()
        
        # Check dependencies
        if not self.check_dependencies():
            return False
        
        # Run baseline test
        if not self.run_baseline_test():
            print("❌ Baseline test failed, aborting suite")
            return False
        
        # Run optimized test
        if not self.run_optimized_test():
            print("❌ Optimized test failed, aborting suite")
            return False
        
        # Generate comparison report
        self.generate_comparison_report()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print(f"\n🎉 Performance testing suite completed!")
        print(f"⏱️  Total time: {duration/60:.1f} minutes")
        print(f"📁 Results saved in: {self.results_dir}")
        
        return True


def main():
    """Main execution function"""
    suite = PerformanceTestSuite()
    
    try:
        success = suite.run_full_suite()
        if success:
            print("\n✅ All tests completed successfully!")
            print("🎯 Use the generated reports for client demonstrations")
        else:
            print("\n❌ Test suite failed")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️  Test suite cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
