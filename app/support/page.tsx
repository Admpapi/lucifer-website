"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { MessageCircle, Mail, FileText, HelpCircle, Clock, Shield } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support <span className="text-primary">Center</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Get in touch with our support team or find answers to common questions.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Discord Support */}
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">Discord Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Join our Discord server for instant support and community help.
                    </p>
                    <a href="https://discord.gg/yxro" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-primary hover:bg-primary/90">
                        Join Discord
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>

              {/* Email Support */}
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Send us an email and we'll respond within 24 hours.
                    </p>
                    <a href="mailto:support@lucifer.com">
                      <Button variant="outline" className="border-primary/50">
                        Email Us
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 bg-card border-border text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is available around the clock to assist you.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Support</h3>
                <p className="text-sm text-muted-foreground">
                  All communications are encrypted and your data is protected.
                </p>
              </Card>

              <Card className="p-6 bg-card border-border text-center">
                <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expert Help</h3>
                <p className="text-sm text-muted-foreground">
                  Our experienced team knows our products inside and out.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>

              <div className="space-y-4">
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-2">How do I access my purchases?</h3>
                  <p className="text-muted-foreground">
                    After completing your purchase, you'll receive an email with download links and instructions. You can also access your purchases from your account dashboard.
                  </p>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and cryptocurrency payments through our secure payment processor.
                  </p>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-muted-foreground">
                    Due to the digital nature of our products, we generally don't offer refunds. However, if you experience technical issues, please contact support and we'll help resolve them.
                  </p>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-2">Is delivery instant?</h3>
                  <p className="text-muted-foreground">
                    Yes! All digital products are delivered instantly after payment confirmation. You'll receive an email with access details immediately.
                  </p>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-2">How can I report an issue?</h3>
                  <p className="text-muted-foreground">
                    Join our Discord server or send us an email with details about your issue. Include your order number and screenshots if applicable for faster resolution.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="p-8 bg-card border-border max-w-2xl mx-auto text-center">
              <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6">
                Check out our terms of service or browse our products for more information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/terms-of-service">
                  <Button variant="outline" className="border-primary/50">
                    Terms of Service
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    View Products
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
              © 2025 Lucifer. All rights reserved.
            </p>
            <Link href="/terms-of-service">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
