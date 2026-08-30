import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Users, TrendingUp, Plus, PieChart, X, Clock, User, CreditCard, MapPin, StickyNote, Split, Navigation } from "lucide-react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { StatsCards } from "@/components/StatsCards";
import { Expense, Person, PaymentMode } from "@/types/expense";

const PEOPLE: Person[] = [
  { id: "sai", name: "Sai", color: "bg-emerald-500", hexColor: "#10b981" },
  { id: "santosh", name: "Santosh", color: "bg-sky-500", hexColor: "#0ea5e9" },
  { id: "siva", name: "Siva", color: "bg-rose-500", hexColor: "#f43f5e" },
  { id: "srinu", name: "Srinu", color: "bg-amber-500", hexColor: "#f59e0b" },
];

const CATEGORIES = [
  { name: "Accommodation", icon: "🏨", subcategories: ["Late Checkout", "Misc", "Room Amount", "Room Service"] },
  { name: "Food", icon: "🍽️", subcategories: ["Alcohol", "Breakfast", "Cool Drinks", "Dinner", "Lunch", "Snacks", "Tea/Coffee", "Water"] },
  { name: "Fuel", icon: "⛽", subcategories: ["Car Repairs", "Fuel", "Tolls (Cash)", "Tolls (Fastag)"] },
  { name: "Miscellaneous", icon: "📦", subcategories: ["Miscellaneous"] },
  { name: "Shopping", icon: "🛍️", subcategories: ["Artifacts", "Clothes", "Households", "Spices", "Toys"] },
  { name: "Sightseeing", icon: "🎫", subcategories: ["Boat Rides", "Entry Tickets", "Mobile/Camera Stand", "Rides", "Temple Tickets"] },
  { name: "Smoke", icon: "🚬", subcategories: ["Cigarette", "Medicine", "Wet Wipes"] },
];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [splitAll, setSplitAll] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const personTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    PEOPLE.forEach((p) => (totals[p.id] = 0));
    expenses.forEach((e) => {
      if (e.splitAmong && e.splitAmong.length > 0) {
        e.splitAmong.forEach((personId) => {
          const share = e.amount / e.splitAmong.length;
          totals[personId] = (totals[personId] || 0) + share;
        });
      } else {
        totals[e.paidBy] = (totals[e.paidBy] || 0) + e.amount;
      }
    });
    return totals;
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  const splitAmount = totalSpent / 4;

  return (
    <div className="min-h-screen relative">
      {/* Background Car Image - Hyundai Verna 2026 Black */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1920&auto=format&fit=crop"
          alt="Hyundai Verna 2026 Black"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">South India Road Trip</h1>
                  <p className="text-white/70 text-sm mt-1">Hyderabad → Munnar → Kochi → Alleppey → Varkala → Kanyakumari → Rameswaram → Madurai → Hyderabad</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur border border-white/20">
                <Users className="h-5 w-5 text-white" />
                <span className="font-medium text-white">4 Travelers</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <StatsCards totalSpent={totalSpent} personTotals={personTotals} people={PEOPLE} categoryTotals={categoryTotals} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Plus className="h-5 w-5 text-indigo-300" />
                    Add Expense
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ExpenseForm people={PEOPLE} categories={CATEGORIES} onAdd={addExpense} splitAll={splitAll} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <TrendingUp className="h-5 w-5 text-indigo-300" />
                      Expense History
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm bg-white/10 text-white border border-white/20">
                      {expenses.length} entries
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ExpenseList 
                    expenses={expenses} 
                    onDelete={deleteExpense} 
                    onSelect={setSelectedExpense}
                    selectedExpense={selectedExpense}
                    people={PEOPLE}
                  />
                  
                  {/* Split Among 4 Button */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setShowSplitModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg border bg-indigo-500/20 text-indigo-200 border-indigo-400/30 hover:bg-indigo-500/30"
                    >
                      <Split className="h-5 w-5" />
                      Split Among 4
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Split Modal */}
      {showSplitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSplitModal(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Split Among 4</h2>
              <button
                onClick={() => setShowSplitModal(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-indigo-600 font-medium">Total Amount</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">₹{totalSpent.toLocaleString("en-IN")}</p>
            </div>

            <div className="space-y-3">
              {PEOPLE.map((person) => (
                <div key={person.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center text-white font-bold`}>
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{person.name}</p>
                      <p className="text-xs text-slate-500">Share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">₹{splitAmount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-slate-500">25% each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-sm text-emerald-600 font-medium">Each person pays</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">₹{splitAmount.toLocaleString("en-IN")}</p>
            </div>

            <button
              onClick={() => setShowSplitModal(false)}
              className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Expanded Expense Modal */}
      {selectedExpense && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onDoubleClick={() => setSelectedExpense(null)}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {selectedExpense.photo ? (
                <img 
                  src={selectedExpense.photo} 
                  alt={selectedExpense.location}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center rounded-t-2xl">
                  <span className="text-8xl">{getCategoryIcon(selectedExpense.category)}</span>
                </div>
              )}
              <button
                onClick={() => setSelectedExpense(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedExpense.subcategory || selectedExpense.category}
                  </h2>
                  <p className="text-slate-500 mt-1">{selectedExpense.category}</p>
                </div>
                <span className="text-3xl font-bold text-indigo-600">
                  ₹{selectedExpense.amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Date & Time
                  </div>
                  <p className="font-semibold text-slate-800">
                    {selectedExpense.dateTime.toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <User className="h-4 w-4" />
                    Paid By
                  </div>
                  <p className="font-semibold text-slate-800">{getPersonName(selectedExpense.paidBy)}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <CreditCard className="h-4 w-4" />
                    Payment Mode
                  </div>
                  <p className="font-semibold text-slate-800">{selectedExpense.paymentMode}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="font-semibold text-slate-800">{selectedExpense.location || "N/A"}</p>
                </div>
              </div>

              {selectedExpense.splitAmong && selectedExpense.splitAmong.length > 0 && (
                <div className="mt-4 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Users className="h-4 w-4" />
                    Split Among
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpense.splitAmong.map((personId) => (
                      <Badge key={personId} className={`${getPersonColor(personId)} text-white border border-white/30`}>
                        {getPersonName(personId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedExpense.address && (
                <div className="mt-4 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="text-slate-800">{selectedExpense.address}</p>
                </div>
              )}

              {selectedExpense.notes && (
                <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
                    <StickyNote className="h-4 w-4" />
                    Notes
                  </div>
                  <p className="text-slate-800">{selectedExpense.notes}</p>
                </div>
              )}

              <p className="text-center text-sm text-slate-400 mt-6">
                Double-tap anywhere to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
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

function getPersonColor(id: string): string {
  const colors: Record<string, string> = {
    sai: "bg-emerald-500",
    santosh: "bg-sky-500",
    siva: "bg-rose-500",
    srinu: "bg-amber-500",
  };
  return colors[id] || "bg-gray-500";
}