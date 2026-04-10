import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Sparkles, TrendingUp, BookOpen, Users, ArrowRight, Tag, ChevronRight, Newspaper,
} from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/blog/BlogCard";
import MetaSEO from "@/components/seo/MetaSEO";
import { cn } from "@/lib/utils";
import type { BlogCategory, PublicBlogSummary } from "@shared/blog";

interface PublicBlogsResponse {
  posts: PublicBlogSummary[];
}

interface PublicCategoriesResponse {
  categories: BlogCategory[];
}

/* ─────────────────── Skeleton card ─────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-slate-100 rounded-full" />
        <div className="h-5 bg-slate-100 rounded-full" />
        <div className="h-4 w-4/5 bg-slate-100 rounded-full" />
        <div className="h-4 w-3/5 bg-slate-100 rounded-full" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-7 w-7 rounded-full bg-slate-100" />
          <div className="h-3 w-24 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Category pill ─────────────────── */
interface CategoryPillProps {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}
function CategoryPill({ label, active, count, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
          : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "inline-flex items-center justify-center rounded-full px-1.5 py-px text-[10px] font-semibold leading-none",
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─────────────────── Main page ─────────────────── */
export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: postsData, isLoading: postsLoading } = useQuery<PublicBlogsResponse>({
    queryKey: ["public-blogs"],
    queryFn: async () => {
      const response = await fetch("/api/public/blogs");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  const { data: categoriesData } = useQuery<PublicCategoriesResponse>({
    queryKey: ["public-blog-categories"],
    queryFn: async () => {
      const response = await fetch("/api/public/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const posts = postsData?.posts ?? [];
  const categories = categoriesData?.categories ?? [];

  /* Count posts per category */
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of posts) {
      if (p.category?.id) map[p.category.id] = (map[p.category.id] ?? 0) + 1;
    }
    return map;
  }, [posts]);

  /* Filtered posts */
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category?.id === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return [post.title, post.excerpt ?? "", post.authorName, ...(post.tags ?? [])]
        .join(" ").toLowerCase().includes(query);
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts.find((p) => p.isFeatured) ?? filteredPosts[0] ?? null;
  const remainingPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  /* Trending tags — top 12 most used */
  const trendingTags = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of posts) {
      for (const tag of p.tags ?? []) {
        map[tag] = (map[tag] ?? 0) + 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tag]) => tag);
  }, [posts]);

  /* Stats */
  const uniqueAuthors = useMemo(() => new Set(posts.map((p) => p.authorName)).size, [posts]);

  return (
    <div className="min-h-screen bg-white">
      <MetaSEO
        title="MyeCA Blog | Tax Guides, Compliance Insights, and Expert Articles"
        description="Explore MyeCA's editorial blog for practical tax guides, business compliance explainers, and expert financial insights written by qualified CAs."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Decorative dots */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Colour blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-600 opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-sm">
            <Newspaper className="h-3.5 w-3.5" />
            MyeCA Editorial Hub
          </div>

          {/* Headline */}
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
            Tax knowledge,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              made simple.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300 leading-relaxed">
            Expert-led guides on income tax, GST, business compliance, and more — written by chartered accountants for Indian businesses and individuals.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, explainers…"
                className="h-12 rounded-xl border-white/10 bg-white/10 pl-11 text-white placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/20 backdrop-blur-sm"
              />
            </div>
            <Button className="h-12 rounded-xl bg-blue-500 px-5 hover:bg-blue-400 text-white shrink-0">
              Search
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { icon: BookOpen, value: `${posts.length}+`, label: "Articles published" },
              { icon: Tag, value: `${categories.length}`, label: "Categories" },
              { icon: Users, value: `${uniqueAuthors}`, label: "Expert authors" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[11px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category strip ── */}
      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3.5 scrollbar-none">
            <CategoryPill
              label="All"
              active={selectedCategory === "all"}
              count={posts.length}
              onClick={() => setSelectedCategory("all")}
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                label={cat.name}
                active={selectedCategory === cat.id}
                count={categoryCounts[cat.id]}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Loading skeletons */}
        {postsLoading ? (
          <div className="space-y-12">
            <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
            <div className="rounded-2xl border border-slate-200 bg-slate-100 animate-pulse h-96" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty state */
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-900">No articles match these filters</h2>
            <p className="mt-3 text-slate-600">Try a different keyword or switch to all categories.</p>
            <Button
              className="mt-6 rounded-full"
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="space-y-16">

            {/* ── Featured article ── */}
            {featuredPost && (
              <section>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900">Featured article</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Editor's top pick from this issue</p>
                    </div>
                  </div>
                </div>
                <BlogCard post={featuredPost} variant="featured" />
              </section>
            )}

            {/* ── Trending topics ── */}
            {trendingTags.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Trending Topics</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="text-slate-400">#</span>{tag}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Latest articles ── */}
            {remainingPosts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900">Latest articles</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {remainingPosts.length} article{remainingPosts.length !== 1 ? "s" : ""} · updated regularly
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Category spotlight ── */}
            {categories.length > 0 && selectedCategory === "all" && !searchQuery && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                    <Tag className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Browse by category</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Jump directly to the topics you care about</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categories.map((cat) => {
                    const count = categoryCounts[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {cat.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {count} article{count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* ── Newsletter / CTA banner ── */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-blue-600 to-blue-800 mt-8">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="rounded-full border-white/20 bg-white/10 text-white text-xs">
                Stay informed
              </Badge>
              <h2 className="mt-4 text-3xl font-bold text-white leading-snug">
                Never miss a tax deadline or compliance update.
              </h2>
              <p className="mt-3 text-blue-100 text-base leading-relaxed">
                Our articles cover every ITR deadline, GST update, and regulatory change — written in plain language for business owners and individuals alike.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/register">
                <Button className="h-12 rounded-full bg-white px-7 text-blue-700 font-semibold hover:bg-blue-50 shadow-md">
                  Create free account
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="h-12 rounded-full border-white/30 bg-transparent px-7 text-white hover:bg-white/10">
                  Explore services <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
