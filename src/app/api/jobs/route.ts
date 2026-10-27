import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/* ── Adzuna response shape (partial) ─────────────────────── */

interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: number;
  contract_time?: string;   // "full_time" | "part_time"
  contract_type?: string;   // "permanent" | "contract"
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  category: { label: string; tag: string };
}

interface AdzunaResponse {
  results?: AdzunaJob[];
  count?: number;
}

/* ── Salary formatter ─────────────────────────────────────── */

function formatSalary(
  min: number | undefined,
  max: number | undefined,
  predicted: number | undefined,
): string {
  if (!min && !max) return "Salary not listed";
  const fmt = (n: number) =>
    `R${Math.round(n / 12).toLocaleString("en-ZA")}`;
  const label =
    min && max
      ? `${fmt(min)} – ${fmt(max)}/mo`
      : min
      ? `From ${fmt(min)}/mo`
      : `Up to ${fmt(max!)}/mo`;
  return predicted ? `~${label} (est.)` : label;
}

/* ── Contract type → job type label ─────────────────────── */

function jobTypeLabel(contractTime?: string, contractType?: string): string {
  if (contractTime === "part_time") return "Part-time";
  if (contractType === "contract") return "Contract";
  return "Full-time";
}

/* ── GET handler ─────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey || appId === "your_adzuna_app_id") {
    return NextResponse.json({ jobs: [], error: "Adzuna API keys not configured" }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const what = searchParams.get("what") || "";
  const where = searchParams.get("where") || "south africa";
  const page = searchParams.get("page") || "1";

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "20",
    "content-type": "application/json",
    where,
  });

  if (what) params.set("what", what);

  const url = `https://api.adzuna.com/v1/api/jobs/za/search/${page}?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) {
      return NextResponse.json({ jobs: [], error: `Adzuna ${res.status}` }, { status: 200 });
    }

    const data: AdzunaResponse = await res.json();
    const results = data.results ?? [];

    const jobs = results.map((j) => ({
      id: `adzuna-${j.id}`,
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      description: j.description,
      salary: formatSalary(j.salary_min, j.salary_max, j.salary_is_predicted),
      type: jobTypeLabel(j.contract_time, j.contract_type),
      category: j.category.label,
      postedDate: j.created,
      applyUrl: j.redirect_url,
      source: "Adzuna" as const,
    }));

    return NextResponse.json({ jobs, total: data.count ?? jobs.length });
  } catch (err) {
    console.error("Adzuna fetch error:", err);
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" }, { status: 200 });
  }
}
