"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TipPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to universal tipping after a short delay
    const timer = setTimeout(() => {
      router.push("/tip/universal");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] text-white text-2xl mb-4">
              🔍
            </div>
            <h1 className="text-2xl font-semibold">
              Looking for a Creator to Tip?
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              You&apos;ll need a creator&apos;s link, ENS name, or wallet
              address to send them a tip.
            </p>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  ✨ <strong>Examples:</strong>
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>• tipup.app/tip/creator.eth</li>
                  <li>• creator.eth</li>
                  <li>• 0x742d35Cc6634C0532925a3b8D404fddE9C...</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  className="bg-[var(--push-purple-500)] hover:bg-[var(--push-purple-600)]"
                >
                  <Link href="/tip/universal">🌍 Universal Tipping</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">🎨 Register as Creator</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">🏠 Go Home</Link>
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Redirecting to Universal Tipping in 3 seconds...
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
