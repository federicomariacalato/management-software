import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCategorySalesData } from "@/services/categorySalesServices";
import { QueryErrorState } from "./QueryErrorState";
import {
  ResponsiveContainer,
  Pie,
  PieChart,
  Tooltip,
  Legend,
  Label,
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function CategorySalesChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["category sales"],
    queryFn: () => getCategorySalesData(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
  return (
    <>
      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-muted-foreground">
            Sales by Category
          </span>
        </CardHeader>
        <CardContent className="h-75">
          {error ? (
            <QueryErrorState error={error} refetch={refetch} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithColors}
                  dataKey="quantity"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={100}
                >
                  <Label
                    content={({ viewBox }: any) => {
                      const { cx, cy } = viewBox;
                      return (
                        <text x={cx} y={cy} textAnchor="middle">
                          <tspan
                            x={cx}
                            dy="-0.5em"
                            className="text-xs fill-muted-foreground"
                          >
                            Total Sales
                          </tspan>
                          <tspan
                            x={cx}
                            dy="1.5em"
                            className="text-xl font-bold fill-foreground"
                          >
                            {totalQuantity}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}
