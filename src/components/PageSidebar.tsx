import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Section } from "@/components/sections";
import { reachGoal } from "@/lib/metrika";
import AdFoxAd from "@/components/AdFoxAd";

const CONSULTATION_URL = "https://functions.poehali.dev/9649d88b-762c-40da-9336-b3e5260dd537";

// ─── Рекламные баннеры ──────────────────────────────────────────────
// Замените href, imageSrc и label на свои данные
const AD_BANNERS = [
  {
    id: "banner1",
    href: "https://market.yandex.ru/search?text=брус%20доска%20строительные",
    label: "Купить брус и доску",
    description: "Доставка по всей России. Скидка 10% по промокоду КАРКАС",
    bg: "from-amber-800 to-amber-600",
    icon: "🪵",
  },
  {
    id: "banner2",
    href: "https://market.yandex.ru/search?text=утеплитель%20rockwool",
    label: "Утеплитель ROCKWOOL",
    description: "Официальный дилер. Оптовые цены, самовывоз и доставка",
    bg: "from-stone-700 to-stone-500",
    icon: "🧱",
  },
];

// ─── Ссылки на товары/магазины ───────────────────────────────────────
const SHOP_LINKS = [
  { label: "Максидом — стройматериалы", href: "https://uuwgc.com/g/vw6dqabpgk66633b8cd9b6a2cdd7f0/?erid=25H8d7vbP8SRTvH4HtSZJ1", icon: "ShoppingCart" },
  { label: "Купить цемент и бетон", href: "https://market.yandex.ru/search?text=цемент", icon: "ShoppingCart" },
  { label: "Арматура оптом", href: "https://market.yandex.ru/search?text=арматура%20строительная", icon: "ShoppingCart" },
  { label: "OSB-плиты и фанера", href: "https://market.yandex.ru/search?text=osb%20плита%20фанера", icon: "ShoppingCart" },
  { label: "Металлочерепица", href: "https://market.yandex.ru/search?text=металлочерепица", icon: "ShoppingCart" },
  { label: "Кабель и автоматы", href: "https://market.yandex.ru/search?text=кабель%20автоматы%20электрика", icon: "ShoppingCart" },
  { label: "Трубы ПВХ и ПП", href: "https://market.yandex.ru/search?text=трубы%20пвх%20пп", icon: "ShoppingCart" },
];

interface PageSidebarProps {
  sidebar: Section["sidebar"];
}

export default function PageSidebar({ sidebar }: PageSidebarProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const resp = await fetch(CONSULTATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          comment: formData.comment,
          page: window.location.pathname,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Не удалось отправить заявку");
      reachGoal("consultation_form_submit");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setFormData({ name: "", phone: "", comment: "" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось отправить заявку. Попробуйте ещё раз");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-20">

      {/* Советы и нормы */}
      <div className="bg-[hsl(var(--earth-brown))] text-[hsl(var(--earth-cream))] rounded-xl p-5">
        <h4 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[hsl(var(--earth-ochre))] flex items-center justify-center text-xs text-[hsl(var(--earth-deep))]">✓</span>
          {sidebar.title}
        </h4>
        <ul className="space-y-3">
          {sidebar.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm leading-snug">
              <span className="text-[hsl(var(--earth-ochre))] mt-0.5 shrink-0">▸</span>
              <span className="text-[hsl(var(--earth-sand))]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AdFox: Сайдбар 240x400 */}
      <div className="flex justify-center">
        <AdFoxAd
          ownerId={14667764}
          params={{ p1: "drmln", p2: "hiut" }}
          className="w-[240px] h-[400px]"
        />
      </div>

      {/* Рекламные баннеры */}
      {AD_BANNERS.map((banner) => (
        <a
          key={banner.id}
          href={banner.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`block rounded-xl p-4 bg-gradient-to-br ${banner.bg} text-white hover:opacity-90 transition-opacity group`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{banner.icon}</span>
            <div>
              <div className="font-semibold text-sm leading-tight group-hover:underline">{banner.label}</div>
              <div className="text-xs text-white/70 mt-1 leading-snug">{banner.description}</div>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-2 text-right">реклама</div>
        </a>
      ))}

      {/* Ссылки на товары */}
      <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-4">
        <h4 className="font-semibold text-sm text-[hsl(var(--earth-deep))] mb-3 flex items-center gap-2">
          <Icon name="ShoppingBag" size={15} />
          Купить материалы
        </h4>
        <ul className="space-y-1.5">
          {SHOP_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[hsl(var(--earth-mid))] hover:text-[hsl(var(--earth-ochre))] transition-colors py-0.5"
              >
                <Icon name="ExternalLink" size={12} />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Контактная форма */}
      <div className="bg-[hsl(var(--earth-cream))] border border-[hsl(var(--earth-sand))] rounded-xl p-4">
        <h4 className="font-serif text-lg font-semibold text-[hsl(var(--earth-deep))] mb-3">
          Получить консультацию
        </h4>
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-sm text-green-700">
            ✓ Заявка отправлена! Мы свяжемся с вами.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input
              type="text"
              placeholder="Ваше имя"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
            <input
              type="tel"
              placeholder="Телефон"
              required
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
            <textarea
              placeholder="Вопрос (необязательно)"
              rows={2}
              value={formData.comment}
              onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))] resize-none"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] disabled:opacity-60 text-[hsl(var(--earth-deep))] font-semibold text-sm py-2.5 rounded-lg transition-all"
            >
              {sending ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>

    </aside>
  );
}