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
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function SalesChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => getSalesData(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="w-full text-center min-h-[300px] flex flex-col items-center justify-center"
      >
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <Button
          onClick={() => refetch()}
          variant="secondary"
          size="sm"
          className="mt-3 mx-auto min-w-96"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-muted-foreground">
            Sales Performance
          </span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
        </CardContent>
      </Card>
    </>
  );
}
