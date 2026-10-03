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

import type { LabelProps } from "recharts";

function CenteredTotalLabel({
  viewBox,
  total,
}: LabelProps & { total: number }) {
  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
  const { cx, cy } = viewBox;
  if (cx === undefined || cy === undefined) return null;

  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan x={cx} dy="-0.5em" className="text-xs fill-muted-foreground">
        Total Sales
      </tspan>
      <tspan
        x={cx}
        dy="1.5em"
        className="text-xl font-bold fill-foreground"
      >
        {total}
      </tspan>
    </text>
  );
}

export function CategorySalesChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["category sales"],
    queryFn: () => getCategorySalesData(),
  });

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }

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
                  content={
                    <CenteredTotalLabel total={totalQuantity} />
                  }
                />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
