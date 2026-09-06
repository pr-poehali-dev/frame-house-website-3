import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import { mistakes } from "@/components/mistakes";
import { sections } from "@/components/sections";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";
import ShareButtons from "@/components/ShareButtons";

const SITE_URL = "https://dacha365.site";

export default function MistakePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const item = mistakes.find((m) => m.slug === slug);
  const relatedSection = sections.find((s) => s.id === item?.relatedSection);

  useEffect(() => {
    if (!item) navigate("/mistakes", { replace: true });
    else window.scrollTo({ top: 0 });
  }, [slug, item, navigate]);

  if (!item) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title={item.seoTitle}
        description={item.seoDescription}
        path={`/mistakes/${item.slug}`}
        article={{ readTime: item.readTime }}
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
              <Link to="/mistakes" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all">
                <Icon name="ArrowLeft" size={14} />
                Все ошибки
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO MINI */}
      <div className="pt-14">
        <div
          className="relative py-14 flex items-end"
          style={{ backgroundColor: item.color + "22" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(25,45%,12%)]/10 to-transparent" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] mb-3">
              <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
              <span>/</span>
              <Link to="/mistakes" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Как не надо строить</Link>
              <span>/</span>
              <span>{item.title}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: item.color + "33", border: `2px solid ${item.color}55` }}
              >
                {item.emoji}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] tracking-widest uppercase">{item.readTime} чтения</div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--earth-deep))] leading-tight mb-4">
              {item.title}
            </h1>
            <ShareButtons
              url={`${SITE_URL}/mistakes/${item.slug}`}
              title={item.title}
              source="top"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-6 wood-texture">
          <h2 className="font-serif text-xl font-semibold mb-3 text-[hsl(var(--earth-deep))] flex items-center gap-2">
            <Icon name="X" size={18} className="text-red-500 shrink-0" />
            Что сделали не так
          </h2>
          <p className="text-[hsl(var(--foreground))] leading-relaxed text-sm md:text-base">
            {item.mistake}
          </p>
        </div>

        <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-6 wood-texture">
          <h2 className="font-serif text-xl font-semibold mb-3 text-[hsl(var(--earth-deep))] flex items-center gap-2">
            <Icon name="TriangleAlert" size={18} className="text-amber-500 shrink-0" />
            К чему это привело
          </h2>
          <p className="text-[hsl(var(--foreground))] leading-relaxed text-sm md:text-base">
            {item.consequence}
          </p>
        </div>

        <div className="bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/40 rounded-xl p-6 wood-texture">
          <h2 className="font-serif text-xl font-semibold mb-3 text-[hsl(var(--earth-deep))] flex items-center gap-2">
            <Icon name="Check" size={18} className="text-green-600 shrink-0" />
            Как правильно
          </h2>
          <p className="text-[hsl(var(--foreground))] leading-relaxed text-sm md:text-base">
            {item.correct}
          </p>
        </div>

        <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-5 wood-texture flex items-center justify-center">
          <ShareButtons
            url={`${SITE_URL}/mistakes/${item.slug}`}
            title={item.title}
            source="bottom"
          />
        </div>

        {relatedSection && (
          <Link
            to={`/${relatedSection.id}`}
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

        <div className="flex gap-3 bg-[hsl(var(--earth-sand))]/20 border border-[hsl(var(--earth-sand))]/40 rounded-xl p-4">
          <Icon name="TriangleAlert" size={16} className="text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
            Разбор основан на типичном обобщённом сценарии и носит информационный характер. Конкретные причины дефектов на вашем объекте может установить только очный осмотр специалиста.
          </p>
        </div>
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
