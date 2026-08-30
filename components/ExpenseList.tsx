import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, MapPin, Clock, User, CreditCard, StickyNote, Camera, Maximize2, Users } from "lucide-react";
import { Expense, Person } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onSelect: (expense: Expense) => void;
  selectedExpense: Expense | null;
  people: Person[];
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Accommodation: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", text: "text-blue-300" },
  Food: { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", text: "text-emerald-300" },
  Fuel: { bg: "rgba(250, 204, 21, 0.1)", border: "rgba(250, 204, 21, 0.3)", text: "text-yellow-300" },
  Miscellaneous: { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "text-red-300" },
  Shopping: { bg: "rgba(236, 72, 153, 0.1)", border: "rgba(236, 72, 153, 0.3)", text: "text-pink-300" },
  Sightseeing: { bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.3)", text: "text-orange-300" },
  Smoke: { bg: "rgba(255, 255, 255, 0.1)", border: "rgba(255, 255, 255, 0.3)", text: "text-white" },
};

export function ExpenseList({ expenses, onDelete, onSelect, selectedExpense, people }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🧾</div>
        <h3 className="text-lg font-semibold text-white">No expenses yet</h3>
        <p className="text-sm text-white/70 mt-1">Add your first expense to start tracking</p>
      </div>
    );
  }

  const getPersonColor = (id: string) => {
    const person = people.find((p) => p.id === id);
    return person?.color || "bg-gray-500";
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {expenses.map((expense) => {
          const paidByPerson = people.find((p) => p.id === expense.paidBy);
          const paidByColor = paidByPerson?.hexColor || "#6b7280";
          const categoryColor = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Miscellaneous;
          
          return (
            <div
              key={expense.id}
              onClick={() => onSelect(expense)}
              className={`group rounded-xl border p-4 transition-all cursor-pointer hover:scale-[1.01] ${
                selectedExpense?.id === expense.id ? "ring-2 ring-white/50" : ""
              }`}
              style={{
                backgroundColor: categoryColor.bg,
                borderColor: categoryColor.border,
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {expense.photo ? (
                    <img
                      src={expense.photo}
                      alt={expense.location}
                      className="w-16 h-16 rounded-lg object-cover border border-white/30"
                    />
                  ) : (
                    <div className={`p-2 rounded-lg ${categoryColor.bg} border ${categoryColor.border}`}>
                      <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${categoryColor.text}`}>{expense.subcategory || expense.category}</h4>
                      <Badge variant="secondary" className={`text-xs ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {expense.dateTime.toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {expense.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {expense.location}
                        </span>
                      )}
                    </div>
                    {expense.address && (
                      <div className="flex items-start gap-1 mt-1 text-xs text-white/60">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span>{expense.address}</span>
                      </div>
                    )}
                    {expense.notes && (
                      <div className="flex items-start gap-1 mt-2 text-sm text-white bg-amber-500/20 rounded-lg p-2 border border-amber-400/30">
                        <StickyNote className="h-3 w-3 mt-0.5 text-amber-300" />
                        <span>{expense.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">₹{expense.amount.toLocaleString("en-IN")}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(expense.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-white/10 text-white border border-white/20">
                  <User className="h-3 w-3 mr-1" />
                  {getPersonName(expense.paidBy)} paid
                </Badge>
                <Badge className="bg-white/10 text-white border border-white/20">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {expense.paymentMode}
                </Badge>
                {expense.splitAmong && expense.splitAmong.length > 1 && (
                  <Badge className="bg-white/10 text-white border border-white/20">
                    <Users className="h-3 w-3 mr-1" />
                    {expense.splitAmong.length} split
                  </Badge>
                )}
                {expense.photo && (
                  <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    <Camera className="h-3 w-3 mr-1" />
                    Photo
                  </Badge>
                )}
                <Badge className="bg-white/10 text-white border border-white/20 ml-auto">
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Click to expand
                </Badge>
              </div>

              {expense.splitAmong && expense.splitAmong.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {expense.splitAmong.map((personId) => (
                    <span
                      key={personId}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getPersonColor(personId)}`}
                    >
                      {getPersonName(personId)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Accommodation: "🏨",
    Food: "🍽️",
    Fuel: "⛽",
    Miscellaneous: "📦",
    Shopping: "🛍️",
    Sightseeing: "🎫",
    Smoke: "🚬",
  };
  return icons[category] || "💰";
}

function getPersonName(id: string): string {
  const names: Record<string, string> = {
    sai: "Sai",
    santosh: "Santosh",
    siva: "Siva",
    srinu: "Srinu",
  };
  return names[id] || id;
}