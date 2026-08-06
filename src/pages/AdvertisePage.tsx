import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Seo from "@/components/Seo";
import { reachGoal } from "@/lib/metrika";
import SiteSearch from "@/components/SiteSearch";

const AD_REQUEST_URL = "https://functions.poehali.dev/316f120a-e30d-4a28-821a-841e4b074921";

const AUDIENCE = [
  { icon: "Users", title: "Целевая аудитория", text: "Владельцы участков и застройщики каркасных домов — от выбора фундамента до отделки" },
  { icon: "Layers", title: "6 тематических разделов", text: "Фундамент, стены, крыша, электрика, канализация, отопление — точечное размещение под товар" },
  { icon: "Sparkles", title: "Конструктор дизайна", text: "Платный ИИ-сервис визуализации участка — вовлечённая, платёжеспособная аудитория" },
];

const FORMATS = [
  { icon: "Image", title: "Баннер в боковой панели", text: "Показывается на всех страницах разделов рядом с полезным контентом" },
  { icon: "ExternalLink", title: "Ссылка в блоке «Купить материалы»", text: "Прямая ссылка на ваш каталог или товар в тематическом разделе" },
  { icon: "Star", title: "Индивидуальное размещение", text: "Нативная рекомендация внутри статьи или на странице конструктора" },
];

export default function AdvertisePage() {
  const [form, setForm] = useState({ company: "", name: "", phone: "", email: "", website: "", comment: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const resp = await fetch(AD_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company,
          contact_name: form.name,
          phone: form.phone,
          email: form.email,
          website: form.website,
          comment: form.comment,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Ошибка отправки");
      reachGoal("advertise_form_submit");
      setStatus("sent");
      setForm({ company: "", name: "", phone: "", email: "", website: "", comment: "" });
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="Разместить рекламу на сайте КаркасДом — реклама для строительных магазинов"
        description="Разместите рекламу вашего магазина стройматериалов на сайте КаркасДом. Целевая аудитория застройщиков каркасных домов. Баннеры, ссылки, нативные размещения."
        path="/advertise"
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </Link>
            <div className="flex items-center gap-2">
              <SiteSearch variant="icon" />
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all">
                <Icon name="ArrowLeft" size={14} />
                На главную
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[hsl(var(--earth-deep))] to-[hsl(var(--earth-brown))] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--earth-ochre))]/20 border border-[hsl(var(--earth-ochre))]/40 rounded-full px-4 py-1.5 mb-5">
            <Icon name="Megaphone" size={14} className="text-[hsl(var(--earth-ochre))]" />
            <span className="text-[hsl(var(--earth-ochre))] text-sm font-medium">Реклама на сайте</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4">
            Разместите рекламу для застройщиков
          </h1>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            КаркасДом читают люди, которые прямо сейчас строят дом и покупают материалы — цемент, металлочерепицу, утеплитель, кабель, трубы. Разместите свою рекламу рядом с полезным контентом.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Аудитория */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-deep))] mb-6">Кто читает сайт</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {AUDIENCE.map((a) => (
              <div key={a.title} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-2xl p-6">
                <div className="w-10 h-10 bg-[hsl(var(--earth-ochre))]/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={a.icon} size={20} className="text-[hsl(var(--earth-ochre))]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[hsl(var(--earth-deep))] mb-2">{a.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Форматы */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-deep))] mb-6">Форматы размещения</h2>
          <div className="space-y-3">
            {FORMATS.map((f) => (
              <div key={f.title} className="flex items-start gap-4 bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-5 py-4">
                <div className="w-9 h-9 bg-[hsl(var(--earth-ochre))]/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={f.icon} size={18} className="text-[hsl(var(--earth-ochre))]" />
                </div>
                <div>
                  <div className="font-semibold text-[hsl(var(--earth-deep))]">{f.title}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Форма заявки */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-deep))] mb-2">Оставить заявку</h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">Расскажите о своей компании — мы свяжемся с вами и обсудим формат и стоимость размещения.</p>

          <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-2xl p-6 max-w-xl">
            {status === "sent" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700">
                <Icon name="CheckCircle" size={28} className="mx-auto mb-2" />
                Заявка отправлена! Мы свяжемся с вами в ближайшее время.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Название компании"
                  required
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    placeholder="Телефон"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Сайт компании (необязательно)"
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
                <textarea
                  placeholder="Что хотите разместить (необязательно)"
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))] resize-none"
                />

                {status === "error" && error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-[hsl(var(--earth-brown))] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {status === "sending" ? "Отправка..." : "Отправить заявку"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-xl text-[hsl(var(--earth-cream))] mb-4">КаркасДом</div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[hsl(var(--earth-sand))]/60">
            <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
            <Link to="/about" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">О проекте</Link>
            <Link to="/contacts" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Контакты</Link>
            <Link to="/advertise" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Реклама на сайте</Link>
            <Link to="/offerta" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Публичная оферта</Link>
            <Link to="/privacy" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Политика конфиденциальности</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}