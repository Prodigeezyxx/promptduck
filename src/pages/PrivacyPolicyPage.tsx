
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DuckIcon } from '@/components/icons/DuckIcon';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <DuckIcon size={32} />
            <h1 className="text-xl font-bold gradient-text">PromptDuck</h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <div className="space-y-3">
                <p><strong>Purpose:</strong> This Privacy Policy explains how PromptDuck ("we," "us") collects, uses, stores, and protects information about you when you use our services.</p>
                <p><strong>Data collected:</strong> Personal information (e.g., name, email), usage data (e.g., IP addresses, session logs), cookies, and analytics.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">2. Data Collection Details</h2>
              <div className="space-y-3">
                <p><strong>Methods:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>User input (account creation, support forms)</li>
                  <li>Cookies and tracking tools (analytics, performance)</li>
                  <li>Automatic collection (device type, browser info, location)</li>
                </ul>
                <p><strong>Purpose:</strong> Improve user experience, analytics, support, feature customization, marketing.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
              <div className="space-y-3">
                <p><strong>Internal use:</strong> Account setup, service delivery, personalization, troubleshooting</p>
                <p><strong>Analytics & improvement:</strong> Product enhancements, feature testing</p>
                <p><strong>Third-party sharing:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With service providers (e.g., cloud hosting, analytics) under confidentiality</li>
                  <li>When legally required (compliance, legal requests)</li>
                  <li>With your explicit consent (e.g., marketing third parties)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <div className="space-y-3">
                <p><strong>Encryption:</strong> Data encrypted at rest and in transit (TLS/SSL)</p>
                <p><strong>Access controls:</strong> Role-based access; regular audits</p>
                <p><strong>Infrastructure security:</strong> Regular testing, vulnerability scans, patching</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
              <div className="space-y-3">
                <p>You may:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access and export your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion or restrict processing</li>
                  <li>Object to marketing, withdraw consent</li>
                  <li>Lodge complaints with authorities (e.g., ICO, CNIL, etc.)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <div className="space-y-3">
                <p>Questions or privacy requests? Contact us via <a href="mailto:dev@promptduck.dev" className="text-brand-500 hover:underline">dev@promptduck.dev</a> or write to:</p>
                <address className="not-italic">
                  PromptDuck<br />
                  5a Endymion Road<br />
                  London
                </address>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-brand-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
