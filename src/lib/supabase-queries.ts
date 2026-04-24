import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  cover_image: string;
  gallery: string[];
  date_label: string | null;
  featured: boolean;
  sort_order: number;
};

export type Service = {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  image: string | null;
  sort_order: number;
};

export type Shot = {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export type Review = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  image: string | null;
  rating: number;
  sort_order: number;
};

export type SiteSettings = {
  id: string;
  hero_title_part1: string;
  hero_title_part2: string;
  hero_quote: string | null;
  contact_location: string;
  contact_email: string | null;
  contact_phone: string | null;
  instagram: string | null;
  facebook: string | null;
  about_text: string | null;
  about_image: string | null;
};

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((d) => ({
    ...d,
    gallery: (d.gallery as unknown as string[]) ?? [],
  })) as Project[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, gallery: (data.gallery as unknown as string[]) ?? [] } as Project;
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((d) => ({ ...d, tags: (d.tags as unknown as string[]) ?? [] })) as Service[];
}

export async function fetchShots(limit?: number): Promise<Shot[]> {
  let q = supabase.from("shots").select("*").order("sort_order", { ascending: true });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Shot[];
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "global").maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}
