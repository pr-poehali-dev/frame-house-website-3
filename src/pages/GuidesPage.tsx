import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";
import { PaymentButton } from "@/components/extensions/robokassa/PaymentButton";

interface Guide {
  slug: string;
  title: string;
  description: string;
  section: string;
  price: number;
  pages_count: number;
  emoji: string;
}

const GUIDES_URL = "https://functions.poehali.dev/2daec131-9d53-43c2-8f2d-5817278a193a";
const STORAGE_KEY = "guide_orders";

function getStoredOrders(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function storeOrder(slug: string, orderNumber: string) {
  const orders = getStoredOrders();
  orders[slug] = orderNumber;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [payForm, setPayForm] = useState({ name: "", email: "", phone: "" });
  const [payError, setPayError] = useState<string | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(GUIDES_URL)
      .then((r) => r.json())
      .then((data) => setGuides(data.guides || []))
      .finally(() => setLoading(false));
  }, []);

  const checkOrder = useCallback(async (slug: string, orderNumber: string, attemptsLeft = 15) => {
    setChecking((prev) => ({ ...prev, [slug]: true }));
    try {
      const resp = await fetch(`${GUIDES_URL}?order_number=${orderNumber}`);
      const data = await resp.json();
      if (data.status === "paid" && data.items?.[0]?.download_token) {
        setDownloadLinks((prev) => ({ ...prev, [slug]: data.items[0].download_token }));
        setChecking((prev) => ({ ...prev, [slug]: false }));
        return;
      }
      if (attemptsLeft > 0) {
        setTimeout(() => checkOrder(slug, orderNumber, attemptsLeft - 1), 2000);
      } else {
        setChecking((prev) => ({ ...prev, [slug]: false }));
      }
    } catch {
      if (attemptsLeft > 0) {
        setTimeout(() => checkOrder(slug, orderNumber, attemptsLeft - 1), 2000);
      } else {
        setChecking((prev) => ({ ...prev, [slug]: false }));
      }
    }
  }, []);

  useEffect(() => {
    const orders = getStoredOrders();
    Object.entries(orders).forEach(([slug, orderNumber]) => {
      checkOrder(slug, orderNumber);
    });
  }, [checkOrder]);

  const handleDownload = async (token: string) => {
    const resp = await fetch(`${GUIDES_URL}?token=${token}`);
    const data = await resp.json();
    if (data.pdf_url) window.open(data.pdf_url, "_blank");
  };

  const handleOrderCreated = (orderNumber: string) => {
    if (!activeGuide) return;
    storeOrder(activeGuide.slug, orderNumber);
    setActiveGuide(null);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="PDF-гайды по строительству каркасного дома — скачать пошаговые инструкции"
        description="Подробные PDF-гайды по каждому этапу строительства каркасного дома: фундамент, стены, крыша, электрика, канализация, отопление. Скачать сразу после оплаты."
        path="/guides"
      />

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

      <section className="bg-[hsl(var(--earth-deep))] pt-28 pb-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-5xl mb-5">📖</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4">
            PDF-гайды по строительству
          </h1>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Подробные пошаговые инструкции по каждому этапу — скачайте и держите под рукой на стройке
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center text-[hsl(var(--muted-foreground))] py-20">Загрузка гайдов...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((g) => {
              const isPaid = !!downloadLinks[g.slug];
              const isChecking = checking[g.slug];
              return (
                <div
                  key={g.slug}
                  className="bg-white/80 border border-[hsl(var(--earth-sand))]/60 rounded-2xl p-6 wood-texture flex flex-col"
                >
                  <div className="text-4xl mb-3">{g.emoji}</div>
                  <h2 className="font-serif text-lg font-bold text-[hsl(var(--earth-dark))] mb-2 leading-snug">
                    {g.title}
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 flex-1">
                    {g.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mb-4">
                    <span className="flex items-center gap-1">
                      <Icon name="FileText" size={13} />
                      {g.pages_count} стр.
                    </span>
                    <span className="text-lg font-bold text-[hsl(var(--earth-brown))]">{g.price} ₽</span>
                  </div>

                  {isPaid ? (
                    <button
                      onClick={() => handleDownload(downloadLinks[g.slug])}
                      className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Icon name="Download" size={16} />
                      Скачать PDF
                    </button>
                  ) : isChecking ? (
                    <button disabled className="w-full bg-[hsl(var(--earth-sand))]/50 text-[hsl(var(--earth-brown))] py-2.5 rounded-xl font-semibold">
                      Проверяем оплату...
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveGuide(g);
                        setPayError(null);
                      }}
                      className="w-full bg-[hsl(var(--earth-brown))] text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all"
                    >
                      Купить за {g.price} ₽
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <section className="max-w-3xl mx-auto mt-16 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-dark))] mb-4">
              Зачем нужны PDF-гайды по строительству
            </h2>
            <div className="space-y-3 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              <p>
                На стройке не всегда есть интернет или удобно листать сайт с телефона в пыльных перчатках. PDF-гайды собирают всю пошаговую инструкцию по конкретному этапу — фундамент, стены, крыша, электрика, канализация или отопление — в одном компактном файле, который можно распечатать или открыть офлайн прямо на площадке.
              </p>
              <p>
                Каждый гайд написан на основе материалов соответствующего раздела сайта, но дополнительно структурирован по шагам: последовательность работ, нормы СНиП и ГОСТ, типичные ошибки и расчёт материалов — без лишней воды и рекламных вставок.
              </p>
              <p>
                Гайды подойдут тем, кто строит каркасный дом своими руками, а также тем, кто хочет иметь под рукой чек-лист для контроля бригады подрядчиков на каждом этапе работ.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-dark))] mb-4">
              Частые вопросы
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "В каком формате приходит гайд?",
                  a: "Гайд — это PDF-файл, который можно скачать сразу после оплаты, открыть на компьютере, планшете или телефоне, а также распечатать.",
                },
                {
                  q: "Гайд отличается от статьи на сайте?",
                  a: "Да, гайд — это более структурированная версия материала: чек-листы, таблицы норм и последовательность действий, удобные для использования прямо на стройке, без необходимости листать сайт.",
                },
                {
                  q: "Можно скачать гайд повторно, если потерял ссылку?",
                  a: "Да, ссылка на скачивание сохраняется в вашем браузере после оплаты. Если возникли сложности — напишите нам через страницу контактов, поможем восстановить доступ.",
                },
              ].map((item) => (
                <div key={item.q} className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-[hsl(var(--earth-deep))] mb-1.5">{item.q}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {activeGuide && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setActiveGuide(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">{activeGuide.emoji}</div>
              <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
                {activeGuide.title}
              </h2>
              <div className="text-3xl font-bold text-[hsl(var(--earth-brown))] mt-3">
                {activeGuide.price} ₽
              </div>
            </div>

            {payError && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{payError}</div>
            )}

            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Ваше имя"
                value={payForm.name}
                onChange={(e) => setPayForm({ ...payForm, name: e.target.value })}
                className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
              />
              <input
                type="email"
                placeholder="Email — на него придёт ссылка"
                value={payForm.email}
                onChange={(e) => setPayForm({ ...payForm, email: e.target.value })}
                className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={payForm.phone}
                onChange={(e) => setPayForm({ ...payForm, phone: e.target.value })}
                className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
              />
            </div>

            <PaymentButton
              apiUrl={GUIDES_URL}
              amount={activeGuide.price}
              userName={payForm.name || "Пользователь"}
              userEmail={payForm.email || "user@example.com"}
              userPhone={payForm.phone || "70000000000"}
              cartItems={[{ id: activeGuide.slug, name: activeGuide.title, price: activeGuide.price, quantity: 1 }]}
              successUrl={`${window.location.origin}/guides`}
              failUrl={`${window.location.origin}/guides`}
              onOrderCreated={handleOrderCreated}
              onError={(e) => setPayError(e.message)}
              buttonText={`Оплатить ${activeGuide.price} ₽`}
              className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              disabled={!payForm.name || !payForm.email}
            />

            <button
              onClick={() => setActiveGuide(null)}
              className="mt-3 w-full text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] py-2"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-4">
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