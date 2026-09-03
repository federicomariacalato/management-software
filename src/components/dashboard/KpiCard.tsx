import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { KpiData } from "@/types/kpi.types";

type KpiCardProps = {
  data: KpiData;
};

export function KpiCard({ data }: KpiCardProps) {
  const { label, value, change, trend } = data;
  const isPositive = change >= 0;
  const chartData = trend.map((point, index) => ({ index, value: point }));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Badge variant={isPositive ? "default" : "destructive"}>
            {isPositive ? "+" : ""}
            {change}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            {value}
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
