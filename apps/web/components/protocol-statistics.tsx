"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProtocolStatistics() {
  return (
    <div
      className={cn(
        "*:data-[slot=card]:bg-zinc-950",
        "grid grid-cols-1 gap-4",
        "@xl/main:grid-cols-2 @5xl/main:grid-cols-3"
      )}
    >
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Gross Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $0.00
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Purchases</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
