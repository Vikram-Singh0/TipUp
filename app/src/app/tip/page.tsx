"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Coin3D = dynamic(() => import("@/components/pushflow/coin-3d"), { ssr: false })

export default function TipPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-semibold">Tip @creator.eth</h1>
        <p className="text-muted-foreground">Support your favorite creator in seconds.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,var(--push-pink-500)/20,transparent)] p-4">
          <Coin3D scale={0.9} />
        </div>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Send a Tip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                className="h-11 rounded-md bg-background/60 border border-border px-3"
                placeholder="Enter amount"
              />
              <select className="h-11 rounded-md bg-background/60 border border-border px-3">
                <option>ETH</option>
                <option>MATIC</option>
                <option>USDC</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <input id="with-msg" type="checkbox" className="accent-[var(--push-pink-500)]" />
              <label htmlFor="with-msg">Send message with tip</label>
            </div>
            <Button className="w-full bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]">Push Tip</Button>
            <p className="text-xs text-muted-foreground">You’ll receive an instant Push notification.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
