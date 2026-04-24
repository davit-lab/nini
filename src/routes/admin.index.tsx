import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Sparkles, Image, MessageSquareQuote, Mail, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [p, s, sh, r, b, bn] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("shots").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return {
        projects: p.count ?? 0, services: s.count ?? 0, shots: sh.count ?? 0,
        reviews: r.count ?? 0, bookings: b.count ?? 0, newBookings: bn.count ?? 0,
      };
    },
  });

  const cards: { to: "/admin/projects" | "/admin/services" | "/admin/shots" | "/admin/reviews" | "/admin/bookings"; label: string; v: number; icon: typeof Briefcase; badge?: string }[] = [
    { to: "/admin/projects", label: "Projects", v: stats?.projects ?? 0, icon: Briefcase },
    { to: "/admin/services", label: "Services", v: stats?.services ?? 0, icon: Sparkles },
    { to: "/admin/shots", label: "Shots", v: stats?.shots ?? 0, icon: Image },
    { to: "/admin/reviews", label: "Reviews", v: stats?.reviews ?? 0, icon: MessageSquareQuote },
    { to: "/admin/bookings", label: "Bookings", v: stats?.bookings ?? 0, icon: Mail, badge: stats?.newBookings ? `${stats.newBookings} new` : undefined },
  ];

  return (
    <div>
      <span className="micro-label">Overview</span>
      <h1 className="mt-3 text-5xl font-display font-black uppercase tracking-editorial mb-12">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to} to={c.to}
            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition relative"
          >
            <div className="flex items-start justify-between">
              <c.icon size={20} className="text-primary" />
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition" />
            </div>
            <div className="mt-6 text-4xl font-display font-black">{c.v}</div>
            <div className="mt-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">{c.label}</div>
            {c.badge && (
              <span className="absolute top-3 right-10 text-[10px] font-mono uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full">{c.badge}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-16 p-6 rounded-2xl bg-card border border-border max-w-2xl">
        <h3 className="font-display font-bold uppercase text-sm tracking-wider">სწრაფი მითითება</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          ყველა კონტენტი (პროექტები, ფოტოები, სერვისები, რევიუები, საიტის ტექსტები) მართვადია მენიუდან. ფოტოების ასატვირთად უბრალოდ დააჭირეთ "ატვირთე ფოტო" ნებისმიერ ფორმაში.
        </p>
      </div>
    </div>
  );
}
