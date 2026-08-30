import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PieChart } from "lucide-react";
import { Person } from "@/types/expense";

interface StatsCardsProps {
  totalSpent: number;
  personTotals: Record<string, number>;
  people: Person[];
  categoryTotals: Record<string, number>;
}

const CATEGORY_COLORS: Record<string, string> = {
  Accommodation: "#3b82f6",
  Food: "#10b981",
  Fuel: "#facc15",
  Miscellaneous: "#ef4444",
  Shopping: "#ec4899",
  Sightseeing: "#f97316",
  Smoke: "#ffffff",
};

export function StatsCards({ totalSpent, personTotals, people, categoryTotals }: StatsCardsProps) {
  const personData = people
    .filter((p) => (personTotals[p.id] || 0) > 0)
    .map((p, i) => ({
      name: p.name,
      value: personTotals[p.id] || 0,
      color: p.hexColor || "#6b7280",
    }));

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || "#6b7280",
    }))
    .sort((a, b) => b.value - a.value);

  const totalAngle = personData.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  const personSegments = personData.map((d) => {
    const startAngle = currentAngle;
    const angle = (d.value / totalAngle) * 360;
    currentAngle += angle;
    return { ...d, startAngle, angle };
  });

  const totalCatAngle = categoryData.reduce((sum, d) => sum + d.value, 0);
  let currentCatAngle = 0;
  const categorySegments = categoryData.map((d) => {
    const startAngle = currentCatAngle;
    const angle = (d.value / totalCatAngle) * 360;
    currentCatAngle += angle;
    return { ...d, startAngle, angle };
  });

  const createPiePath = (startAngle: number, angle: number, radius: number) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, startAngle + angle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    return `M ${radius} ${radius} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  };

  function polarToCartesian(radius: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: radius + radius * Math.cos(rad),
      y: radius + radius * Math.sin(rad),
    };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="bg-emerald-500/20 text-white shadow-xl border-0 backdrop-blur-xl border border-emerald-400/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold mt-1">₹{totalSpent.toLocaleString("en-IN")}</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <Wallet className="h-6 w-6 text-emerald-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl shadow-lg border border-white/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="h-5 w-5 text-indigo-300" />
            <h3 className="font-semibold text-white">Individual Spending</h3>
          </div>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 200 200" className="w-32 h-32">
              {personSegments.map((segment, i) => (
                <path
                  key={i}
                  d={createPiePath(segment.startAngle, segment.angle, 100)}
                  fill={segment.color}
                  fillOpacity="0.9"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              {personSegments.length === 0 && (
                <circle cx="100" cy="100" r="100" fill="rgba(255,255,255,0.1)" />
              )}
            </svg>
            <div className="space-y-2">
              {personSegments.map((segment, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color, opacity: 0.9 }} />
                  <span className="text-sm text-white/80">{segment.name}</span>
                  <span className="text-sm font-semibold text-white">
                    ₹{segment.value.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl shadow-lg border border-white/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="h-5 w-5 text-emerald-300" />
            <h3 className="font-semibold text-white">Category Breakdown</h3>
          </div>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 200 200" className="w-32 h-32">
              {categorySegments.map((segment, i) => (
                <path
                  key={i}
                  d={createPiePath(segment.startAngle, segment.angle, 100)}
                  fill={segment.color}
                  fillOpacity="0.9"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              {categorySegments.length === 0 && (
                <circle cx="100" cy="100" r="100" fill="rgba(255,255,255,0.1)" />
              )}
            </svg>
            <div className="space-y-1">
              {categorySegments.slice(0, 5).map((segment, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color, opacity: 0.9 }} />
                  <span className="text-sm text-white/80">{segment.name}</span>
                  <span className="text-sm font-semibold text-white">
                    ₹{segment.value.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}