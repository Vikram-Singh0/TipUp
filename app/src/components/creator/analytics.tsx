"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ethers } from "ethers";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Zap,
} from "lucide-react";
import type { Tip } from "@/config/contract";

interface CreatorAnalyticsProps {
  tips: Tip[];
}

interface AnalyticsData {
  totalTips: number;
  totalAmount: string;
  avgAmount: string;
  tipsToday: number;
  tipsThisWeek: number;
  tipsThisMonth: number;
  amountToday: string;
  amountThisWeek: string;
  amountThisMonth: string;
  topTippers: Array<{ address: string; amount: string; count: number }>;
  tipsByDay: Array<{ date: string; tips: number; amount: string }>;
  recentActivity: Tip[];
}

export default function CreatorAnalytics({ tips }: CreatorAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const calculateAnalytics = useCallback(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const tipsToday = tips.filter(
      (tip) => new Date(Number(tip.timestamp) * 1000) >= todayStart
    );
    const tipsThisWeek = tips.filter(
      (tip) => new Date(Number(tip.timestamp) * 1000) >= weekStart
    );
    const tipsThisMonth = tips.filter(
      (tip) => new Date(Number(tip.timestamp) * 1000) >= monthStart
    );

    const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, BigInt(0));
    const avgAmount =
      tips.length > 0 ? totalAmount / BigInt(tips.length) : BigInt(0);

    const amountToday = tipsToday.reduce(
      (sum, tip) => sum + tip.amount,
      BigInt(0)
    );
    const amountThisWeek = tipsThisWeek.reduce(
      (sum, tip) => sum + tip.amount,
      BigInt(0)
    );
    const amountThisMonth = tipsThisMonth.reduce(
      (sum, tip) => sum + tip.amount,
      BigInt(0)
    );

    const tipperMap = new Map<string, { amount: bigint; count: number }>();
    tips.forEach((tip) => {
      const existing = tipperMap.get(tip.from) || {
        amount: BigInt(0),
        count: 0,
      };
      tipperMap.set(tip.from, {
        amount: existing.amount + tip.amount,
        count: existing.count + 1,
      });
    });

    const topTippers = Array.from(tipperMap.entries())
      .sort((a, b) => Number(b[1].amount - a[1].amount))
      .slice(0, 5)
      .map(([address, data]) => ({
        address,
        amount: ethers.formatEther(data.amount),
        count: data.count,
      }));

    const dayMap = new Map<string, { tips: number; amount: bigint }>();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    tips
      .filter((tip) => new Date(Number(tip.timestamp) * 1000) >= last30Days)
      .forEach((tip) => {
        const date = new Date(Number(tip.timestamp) * 1000)
          .toISOString()
          .split("T")[0];
        const existing = dayMap.get(date) || { tips: 0, amount: BigInt(0) };
        dayMap.set(date, {
          tips: existing.tips + 1,
          amount: existing.amount + tip.amount,
        });
      });

    const tipsByDay = Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        tips: data.tips,
        amount: ethers.formatEther(data.amount),
      }));

    const recentActivity = [...tips]
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, 10);

    setAnalytics({
      totalTips: tips.length,
      totalAmount: ethers.formatEther(totalAmount),
      avgAmount: ethers.formatEther(avgAmount),
      tipsToday: tipsToday.length,
      tipsThisWeek: tipsThisWeek.length,
      tipsThisMonth: tipsThisMonth.length,
      amountToday: ethers.formatEther(amountToday),
      amountThisWeek: ethers.formatEther(amountThisWeek),
      amountThisMonth: ethers.formatEther(amountThisMonth),
      topTippers,
      tipsByDay,
      recentActivity,
    });
  }, [tips]);

  useEffect(() => {
    if (tips.length > 0) {
      calculateAnalytics();
    }
  }, [tips, calculateAnalytics]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleTimeString();
  };

  if (!analytics) {
    return (
      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data available yet</p>
              <p className="text-sm">Start receiving tips to see analytics!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-green-500">
                  {Number(analytics.totalAmount).toFixed(4)} PC
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tips</p>
                <p className="text-2xl font-bold text-blue-500">
                  {analytics.totalTips}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Tip</p>
                <p className="text-2xl font-bold text-pink-500">
                  {Number(analytics.avgAmount).toFixed(4)} PC
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-purple-500">
                  {analytics.tipsThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Period Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tipsToday}</div>
            <div className="text-sm text-muted-foreground">
              {Number(analytics.amountToday).toFixed(4)} PC
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tipsThisWeek}</div>
            <div className="text-sm text-muted-foreground">
              {Number(analytics.amountThisWeek).toFixed(4)} PC
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tipsThisMonth}</div>
            <div className="text-sm text-muted-foreground">
              {Number(analytics.amountThisMonth).toFixed(4)} PC
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tippers */}
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Top Supporters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topTippers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No supporters yet
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.topTippers.map((tipper, index) => (
                <div
                  key={tipper.address}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatAddress(tipper.address)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tipper.count} tips
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {Number(tipper.amount).toFixed(4)} PC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            <div className="space-y-4">
              {analytics.recentActivity.map((tip, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">
                        {ethers.formatEther(tip.amount)} PC
                      </div>
                      <div className="text-sm text-muted-foreground">
                        from {formatAddress(tip.from)}
                      </div>
                    </div>
                    {tip.message && (
                      <p className="text-sm text-muted-foreground italic mt-1">
                        &ldquo;
                        {tip.message.length > 50
                          ? tip.message.slice(0, 50) + "..."
                          : tip.message}
                        &rdquo;
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDate(tip.timestamp)}</p>
                    <p>{formatTime(tip.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
