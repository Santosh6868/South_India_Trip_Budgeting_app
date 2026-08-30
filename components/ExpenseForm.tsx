import { useState } from "react";
import { MapPin, Plus, StickyNote, Camera, ImagePlus, Users } from "lucide-react";
import { Expense, Person, PaymentMode } from "@/types/expense";

interface ExpenseFormProps {
  people: Person[];
  categories: { name: string; icon: string; subcategories: string[] }[];
  onAdd: (expense: Expense) => void;
  splitAll: boolean;
}

export function ExpenseForm({ people, categories, onAdd, splitAll }: ExpenseFormProps) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string>("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!category || !amount || !paidBy) return;

    const splitAmong = splitAll ? people.map((p) => p.id) : [paidBy];

    const expense: Expense = {
      id: Date.now().toString(),
      dateTime: new Date(),
      category,
      subcategory,
      amount: parseFloat(amount),
      paidBy,
      splitAmong,
      paymentMode,
      location,
      address,
      notes: category === "Miscellaneous" ? notes : undefined,
      photo: photo || undefined,
    };
    onAdd(expense);
    setAmount("");
    setLocation("");
    setAddress("");
    setSubcategory("");
    setNotes("");
    setPhoto("");
  };

  const selectClass =
    "w-full flex h-10 items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:text-white [&>span]:line-clamp-1";

  const inputClass =
    "flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
          }}
          className={selectClass}
        >
          <option value="" className="bg-slate-800 text-white">Select category</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name} className="bg-slate-800 text-white">
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {category && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Subcategory</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-slate-800 text-white">Select subcategory</option>
            {categories.find((c) => c.name === category)?.subcategories.map((sub) => (
              <option key={sub} value={sub} className="bg-slate-800 text-white">
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Amount (₹)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`pl-8 ${inputClass}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Paid By</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-slate-800 text-white">Who paid?</option>
          {people.map((person) => (
            <option key={person.id} value={person.id} className="bg-slate-800 text-white">
              {person.name}
            </option>
          ))}
        </select>
      </div>

      {splitAll && (
        <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-indigo-200 text-sm">
            <Users className="h-4 w-4" />
            <span>Split among all 4 people</span>
          </div>
          <p className="text-xs text-indigo-200/70 mt-1">
            Each person pays ₹{(parseFloat(amount) / 4).toFixed(2) || "0.00"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Payment Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {(["UPI", "Cash", "FASTag"] as PaymentMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setPaymentMode(mode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                paymentMode === mode
                  ? "bg-indigo-500 text-white shadow-md border border-indigo-400"
                  : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Theni HP Pump"
            className={`pl-9 ${inputClass}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Auto-filled from location"
          className={inputClass}
        />
      </div>

      {category === "Miscellaneous" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-indigo-300" />
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter details of the miscellaneous expense..."
            className={`min-h-[80px] ${inputClass} h-auto py-2`}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Camera className="h-4 w-4 text-indigo-300" />
          Place Photo
        </label>
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-white/20 bg-white/10 hover:bg-white/20 transition-all">
              <ImagePlus className="h-5 w-5 text-white/70" />
              <span className="text-sm text-white/70">Upload photo</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {photo && (
            <img src={photo} alt="Place" className="w-16 h-16 rounded-lg object-cover border border-white/20" />
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-lg border border-indigo-400 h-10 px-4 py-2 transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Expense
      </button>
    </div>
  );
}
