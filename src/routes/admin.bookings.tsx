import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckCircle2, Circle, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: "new" | "contacted" | "confirmed" | "done" | "cancelled";
  created_at: string;
};

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const qc = useQueryClient();
  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  async function setStatus(id: string, status: Booking["status"]) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["bookings"] });
  }

  async function remove(id: string) {
    if (!confirm("წავშალო?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["bookings"] });
    toast.success("წაშლილია");
  }

  const newCount = bookings.filter((b) => b.status === "new").length;

  return (
    <div>
      <span className="micro-label">Inbox {newCount > 0 && <span className="ml-2 text-primary">· {newCount} new</span>}</span>
      <h1 className="mt-3 text-5xl font-display font-black uppercase tracking-editorial mb-12">Bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className={`p-5 rounded-2xl bg-card border ${b.status === "new" ? "border-primary/40" : "border-border"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold">{b.name}</span>
                  {b.status === "new" && <span className="text-[10px] font-mono uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full">NEW</span>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <a href={`mailto:${b.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12} />{b.email}</a>
                  {b.phone && <a href={`tel:${b.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone size={12} />{b.phone}</a>}
                </div>
                {b.service && <div className="text-xs text-primary mt-1.5 font-mono uppercase">{b.service}</div>}
                {b.message && <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap">{b.message}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  {new Date(b.created_at).toLocaleDateString()} {new Date(b.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setStatus(b.id, b.status === "new" ? "contacted" : "new")}
                    className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center"
                    title={b.status === "new" ? "მონიშნე დაკავშირებულად" : "დააბრუნე ახლად"}
                  >
                    {b.status === "new" ? <Circle size={14} /> : <CheckCircle2 size={14} className="text-primary" />}
                  </button>
                  <button onClick={() => remove(b.id)} className="w-9 h-9 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <div className="text-muted-foreground py-10 text-center">ჯერ შეტყობინებები არ მოსულა.</div>}
      </div>
    </div>
  );
}
