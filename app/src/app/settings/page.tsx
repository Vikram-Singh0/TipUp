"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Palette, Shield, Zap } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] text-white">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">
              Configure your TipUp experience
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {/* Notifications Settings */}
        <Card className="bg-card/50 backdrop-blur border-[var(--push-pink-500)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--push-pink-500)]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications when you receive tips
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-[var(--push-pink-500)] text-[var(--push-pink-500)] hover:bg-[var(--push-pink-500)] hover:text-white"
              >
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summaries via email
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-card/50 backdrop-blur border-[var(--push-purple-500)]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--push-purple-500)]" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Customize your visual experience
                </p>
              </div>
              <Badge variant="outline">Dark Mode</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card/50 backdrop-blur border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="font-medium">Connected Wallets</p>
                <p className="text-sm text-muted-foreground">
                  Manage your connected wallet addresses
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download your tip history as CSV
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="bg-card/50 backdrop-blur border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Advanced
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-card/30 border border-border/50">
              <p className="text-sm text-muted-foreground">
                More advanced settings and features coming soon! Stay tuned for
                updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Network Info */}
        <Card className="bg-gradient-to-br from-[var(--push-pink-500)]/10 to-[var(--push-purple-500)]/10 backdrop-blur border-[var(--push-pink-500)]/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium">
                Network: Push Chain Testnet
              </div>
              <div className="text-xs text-muted-foreground">
                Chain ID: 42101 • Fast & Low-cost transactions
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
