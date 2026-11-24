import { mapOpenLibrary } from "@/lib/catalog";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim().slice(0, 120) ?? "";
  if (q.length < 2) return Response.json({ books: [] });
  if (isRateLimited(`search:${clientIp(req)}`, 60, 60 * 1000)) {
    return Response.json({ error: "Too many searches." }, { status: 429 });
  }

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "12");
  url.searchParams.set("fields", "title,author_name,first_publish_year,cover_i");

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Open Library responded ${res.status}`);
    const data = (await res.json()) as { docs?: Parameters<typeof mapOpenLibrary>[0] };
    return Response.json({ books: mapOpenLibrary(data.docs ?? []) });
  } catch (err) {
    console.error("catalog search failed:", err);
    // The UI still lets the user summarise whatever they typed.
    return Response.json({ books: [], error: "Catalog search is unavailable." });
  }
}
