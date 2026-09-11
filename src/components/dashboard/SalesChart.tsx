import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSalesData } from "@/services/salesServices";
import { QueryErrorState } from "./QueryErrorState";

export function SalesChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => getSalesData(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-muted-foreground">
            Sales Performance
          </span>
        </CardHeader>
        <CardContent className="h-[300px]">
          {error ? (
            <QueryErrorState error={error} refetch={refetch} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}
