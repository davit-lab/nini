import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchSettings } from "@/lib/supabase-queries";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="micro-label">Error 404</span>
        <h1 className="mt-4 text-7xl font-display font-black uppercase tracking-editorial">
          Lost in the <span className="accent-font italic font-normal text-primary lowercase">frame</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nino Khikhidze — Independent Photography Studio" },
      {
        name: "description",
        content:
          "Nino Khikhidze — independent photographer based in Tbilisi. Editorial, portrait, family, brand & event photography.",
      },
      { name: "author", content: "Nino Khikhidze" },
      { property: "og:title", content: "Nino Khikhidze — Independent Photography Studio" },
      {
        property: "og:description",
        content: "Editorial, portrait, family, brand & event photography from Tbilisi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ninokhikhidze" },
      { name: "theme-color", content: "#0b0b0d" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23d97b3a'/><circle cx='16' cy='16' r='5' fill='%230b0b0d'/></svg>" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
      <Toaster theme="dark" position="bottom-right" richColors />
    </QueryClientProvider>
  );
}

function Layout() {
  const router = useRouter();
  const isAdmin = router.state.location.pathname.startsWith("/admin");
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
    staleTime: 60_000,
  });

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="noise" aria-hidden />
      <SiteNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter settings={settings ?? null} />
    </div>
  );
}
