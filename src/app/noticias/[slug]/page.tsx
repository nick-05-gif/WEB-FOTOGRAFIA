import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsPostBySlug } from "@/lib/news-data";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-16 sm:py-20">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.14em] text-blue-300">{post.date}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          {post.title}
        </h1>
      </header>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-800">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <article className="space-y-8 leading-relaxed text-neutral-300">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at consectetur nulla.
          Duis dignissim, justo ac interdum dictum, eros mauris varius justo, vitae vestibulum
          augue elit at lacus. Nulla facilisi. Integer luctus consequat lorem, vel viverra neque.
        </p>

        {post.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-2xl font-semibold text-neutral-100">{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur congue libero non
          mauris dapibus, in congue risus luctus. Aliquam erat volutpat. Integer tristique,
          ligula ut pellentesque posuere, dolor justo bibendum ipsum, non tempor eros nibh sed
          lectus.
        </p>
      </article>
    </main>
  );
}
