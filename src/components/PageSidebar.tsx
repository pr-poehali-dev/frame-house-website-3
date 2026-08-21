import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Section } from "@/components/sections";
import { reachGoal } from "@/lib/metrika";

const CONSULTATION_URL = "https://functions.poehali.dev/9649d88b-762c-40da-9336-b3e5260dd537";

// ─── Рекламные баннеры ──────────────────────────────────────────────
// Замените href, imageSrc и label на свои данные
const AD_BANNERS = [
  {
    id: "banner1",
    href: "#",
    label: "Купить брус и доску",
    description: "Доставка по всей России. Скидка 10% по промокоду КАРКАС",
    bg: "from-amber-800 to-amber-600",
    icon: "🪵",
  },
  {
    id: "banner2",
    href: "#",
    label: "Утеплитель ROCKWOOL",
    description: "Официальный дилер. Оптовые цены, самовывоз и доставка",
    bg: "from-stone-700 to-stone-500",
    icon: "🧱",
  },
];

// ─── Ссылки на товары/магазины ───────────────────────────────────────
// Замените href и label на свои ссылки
const SHOP_LINKS = [
  { label: "Купить цемент и бетон", href: "#", icon: "ShoppingCart" },
  { label: "Арматура оптом", href: "#", icon: "ShoppingCart" },
  { label: "OSB-плиты и фанера", href: "#", icon: "ShoppingCart" },
  { label: "Металлочерепица", href: "#", icon: "ShoppingCart" },
  { label: "Кабель и автоматы", href: "#", icon: "ShoppingCart" },
  { label: "Трубы ПВХ и ПП", href: "#", icon: "ShoppingCart" },
];

interface PageSidebarProps {
  sidebar: Section["sidebar"];
}

export default function PageSidebar({ sidebar }: PageSidebarProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(CONSULTATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          comment: formData.comment,
          page: window.location.pathname,
        }),
      });
      reachGoal("consultation_form_submit");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setFormData({ name: "", phone: "", comment: "" });
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