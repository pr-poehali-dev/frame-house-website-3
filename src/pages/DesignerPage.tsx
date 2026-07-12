import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";
import Seo from "@/components/Seo";
import DesignerHero from "@/components/designer/DesignerHero";
import DesignerStyleStep from "@/components/designer/DesignerStyleStep";
import DesignerPayStep from "@/components/designer/DesignerPayStep";
import DesignerResultStep from "@/components/designer/DesignerResultStep";

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
    reachGoal("designer_payment_success", { order_price: totalPrice, styles: selectedStyles });
    generateAll();
  }, [generateAll, totalPrice, selectedStyles]);

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

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Seo
        title="Конструктор дизайна участка онлайн — ИИ-визуализация за 49 ₽"
        description="Загрузите фото своего участка — искусственный интеллект перерисует его в выбранном стиле: английский сад, японский сад, прованс, минимализм. Результат за 2 минуты."
        path="/designer"
      />
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
        <DesignerHero
          styles={STYLES}
          fileRef={fileRef}
          onDrop={handleDrop}
          onFileChange={handleFile}
        />
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

        {/* Step: Style selection */}
        {step === "style" && imagePreview && (
          <DesignerStyleStep
            styles={STYLES}
            imagePreview={imagePreview}
            selectedStyles={selectedStyles}
            customDesc={customDesc}
            totalPrice={totalPrice}
            pricePer={PRICE_PER}
            canProceed={canProceed}
            onToggleStyle={toggleStyle}
            onCustomDescChange={setCustomDesc}
            onReset={reset}
            onProceed={() => setStep("pay")}
          />
        )}

        {/* Step: Payment */}
        {step === "pay" && (
          <DesignerPayStep
            styles={STYLES}
            selectedStyles={selectedStyles}
            totalPrice={totalPrice}
            pricePer={PRICE_PER}
            robokassaUrl={ROBOKASSA_URL}
            payForm={payForm}
            payError={payError}
            onPayFormChange={setPayForm}
            onPaySuccess={handlePaySuccess}
            onPayError={setPayError}
            onBack={() => setStep("style")}
          />
        )}

        {/* Step: Result with comparison */}
        {step === "result" && results.length > 0 && (
          <DesignerResultStep
            results={results}
            activeResult={activeResult}
            imagePreview={imagePreview!}
            onSetActiveResult={setActiveResult}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}
