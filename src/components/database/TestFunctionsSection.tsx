import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import * as Sentry from "@sentry/react";

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'running';
  message?: string;
  timestamp?: string;
}

export function TestFunctionsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const testFunctions = [
    {
      name: "merge_duplicate_collectors",
      description: "Merges collectors with similar names",
      test: async () => {
        const { data, error } = await supabase.rpc('merge_duplicate_collectors');
        if (error) throw error;
        return `Merged ${data[0].merged_count} collectors. Details: ${data[0].details}`;
      }
    },
    {
      name: "sync_collector_ids",
      description: "Syncs collector IDs with collector names",
      test: async () => {
        const { data, error } = await supabase.rpc('sync_collector_ids');
        if (error) throw error;
        return "Collector IDs synchronized successfully";
      }
    },
    {
      name: "normalize_collector_name",
      description: "Tests name normalization with a sample collector",
      test: async () => {
        const testName = "John & Mary / Smith";
        const { data, error } = await supabase.rpc('normalize_collector_name', {
          name: testName
        });
        if (error) throw error;
        return `Normalized "${testName}" to "${data}"`;
      }
    },
    {
      name: "error_test",
      description: "Tests error reporting to Sentry",
      test: async () => {
        console.log('Starting Sentry test...');
        
        // Create a test error with custom context
        const testError = new Error("Test Sentry Integration");
        
        // Add custom context and send to Sentry
        Sentry.withScope((scope) => {
          scope.setTag("test_type", "manual_error_test");
          scope.setLevel("error");
          scope.setContext("test_details", {
            purpose: "Verify Sentry integration",
            timestamp: new Date().toISOString(),
            environment: import.meta.env.MODE
          });
          
          console.log('Sending test error to Sentry...');
          Sentry.captureException(testError);
        });
        
        // Wait a bit to ensure the error is sent
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Sentry test completed');
        return "Error successfully sent to Sentry. Check your Sentry dashboard.";
      }
    }
  ];

  const runTest = async (name: string, testFn: () => Promise<string>) => {
    setIsLoading(name);
    setTestResults(prev => [...prev, { 
      name, 
      status: 'running',
      timestamp: new Date().toLocaleString()
    }]);

    try {
      const result = await testFn();
      setTestResults(prev => prev.map(r => 
        r.name === name ? { 
          name, 
          status: 'success', 
          message: result,
          timestamp: new Date().toLocaleString()
        } : r
      ));
      
      toast({
        title: "Test Successful",
        description: result,
      });
    } catch (error) {
      console.error(`Test failed for ${name}:`, error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      setTestResults(prev => prev.map(r => 
        r.name === name ? { 
          name, 
          status: 'error', 
          message: errorMessage,
          timestamp: new Date().toLocaleString()
        } : r
      ));

      toast({
        title: "Test Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Database Functions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test various database functions to ensure they are working correctly.
        </p>
        <div className="space-y-4">
          {testFunctions.map((fn) => (
            <div key={fn.name} className="flex flex-col space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{fn.name}</h3>
                  <p className="text-sm text-muted-foreground">{fn.description}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => runTest(fn.name, fn.test)}
                  disabled={!!isLoading}
                >
                  {isLoading === fn.name ? "Testing..." : "Run Test"}
                </Button>
              </div>
              {testResults
                .filter(result => result.name === fn.name)
                .map((result, index) => (
                  <Alert key={index} variant={result.status === 'error' ? 'destructive' : 'default'}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <AlertTitle>
                        {result.status === 'running' ? 'Running test...' : 
                         result.status === 'success' ? 'Test passed' : 'Test failed'}
                      </AlertTitle>
                    </div>
                    {result.message && (
                      <AlertDescription className="mt-2">
                        {result.message}
                      </AlertDescription>
                    )}
                    {result.timestamp && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.timestamp}
                      </p>
                    )}
                  </Alert>
                ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
