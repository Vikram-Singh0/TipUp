"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BroadcastPreview } from "@/components/pushflow/broadcast-preview"

export default function BroadcastPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-semibold">Broadcast Channel</h1>
        <p className="text-muted-foreground">Real-time updates and fan notifications via Push.</p>
      </header>

      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Live Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <BroadcastPreview />
        </CardContent>
      </Card>
    </main>
  )
}
