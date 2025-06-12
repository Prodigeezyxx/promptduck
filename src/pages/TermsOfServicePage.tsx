
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DuckIcon } from '@/components/icons/DuckIcon';

export default function TermsOfServicePage() {
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
            <FileText className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>These Terms ("Agreement") outline your use of PromptDuck services ("Platform"). By registering or accessing, you agree to these Terms governing our relationship and your use.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
              <div className="space-y-3">
                <p><strong>Allowed Uses:</strong> Personal prompts, AI chats, account use.</p>
                <p><strong>Prohibited Uses:</strong> Illegal content, harassment, spam, abuse, reverse-engineering tools, data scraping, unauthorized access, violating laws or third-party rights.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
              <div className="space-y-3">
                <p><strong>Platform IP:</strong> PromptDuck owns all software, trademarks, content.</p>
                <p><strong>Your Content:</strong> You retain ownership, granting PromptDuck a license to operate the service (display, store, distribute as needed).</p>
                <p><strong>Feedback:</strong> Any submissions (ideas, suggestions) are non-confidential and become PromptDuck's IP.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
              <div className="space-y-3">
                <p>To the extent allowed by law, PromptDuck is not liable for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Indirect, incidental, consequential damages</li>
                  <li>Data loss, downtime, service interruptions</li>
                </ul>
                <p>We cap liability at the amount you spent with us in the last 12 months.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">5. Termination Clause</h2>
              <div className="space-y-3">
                <p>We may suspend or terminate your account if you:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate Terms or misuse the Platform</li>
                  <li>Act fraudulently or illegally</li>
                  <li>Are inactive for 12 consecutive months</li>
                </ul>
                <p>You may delete your account anytime; data retention policies apply.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
              <p>These Terms are governed by the laws of Lagos State, Nigeria. Disputes will be resolved in its courts and, where required, via arbitration in Lagos.</p>
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
