import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import { articles } from "@/components/articles";
import { sections } from "@/components/sections";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";
import ShareButtons from "@/components/ShareButtons";
import YandexAd from "@/components/YandexAd";
import { reachGoal } from "@/lib/metrika";

const SITE_URL = "https://dacha365.site";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = articles.find((a) => a.slug === slug);
  const relatedSection = sections.find((s) => s.id === article?.relatedSection);
  const relatedArticles = article
    ? articles
        .filter((a) => a.slug !== article.slug && a.relatedSection === article.relatedSection)
        .slice(0, 3)
    : [];

  useEffect(() => {
    if (!article) navigate("/articles", { replace: true });
    else window.scrollTo({ top: 0 });
  }, [slug, article, navigate]);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title={article.seoTitle}
        description={article.seoDescription}
        path={`/articles/${article.slug}`}
        article={{ readTime: article.readTime }}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </Link>
            <div className="flex items-center gap-2">
              <SiteSearch variant="icon" />
              <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all">
                <Icon name="ArrowLeft" size={14} />
                Все статьи
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO MINI */}
      <div className="pt-14">
        <div
          className="relative py-14 flex items-end"
          style={{ backgroundColor: article.color + "22" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(25,45%,12%)]/10 to-transparent" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] mb-3">
              <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
              <span>/</span>
              <Link to="/articles" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Статьи</Link>
              <span>/</span>
              <span>{article.title}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: article.color + "33", border: `2px solid ${article.color}55` }}
              >
                {article.emoji}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] tracking-widest uppercase">{article.readTime} чтения</div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--earth-deep))] leading-tight mb-4">
              {article.title}
            </h1>
            <ShareButtons
              url={`${SITE_URL}/articles/${article.slug}`}
              title={article.title}
              source="top"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        {article.content.map((block, bi) => (
          <div key={bi}>
            <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-6 wood-texture">
              <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: article.color }}>
                {block.heading}
              </h2>
              <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-line text-sm md:text-base">
                {block.text}
              </p>
            </div>
            {bi === 0 && article.content.length > 1 && (
              <div className="mt-5">
                <YandexAd blockId="R-A-19523216-16" className="w-full" />
              </div>
            )}
          </div>
        ))}

        <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-5 wood-texture flex items-center justify-center">
          <ShareButtons
            url={`${SITE_URL}/articles/${article.slug}`}
            title={article.title}
            source="bottom"
          />
        </div>

        {relatedArticles.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-deep))] mb-3">
              Читайте также
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/articles/${a.slug}`}
                  className="group bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-4 hover:border-[hsl(var(--earth-ochre))] hover:shadow-md transition-all"
                >
                  <div className="text-xl mb-2">{a.emoji}</div>
                  <div className="text-sm font-semibold text-[hsl(var(--earth-deep))] leading-snug group-hover:text-[hsl(var(--earth-brown))] transition-colors">
                    {a.title}
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">{a.readTime} чтения</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {article.relatedSection === "designer" && (
          <Link
            to="/designer?from=article"
            onClick={() => reachGoal("article_to_designer_click", { article: article.slug })}
            className="group flex items-center gap-4 bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/40 rounded-xl p-5 hover:bg-[hsl(var(--earth-ochre))]/20 transition-all"
          >
            <div className="text-2xl shrink-0">🎨</div>
            <div className="flex-1">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">ИИ-визуализация за 62 ₽</div>
              <div className="font-semibold text-[hsl(var(--earth-deep))]">Попробовать конструктор дизайна участка</div>
            </div>
            <Icon name="ArrowRight" size={18} className="text-[hsl(var(--earth-ochre))] shrink-0" />
          </Link>
        )}

        {relatedSection && (
          <Link
            to={`/${relatedSection.id}`}
            onClick={() => reachGoal("article_to_section_click", { article: article.slug, section: relatedSection.id })}
            className="group flex items-center gap-4 bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/40 rounded-xl p-5 hover:bg-[hsl(var(--earth-ochre))]/20 transition-all"
          >
            <div className="text-2xl shrink-0">{relatedSection.emoji}</div>
            <div className="flex-1">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Подробный раздел с калькулятором</div>
              <div className="font-semibold text-[hsl(var(--earth-deep))]">{relatedSection.title}</div>
            </div>
            <Icon name="ArrowRight" size={18} className="text-[hsl(var(--earth-ochre))] shrink-0" />
          </Link>
        )}

        <Link
          to="/guides"
          onClick={() => reachGoal("article_to_guides_click", { article: article.slug })}
          className="group flex items-center gap-4 bg-white/70 border border-[hsl(var(--earth-sand))]/60 wood-texture rounded-xl p-5 hover:border-[hsl(var(--earth-ochre))] hover:shadow-md transition-all"
        >
          <div className="text-2xl shrink-0">📖</div>
          <div className="flex-1">
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Сохранить себе</div>
            <div className="font-semibold text-[hsl(var(--earth-deep))]">Скачать PDF-гайд по этой теме</div>
          </div>
          <Icon name="Download" size={18} className="text-[hsl(var(--earth-brown))] shrink-0" />
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <div className="text-2xl mb-2">🏡</div>
            <div className="font-serif text-xl text-[hsl(var(--earth-cream))]">КаркасДом</div>
          </Link>
        </div>
      </footer>
    </div>
  );
}