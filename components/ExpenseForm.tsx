import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Category</Label>
        <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Subcategory</Label>
          <Select value={subcategory} onValueChange={setSubcategory}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {categories.find((c) => c.name === category)?.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Amount (₹)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">₹</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Paid By</Label>
        <Select value={paidBy} onValueChange={setPaidBy}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Who paid?" />
          </SelectTrigger>
          <SelectContent>
            {people.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {person.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label className="text-sm font-medium text-white">Payment Mode</Label>
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
        <Label className="text-sm font-medium text-white">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Theni HP Pump"
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Auto-filled from location"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      {category === "Miscellaneous" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-indigo-300" />
            Notes
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter details of the miscellaneous expense..."
            className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-white flex items-center gap-2">
          <Camera className="h-4 w-4 text-indigo-300" />
          Place Photo
        </Label>
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

      <Button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg border border-indigo-400">
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
}