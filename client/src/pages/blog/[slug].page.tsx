import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetaSEO from "@/components/seo/MetaSEO";
import BlogArticle from "@/components/blog/BlogArticle";
import type { PublicBlogDetail } from "@shared/blog";

interface PublicBlogDetailResponse {
  post: PublicBlogDetail;
}

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery<PublicBlogDetailResponse | null>({
    queryKey: ["public-blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/blogs/${slug}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch blog post");
      return response.json();
    },
  });

  const post = data?.post ?? null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-500">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">Article not found</h1>
          <p className="mt-3 text-slate-600">This article may have been moved, unpublished, or never existed.</p>
          <Link href="/blog">
            <Button className="mt-6 rounded-full">Back to the blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://myeca.in/blog/${post.slug}`;
  const seoTitle = post.seoTitle || `${post.title} | MyeCA Blog`;
  const seoDescription = post.seoDescription || post.excerpt || post.title;

  return (
    <>
      <MetaSEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        type="article"
        ogImage={post.coverImage || undefined}
        twitterImage={post.coverImage || undefined}
        keywords={post.tags}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
        faqPageData={post.faqItems}
        jsonLd={{
          headline: post.title,
          description: seoDescription,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          author: {
            "@type": "Person",
            name: post.authorName,
          },
          image: post.coverImage || undefined,
        }}
      />
      <BlogArticle post={post} />
    </>
  );
}
