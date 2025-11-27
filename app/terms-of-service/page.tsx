import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-16 pb-16">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Lucifer, you agree to comply with and be bound by these Terms of
                Service. If you do not agree to these terms, please do not use it.
              </p>

              <h2>2. Use of Service</h2>
              <p>
                You agree to use Lucifer only for lawful purposes and in accordance with these Terms of
                Service. You are prohibited from violating or attempting to violate the security of the Service.
              </p>

              <h2>3. Intellectual Property</h2>
              <p>
                All content included on this site, such as text, graphics, logos, button icons, images, audio clips,
                digital downloads, data compilations, and software, is the property of Lucifer or its content
                suppliers and protected by international copyright laws.
              </p>

              <h2>4. Limitation of Liability</h2>
              <p>
                Lucifer shall not be liable for any indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your access to or use of or inability to access or use the service.
              </p>

              <h2>5. Modifications to Terms of Service</h2>
              <p>
                Lucifer reserves the right to modify or replace these Terms of Service at any time. It is your
                responsibility to check these Terms periodically for changes.
              </p>

              <h2>6. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:support@lucifer.com" className="text-primary hover:underline">
                  support@lucifer.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 Lucifer. All rights reserved.</p>
            <Link href="/products">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-sky-300">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

