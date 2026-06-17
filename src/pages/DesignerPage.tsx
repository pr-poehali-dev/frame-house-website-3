import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PaymentButton } from "@/components/extensions/robokassa/PaymentButton";

const STYLES = [
  { id: "english", label: "Английский сад", desc: "Газон, розы, беседка", emoji: "🌹" },
  { id: "japanese", label: "Японский", desc: "Камни, мох, бамбук", emoji: "🎋" },
  { id: "minimalist", label: "Минимализм", desc: "Бетон, геометрия", emoji: "⬜" },
  { id: "russian", label: "Русская усадьба", desc: "Огород, яблони, забор", emoji: "🍎" },
  { id: "provence", label: "Прованс", desc: "Лаванда, белые камни, арки", emoji: "💜" },
];

const GENERATE_URL = "https://functions.poehali.dev/013291cb-3443-41ab-9787-04a736f0f3f7";
const ROBOKASSA_URL = "https://functions.poehali.dev/76ea08e8-c733-44bf-b365-5bb8f67af536";
const PRICE = 49;

type Step = "upload" | "style" | "pay" | "generating" | "result";

export default function DesignerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [payForm, setPayForm] = useState({ name: "", email: "", phone: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
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

  const handleGenerate = useCallback(async () => {
    if (!imagePreview || !selectedStyle) return;
    setStep("generating");
    setError(null);
    try {
      const base64 = imagePreview.split(",")[1];
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId.current,
          style: selectedStyle,
          image_b64: base64,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Ошибка генерации");
      setResultUrl(data.result_url);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setStep("pay");
    }
  }, [imagePreview, selectedStyle]);

  const handlePaySuccess = useCallback((num: string) => {
    setOrderNumber(num);
    handleGenerate();
  }, [handleGenerate]);

  const reset = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreview(null);
    setSelectedStyle("");
    setResultUrl(null);
    setError(null);
    setOrderNumber(null);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-white/90 border-b border-[hsl(var(--earth-sand))]/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-[hsl(var(--earth-brown))] hover:opacity-70">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
              Конструктор дизайна участка
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Загрузите фото — получите визуализацию в любом стиле
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[
            { key: "upload", label: "Фото", icon: "Upload" },
            { key: "style", label: "Стиль", icon: "Palette" },
            { key: "pay", label: "Оплата", icon: "CreditCard" },
            { key: "result", label: "Результат", icon: "Image" },
          ].map((s, i) => {
            const steps: Step[] = ["upload", "style", "pay", "generating", "result"];
            const current = steps.indexOf(step);
            const idx = steps.indexOf(s.key as Step);
            const done = current > idx;
            const active = current === idx || (s.key === "pay" && step === "generating");
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className={`h-px w-8 ${done ? "bg-[hsl(var(--earth-brown))]" : "bg-[hsl(var(--earth-sand))]"}`} />}
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
            <div
              className="border-2 border-dashed border-[hsl(var(--earth-sand))] rounded-2xl p-12 text-center cursor-pointer hover:border-[hsl(var(--earth-brown))] hover:bg-[hsl(var(--earth-sand))]/10 transition-all"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="ImagePlus" size={48} className="mx-auto mb-4 text-[hsl(var(--earth-sand))]" />
              <h2 className="font-serif text-xl font-semibold text-[hsl(var(--earth-dark))] mb-2">
                Загрузите фото вашего участка
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                Перетащите файл или нажмите для выбора
              </p>
              <span className="text-xs text-[hsl(var(--muted-foreground))]/60">
                JPG, PNG — до 10 МБ
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
            <div className="mt-6 bg-white/70 rounded-xl p-4 border border-[hsl(var(--earth-sand))]/50">
              <p className="text-sm text-[hsl(var(--muted-foreground))] text-center">
                🎨 <strong>Конструктор бесплатно</strong> — расставляйте элементы сами.
                ИИ-генерация <strong>49 руб</strong> — загрузи фото и получи готовый дизайн за минуту.
              </p>
            </div>
          </div>
        )}

        {/* Step: Style selection */}
        {step === "style" && imagePreview && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))] mb-3">
                Ваш участок
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-md h-56 md:h-72">
                <img src={imagePreview} alt="Ваш участок" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={reset}
                className="mt-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] flex items-center gap-1"
              >
                <Icon name="RefreshCw" size={12} /> Загрузить другое фото
              </button>
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))] mb-3">
                Выберите стиль
              </h2>
              <div className="space-y-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      selectedStyle === s.id
                        ? "border-[hsl(var(--earth-brown))] bg-[hsl(var(--earth-sand))]/20"
                        : "border-[hsl(var(--earth-sand))]/50 bg-white/70 hover:border-[hsl(var(--earth-brown))]/50"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <div className="font-medium text-sm text-[hsl(var(--earth-dark))]">{s.label}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.desc}</div>
                    </div>
                    {selectedStyle === s.id && (
                      <Icon name="CheckCircle" size={16} className="ml-auto text-[hsl(var(--earth-brown))]" />
                    )}
                  </button>
                ))}
              </div>
              {selectedStyle && (
                <button
                  onClick={() => setStep("pay")}
                  className="mt-4 w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="Sparkles" size={16} />
                  Сгенерировать за {PRICE} руб
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "pay" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 rounded-2xl border border-[hsl(var(--earth-sand))]/60 p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">✨</div>
                <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
                  ИИ-генерация дизайна
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Стиль: <strong>{STYLES.find(s => s.id === selectedStyle)?.label}</strong>
                </p>
                <div className="text-3xl font-bold text-[hsl(var(--earth-brown))] mt-3">
                  {PRICE} ₽
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
              )}

              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={payForm.name}
                  onChange={(e) => setPayForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={payForm.email}
                  onChange={(e) => setPayForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={payForm.phone}
                  onChange={(e) => setPayForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]"
                />
              </div>

              <PaymentButton
                apiUrl={ROBOKASSA_URL}
                amount={PRICE}
                userName={payForm.name || "Пользователь"}
                userEmail={payForm.email || "user@example.com"}
                userPhone={payForm.phone || "70000000000"}
                cartItems={[{ id: "design", name: `Дизайн участка — ${STYLES.find(s => s.id === selectedStyle)?.label}`, price: PRICE, quantity: 1 }]}
                successUrl={`${window.location.origin}/designer`}
                failUrl={`${window.location.origin}/designer`}
                onSuccess={handlePaySuccess}
                onError={(e) => setError(e.message)}
                buttonText={`Оплатить ${PRICE} ₽ и сгенерировать`}
                className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                disabled={!payForm.name || !payForm.email}
              />

              <button
                onClick={() => setStep("style")}
                className="mt-3 w-full text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] py-2"
              >
                ← Назад к выбору стиля
              </button>
            </div>
          </div>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 border-4 border-[hsl(var(--earth-sand))] border-t-[hsl(var(--earth-brown))] rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">🌿</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))] mb-2">
              ИИ создаёт дизайн...
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Обычно занимает 30–60 секунд. Не закрывайте страницу.
            </p>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && resultUrl && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))] mb-4 text-center">
              Готово! Ваш новый дизайн участка
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center">До</p>
                <div className="rounded-2xl overflow-hidden shadow h-56">
                  <img src={imagePreview!} alt="До" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center">
                  После — {STYLES.find(s => s.id === selectedStyle)?.label}
                </p>
                <div className="rounded-2xl overflow-hidden shadow h-56">
                  <img src={resultUrl} alt="Результат" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <a
                href={resultUrl}
                download="my-garden-design.jpg"
                className="flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all text-sm"
              >
                <Icon name="Download" size={16} />
                Скачать
              </a>
              <button
                onClick={reset}
                className="flex items-center gap-2 border border-[hsl(var(--earth-sand))] text-[hsl(var(--earth-brown))] px-5 py-2.5 rounded-xl font-medium hover:bg-[hsl(var(--earth-sand))]/20 transition-all text-sm"
              >
                <Icon name="RefreshCw" size={16} />
                Новая генерация
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
