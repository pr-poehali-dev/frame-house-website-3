import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PaymentButton } from "@/components/extensions/robokassa/PaymentButton";

const STYLES = [
  { id: "english", label: "Английский сад", desc: "Газон, розы, беседка", emoji: "🌹", preview: "Ухоженный газон, живые изгороди, розовые клумбы, деревянная беседка и извилистые дорожки из камня" },
  { id: "japanese", label: "Японский", desc: "Камни, мох, бамбук", emoji: "🎋", preview: "Граблёный гравий, бамбук, каменные фонари, пруд с карпами и деревянный мостик — атмосфера покоя" },
  { id: "minimalist", label: "Минимализм", desc: "Бетон, геометрия", emoji: "⬜", preview: "Чистые линии, бетонное мощение, декоративные злаки и геометрические клумбы — современный стиль" },
  { id: "russian", label: "Русская усадьба", desc: "Огород, яблони, забор", emoji: "🍎", preview: "Грядки с овощами, яблони и вишни, подсолнухи, деревянный резной забор — уютная дача" },
  { id: "provence", label: "Прованс", desc: "Лаванда, белые камни, арки", emoji: "💜", preview: "Поля лаванды, белые камни, терракота, арочная пергола с розами — юг Франции у вас дома" },
  { id: "custom", label: "Свой вариант", desc: "Опишите сами", emoji: "✏️", preview: "" },
];

const GENERATE_URL = "https://functions.poehali.dev/013291cb-3443-41ab-9787-04a736f0f3f7";
const ROBOKASSA_URL = "https://functions.poehali.dev/76ea08e8-c733-44bf-b365-5bb8f67af536";
const PRICE_PER = 49;

type Step = "upload" | "style" | "pay" | "generating" | "result";

interface ResultItem {
  styleId: string;
  label: string;
  emoji: string;
  url: string | null;
  error: string | null;
  loading: boolean;
}

export default function DesignerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customDesc, setCustomDesc] = useState<string>("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeResult, setActiveResult] = useState<number>(0);
  const [payForm, setPayForm] = useState({ name: "", email: "", phone: "" });
  const [payError, setPayError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setStep("style");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedStyles.length * PRICE_PER;

  const canProceed =
    selectedStyles.length > 0 &&
    (!selectedStyles.includes("custom") || customDesc.trim().length > 0);

  const generateAll = useCallback(async () => {
    if (!imagePreview) return;
    const base64 = imagePreview.split(",")[1];

    const initial: ResultItem[] = selectedStyles.map((sid) => {
      const s = STYLES.find((x) => x.id === sid)!;
      return { styleId: sid, label: s.label, emoji: s.emoji, url: null, error: null, loading: true };
    });
    setResults(initial);
    setActiveResult(0);
    setStep("result");

    await Promise.all(
      selectedStyles.map(async (sid, idx) => {
        try {
          const resp = await fetch(GENERATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: `${sessionId.current}_${sid}`,
              style: sid,
              custom_desc: sid === "custom" ? customDesc : undefined,
              image_b64: base64,
            }),
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Ошибка");
          setResults((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], url: data.result_url, loading: false };
            return next;
          });
        } catch (e: unknown) {
          setResults((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], error: e instanceof Error ? e.message : "Ошибка", loading: false };
            return next;
          });
        }
      })
    );
  }, [imagePreview, selectedStyles, customDesc]);

  const handlePaySuccess = useCallback(() => {
    generateAll();
  }, [generateAll]);

  const reset = () => {
    setStep("upload");
    setImagePreview(null);
    setSelectedStyles([]);
    setResults([]);
    setActiveResult(0);
    setPayError(null);
    setCustomDesc("");
    sessionId.current = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  };

  const lastPreview = selectedStyles.filter((s) => s !== "custom").slice(-1)[0];
  const lastStyle = STYLES.find((s) => s.id === lastPreview);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-white/90 border-b border-[hsl(var(--earth-sand))]/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-[hsl(var(--earth-brown))] hover:opacity-70">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
              Конструктор дизайна участка
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Загрузите фото — получите визуализацию в любом стиле
            </p>
          </div>
        </div>
      </header>

      {/* HERO LANDING */}
      {step === "upload" && (
        <section className="bg-gradient-to-br from-[hsl(var(--earth-deep))] to-[hsl(var(--earth-brown))] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--earth-ochre))]/20 border border-[hsl(var(--earth-ochre))]/40 rounded-full px-4 py-1.5 mb-5">
              <Icon name="Sparkles" size={14} className="text-[hsl(var(--earth-ochre))]" />
              <span className="text-[hsl(var(--earth-ochre))] text-sm font-medium">ИИ-визуализация за 49 ₽</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4 leading-tight">
              Как будет выглядеть<br/>ваш участок?
            </h2>
            <p className="text-[hsl(var(--earth-sand))]/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Загрузите фото своего участка — ИИ перерисует его в любом стиле: английский сад, японский, прованс, минимализм. Готовый результат через 2 минуты.
            </p>

            {/* Стили-теги */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {STYLES.filter(s => s.id !== "custom").map(s => (
                <span key={s.id} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-[hsl(var(--earth-cream))] text-sm px-3 py-1.5 rounded-full">
                  {s.emoji} {s.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-[hsl(var(--earth-cream))] text-sm px-3 py-1.5 rounded-full">
                ✏️ Свой вариант
              </span>
            </div>

            {/* Фичи */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: "Clock", title: "2 минуты", desc: "Результат готов быстро" },
                { icon: "Layers", title: "До 3 стилей", desc: "Сравните варианты" },
                { icon: "Download", title: "Скачайте", desc: "Сохраните изображение" },
              ].map(f => (
                <div key={f.title} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
                  <Icon name={f.icon as "Clock"} size={22} className="text-[hsl(var(--earth-ochre))] mx-auto mb-2" />
                  <div className="font-bold text-[hsl(var(--earth-cream))] mb-0.5">{f.title}</div>
                  <div className="text-xs text-[hsl(var(--earth-sand))]/70">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
          {[
            { key: "upload", label: "Фото", icon: "Upload" },
            { key: "style", label: "Стили", icon: "Palette" },
            { key: "pay", label: "Оплата", icon: "CreditCard" },
            { key: "result", label: "Сравнение", icon: "LayoutGrid" },
          ].map((s, i) => {
            const steps: Step[] = ["upload", "style", "pay", "generating", "result"];
            const current = steps.indexOf(step);
            const idx = steps.indexOf(s.key as Step);
            const done = current > idx;
            const active = current === idx;
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className={`h-px w-6 ${done ? "bg-[hsl(var(--earth-brown))]" : "bg-[hsl(var(--earth-sand))]"}`} />}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-[hsl(var(--earth-brown))] text-white" :
                  done ? "bg-[hsl(var(--earth-sand))]/60 text-[hsl(var(--earth-brown))]" :
                  "bg-white/50 text-[hsl(var(--muted-foreground))]"
                }`}>
                  <Icon name={s.icon as "Upload"} size={12} />
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-dark))] text-center mb-6">
              Шаг 1 — загрузите фото участка
            </h2>
            <div
              className="border-2 border-dashed border-[hsl(var(--earth-brown))]/40 rounded-2xl p-12 text-center cursor-pointer hover:border-[hsl(var(--earth-brown))] hover:bg-[hsl(var(--earth-sand))]/10 transition-all bg-white/60 shadow-sm"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-16 h-16 bg-[hsl(var(--earth-ochre))]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="ImagePlus" size={32} className="text-[hsl(var(--earth-ochre))]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[hsl(var(--earth-dark))] mb-2">
                Перетащите фото сюда
              </h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
                или нажмите для выбора файла
              </p>
              <span className="inline-flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                <Icon name="Upload" size={15} />
                Выбрать фото
              </span>
              <p className="text-xs text-[hsl(var(--muted-foreground))]/60 mt-4">JPG, PNG — до 10 МБ</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { step: "1", text: "Загрузите фото участка" },
                { step: "2", text: "Выберите стиль дизайна" },
                { step: "3", text: "Получите результат" },
              ].map(i => (
                <div key={i.step} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl p-3 text-center">
                  <div className="w-7 h-7 bg-[hsl(var(--earth-ochre))]/20 text-[hsl(var(--earth-ochre))] rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">{i.step}</div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{i.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/25 rounded-xl p-4 text-center">
              <p className="text-sm text-[hsl(var(--earth-dark))]">
                ✨ Выберите <strong>1, 2 или 3 стиля</strong> — ИИ сгенерирует все варианты, вы сравниваете и выбираете лучший. <strong>49 ₽</strong> за каждый стиль.
              </p>
            </div>
          </div>
        )}

        {/* Step: Style selection */}
        {step === "style" && imagePreview && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))] mb-3">Ваш участок</h2>
              <div className="rounded-2xl overflow-hidden shadow-md h-56 md:h-72">
                <img src={imagePreview} alt="Ваш участок" className="w-full h-full object-cover" />
              </div>

              {/* Превью описание */}
              {lastStyle && (
                <div className="mt-3 p-3 bg-[hsl(var(--earth-sand))]/20 border border-[hsl(var(--earth-sand))]/50 rounded-xl transition-all">
                  <p className="text-xs text-[hsl(var(--earth-brown))] font-medium mb-0.5">
                    {lastStyle.emoji} {lastStyle.label}:
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{lastStyle.preview}</p>
                </div>
              )}

              <button onClick={reset} className="mt-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] flex items-center gap-1">
                <Icon name="RefreshCw" size={12} /> Загрузить другое фото
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))]">Выберите стили</h2>
                {selectedStyles.length > 0 && (
                  <span className="text-xs bg-[hsl(var(--earth-brown))] text-white px-2 py-0.5 rounded-full">
                    {selectedStyles.length} выбрано
                  </span>
                )}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
                Можно выбрать несколько — получите все варианты и сравните
              </p>

              <div className="space-y-2">
                {STYLES.map((s) => {
                  const checked = selectedStyles.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStyle(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        checked
                          ? "border-[hsl(var(--earth-brown))] bg-[hsl(var(--earth-sand))]/20"
                          : "border-[hsl(var(--earth-sand))]/50 bg-white/70 hover:border-[hsl(var(--earth-brown))]/50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked ? "bg-[hsl(var(--earth-brown))] border-[hsl(var(--earth-brown))]" : "border-[hsl(var(--earth-sand))]"
                      }`}>
                        {checked && <Icon name="Check" size={12} className="text-white" />}
                      </div>
                      <span className="text-xl">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[hsl(var(--earth-dark))]">{s.label}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.desc}</div>
                      </div>
                      <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">{PRICE_PER} ₽</span>
                    </button>
                  );
                })}
              </div>

              {/* Поле своего описания */}
              {selectedStyles.includes("custom") && (
                <div className="mt-3">
                  <textarea
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="Опишите желаемый дизайн: растения, материалы, стиль... Например: «розарий с фонтаном и беседкой, дорожки из камня»"
                    rows={3}
                    className="w-full border border-[hsl(var(--earth-sand))] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))] resize-none bg-white/80"
                  />
                </div>
              )}

              {/* Итог и кнопка */}
              {selectedStyles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedStyles.length > 1 && (
                    <div className="flex items-center justify-between bg-white/60 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-4 py-2.5">
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        {selectedStyles.length} варианта × {PRICE_PER} ₽
                      </span>
                      <span className="font-bold text-[hsl(var(--earth-brown))]">{totalPrice} ₽</span>
                    </div>
                  )}
                  <button
                    onClick={() => setStep("pay")}
                    disabled={!canProceed}
                    className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Icon name="Sparkles" size={16} />
                    {selectedStyles.length > 1
                      ? `Сгенерировать ${selectedStyles.length} варианта за ${totalPrice} ₽`
                      : `Сгенерировать за ${PRICE_PER} ₽`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "pay" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 rounded-2xl border border-[hsl(var(--earth-sand))]/60 p-6">
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">✨</div>
                <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
                  ИИ-генерация дизайна
                </h2>
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  {selectedStyles.map((sid) => {
                    const s = STYLES.find((x) => x.id === sid)!;
                    return (
                      <span key={sid} className="text-xs bg-[hsl(var(--earth-sand))]/40 px-2 py-0.5 rounded-full">
                        {s.emoji} {s.label}
                      </span>
                    );
                  })}
                </div>
                <div className="text-3xl font-bold text-[hsl(var(--earth-brown))] mt-3">{totalPrice} ₽</div>
                {selectedStyles.length > 1 && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{selectedStyles.length} варианта × {PRICE_PER} ₽</p>
                )}
              </div>

              {payError && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{payError}</div>
              )}

              <div className="space-y-3 mb-5">
                <input type="text" placeholder="Ваше имя" value={payForm.name}
                  onChange={(e) => setPayForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
                <input type="email" placeholder="Email" value={payForm.email}
                  onChange={(e) => setPayForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
                <input type="tel" placeholder="Телефон" value={payForm.phone}
                  onChange={(e) => setPayForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
              </div>

              <PaymentButton
                apiUrl={ROBOKASSA_URL}
                amount={totalPrice}
                userName={payForm.name || "Пользователь"}
                userEmail={payForm.email || "user@example.com"}
                userPhone={payForm.phone || "70000000000"}
                cartItems={selectedStyles.map((sid) => {
                  const s = STYLES.find((x) => x.id === sid)!;
                  return { id: sid, name: `Дизайн — ${s.label}`, price: PRICE_PER, quantity: 1 };
                })}
                successUrl={`${window.location.origin}/designer`}
                failUrl={`${window.location.origin}/designer`}
                onSuccess={handlePaySuccess}
                onError={(e) => setPayError(e.message)}
                buttonText={`Оплатить ${totalPrice} ₽`}
                className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                disabled={!payForm.name || !payForm.email}
              />

              <button onClick={() => setStep("style")}
                className="mt-3 w-full text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] py-2">
                ← Назад к выбору стилей
              </button>
            </div>
          </div>
        )}

        {/* Step: Result with comparison */}
        {step === "result" && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
                {results.length > 1 ? "Сравните варианты" : "Ваш дизайн"}
              </h2>
              <button onClick={reset}
                className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] border border-[hsl(var(--earth-sand))]/50 px-3 py-1.5 rounded-lg">
                <Icon name="RefreshCw" size={12} /> Новый дизайн
              </button>
            </div>

            {/* Tabs — если несколько */}
            {results.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {results.map((r, i) => (
                  <button
                    key={r.styleId}
                    onClick={() => setActiveResult(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                      activeResult === i
                        ? "bg-[hsl(var(--earth-brown))] text-white"
                        : "bg-white/70 border border-[hsl(var(--earth-sand))]/50 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--earth-brown))]/50"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    {r.label}
                    {r.loading && <Icon name="Loader" size={12} className="animate-spin" />}
                    {r.error && <Icon name="AlertCircle" size={12} className="text-red-400" />}
                    {r.url && !r.loading && <Icon name="CheckCircle" size={12} className={activeResult === i ? "text-white/80" : "text-[hsl(var(--earth-brown))]"} />}
                  </button>
                ))}
              </div>
            )}

            {/* Активный результат */}
            {results[activeResult] && (
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center font-medium">До</p>
                  <div className="rounded-2xl overflow-hidden shadow h-64">
                    <img src={imagePreview!} alt="До" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center font-medium">
                    После — {results[activeResult].emoji} {results[activeResult].label}
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow h-64 bg-[hsl(var(--earth-sand))]/20 flex items-center justify-center">
                    {results[activeResult].loading && (
                      <div className="text-center">
                        <div className="w-10 h-10 border-4 border-[hsl(var(--earth-sand))] border-t-[hsl(var(--earth-brown))] rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Генерирую...</p>
                      </div>
                    )}
                    {results[activeResult].error && (
                      <div className="text-center px-4">
                        <Icon name="AlertCircle" size={32} className="mx-auto mb-2 text-red-400" />
                        <p className="text-sm text-red-500">{results[activeResult].error}</p>
                      </div>
                    )}
                    {results[activeResult].url && (
                      <img src={results[activeResult].url!} alt="Результат" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки скачивания */}
            {results[activeResult]?.url && (
              <div className="flex gap-3 justify-center">
                <a
                  href={results[activeResult].url!}
                  download={`garden-${results[activeResult].styleId}.jpg`}
                  className="flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all text-sm"
                >
                  <Icon name="Download" size={16} />
                  Скачать
                </a>
                {results.length > 1 && results.some((r, i) => i !== activeResult && r.url) && (
                  <button
                    onClick={() => {
                      results.forEach((r) => {
                        if (r.url) {
                          const a = document.createElement("a");
                          a.href = r.url!;
                          a.download = `garden-${r.styleId}.jpg`;
                          a.click();
                        }
                      });
                    }}
                    className="flex items-center gap-2 border border-[hsl(var(--earth-sand))] text-[hsl(var(--earth-brown))] px-5 py-2.5 rounded-xl font-medium hover:bg-[hsl(var(--earth-sand))]/20 transition-all text-sm"
                  >
                    <Icon name="DownloadCloud" size={16} />
                    Скачать все
                  </button>
                )}
              </div>
            )}

            {/* Прогресс остальных */}
            {results.length > 1 && results.some((r) => r.loading) && (
              <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-4">
                Остальные варианты генерируются параллельно — переключайтесь между вкладками
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}