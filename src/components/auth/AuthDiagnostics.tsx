
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticsResults {
  currentUrl: string;
  origin: string;
  protocol: string;
  host: string;
  supabaseUrl: string;
  redirectUrl: string;
  timestamp: string;
  userAgent: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  supabaseConnection?: string;
  sessionStatus?: string;
  connectionError?: string;
}

export function AuthDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results: DiagnosticsResults = {
        currentUrl: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        host: window.location.host,
        supabaseUrl: 'https://gxlqzpsycfusyjrkcxgz.supabase.co',
        redirectUrl: `${window.location.origin}/`,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        localStorage: typeof Storage !== 'undefined',
      };

      // Check if we can reach Supabase
      try {
        const { data, error } = await supabase.auth.getSession();
        results.supabaseConnection = error ? 'Error' : 'Success';
        results.sessionStatus = data.session ? 'Active' : 'None';
      } catch (error: any) {
        results.supabaseConnection = 'Failed';
        results.connectionError = error.message;
      }

      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Authentication Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>
        
        {diagnostics && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {diagnostics.protocol === 'https:' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                }
                <span>Protocol: {diagnostics.protocol}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {diagnostics.supabaseConnection === 'Success' ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                }
                <span>Supabase: {diagnostics.supabaseConnection}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {diagnostics.cookiesEnabled ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                }
                <span>Cookies: {diagnostics.cookiesEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {diagnostics.localStorage ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                }
                <span>Storage: {diagnostics.localStorage ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
            
            <div className="text-xs space-y-1 bg-muted p-3 rounded">
              <div><strong>Current URL:</strong> {diagnostics.currentUrl}</div>
              <div><strong>Redirect URL:</strong> {diagnostics.redirectUrl}</div>
              <div><strong>Host:</strong> {diagnostics.host}</div>
              {diagnostics.connectionError && (
                <div className="text-red-600"><strong>Connection Error:</strong> {diagnostics.connectionError}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
