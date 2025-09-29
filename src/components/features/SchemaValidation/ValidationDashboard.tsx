/**
 * Schema Validation Dashboard Component
 * 
 * Demonstrates MongoDB Schema Validation features:
 * - Real-time validation feedback
 * - Data quality metrics
 * - Validation error handling
 * - Schema compliance checking
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Database, FileCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MONGODB_FEATURES } from '@/lib/features';

interface ValidationStats {
  propertiesValidated: number;
  bookingsValidated: number;
  validationErrors: number;
  complianceRate: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  documentType: string;
}

export function ValidationDashboard() {
  const [stats, setStats] = useState<ValidationStats>({
    propertiesValidated: 0,
    bookingsValidated: 0,
    validationErrors: 0,
    complianceRate: 0
  });
  const [recentValidations, setRecentValidations] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Don't render if feature is disabled
  if (!MONGODB_FEATURES.SCHEMA_VALIDATION) {
    return null;
  }

  useEffect(() => {
    fetchValidationStats();
    fetchRecentValidations();
  }, []);

  const fetchValidationStats = async () => {
    try {
      const response = await fetch('/api/validation/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch validation stats:', error);
      // Mock data for demonstration
      setStats({
        propertiesValidated: 1247,
        bookingsValidated: 892,
        validationErrors: 23,
        complianceRate: 97.8
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentValidations = async () => {
    try {
      const response = await fetch('/api/validation/recent');
      if (response.ok) {
        const data = await response.json();
        setRecentValidations(data);
      }
    } catch (error) {
      console.error('Failed to fetch recent validations:', error);
      // Mock data for demonstration
      setRecentValidations([
        {
          isValid: true,
          errors: [],
          documentType: 'Property'
        },
        {
          isValid: false,
          errors: ['Price must be a positive number', 'Host name is required'],
          documentType: 'Property'
        },
        {
          isValid: true,
          errors: [],
          documentType: 'Booking'
        }
      ]);
    }
  };

  const runValidationCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/validation/check', {
        method: 'POST'
      });
      if (response.ok) {
        await fetchValidationStats();
        await fetchRecentValidations();
      }
    } catch (error) {
      console.error('Failed to run validation check:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Schema Validation</h2>
            <p className="text-muted-foreground">MongoDB JSON Schema validation for data quality</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          MongoDB Feature
        </Badge>
      </div>

      {/* Feature Alert */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Schema Validation Active</AlertTitle>
        <AlertDescription>
          All property and booking data is validated against JSON schemas before insertion.
          This ensures data quality, compliance, and consistency across your application.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Validated</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertiesValidated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All property listings validated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings Validated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookingsValidated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All booking records validated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.validationErrors}</div>
            <p className="text-xs text-muted-foreground">
              Rejected invalid documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
            <Progress value={stats.complianceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Data quality score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Details */}
      <Tabs defaultValue="schemas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schemas">Validation Schemas</TabsTrigger>
          <TabsTrigger value="recent">Recent Validations</TabsTrigger>
          <TabsTrigger value="rules">Validation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="schemas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Schema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Property Schema</span>
                </CardTitle>
                <CardDescription>
                  JSON Schema validation for property listings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Required Fields:</h4>
                  <div className="flex flex-wrap gap-1">
                    {['name', 'property_type', 'room_type', 'accommodates', 'price', 'host', 'address'].map((field) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Validation Rules:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Name: 5-100 characters</li>
                    <li>• Accommodates: 1-20 guests</li>
                    <li>• Price: Valid currency format</li>
                    <li>• Location: Valid coordinates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Booking Schema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Booking Schema</span>
                </CardTitle>
                <CardDescription>
                  JSON Schema validation for booking records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Required Fields:</h4>
                  <div className="flex flex-wrap gap-1">
                    {['propertyId', 'userId', 'checkIn', 'checkOut', 'guests', 'totalPrice', 'status'].map((field) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Validation Rules:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Guests: 1-20 people</li>
                    <li>• Price: Positive number</li>
                    <li>• Dates: Check-out after check-in</li>
                    <li>• Status: Valid booking state</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Validation Results</CardTitle>
              <CardDescription>
                Latest document validation attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentValidations.map((validation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {validation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{validation.documentType}</span>
                        <Badge variant={validation.isValid ? "default" : "destructive"}>
                          {validation.isValid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>
                      {validation.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-600">Validation Errors:</p>
                          <ul className="text-sm text-red-600 mt-1 space-y-1">
                            {validation.errors.map((error, errorIndex) => (
                              <li key={errorIndex}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Configuration</CardTitle>
              <CardDescription>
                MongoDB schema validation settings and rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Validation Level</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Properties</span>
                      <Badge variant="outline">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bookings</span>
                      <Badge variant="outline">Strict</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Validation Action</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Invalid Documents</span>
                      <Badge variant="destructive">Error</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response</span>
                      <Badge variant="outline">Reject</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={runValidationCheck} disabled={loading} className="w-full">
                  {loading ? "Running Validation..." : "Run Validation Check"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
