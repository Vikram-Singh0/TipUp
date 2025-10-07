"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CreatorDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-semibold">Creator Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, tips, and broadcasts.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input placeholder="e.g. Vikram" />
            </div>
            <div className="space-y-2">
              <Label>ENS Name</Label>
              <Input placeholder="@creator.eth" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Tell fans about your work" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Twitter" />
              <Input placeholder="GitHub" />
              <Input placeholder="Website" />
            </div>
            <Button className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]">Save</Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <motion.div
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 8, opacity: 0 }}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="text-sm text-muted-foreground">Total Tips</div>
              <div className="text-2xl font-semibold">$420.50</div>
            </motion.div>
            <motion.div
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 8, opacity: 0 }}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="text-sm text-muted-foreground">Followers Tipped</div>
              <div className="text-2xl font-semibold">128</div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
