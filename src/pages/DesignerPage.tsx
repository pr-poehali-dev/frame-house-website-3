import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";
import Seo from "@/components/Seo";
import DesignerHero from "@/components/designer/DesignerHero";
import DesignerStyleStep from "@/components/designer/DesignerStyleStep";
import DesignerPayStep from "@/components/designer/DesignerPayStep";
import DesignerResultStep from "@/components/designer/DesignerResultStep";
import SiteSearch from "@/components/SiteSearch";

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
const PRICE_PER = 62;
const PENDING_ORDER_KEY = "designer_pending_order";
const PENDING_STATE_KEY = "designer_pending_state";

type Step = "upload" | "style" | "pay" | "checking" | "generating" | "result";

interface ResultItem {
  styleId: string;
  label: string;
  emoji: string;
  url: string | null;
  error: string | null;
  loading: boolean;
}

interface PendingState {
  imagePreview: string;
  selectedStyles: string[];
  customDesc: string;
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

  const generateAll = useCallback(async (photo: string, styles: string[], custom: string) => {
    const base64 = photo.split(",")[1];

    const initial: ResultItem[] = styles.map((sid) => {
      const s = STYLES.find((x) => x.id === sid)!;
      return { styleId: sid, label: s.label, emoji: s.emoji, url: null, error: null, loading: true };
    });
    setResults(initial);
    setActiveResult(0);
    setStep("result");

    await Promise.all(
      styles.map(async (sid, idx) => {
        try {
          const resp = await fetch(GENERATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: `${sessionId.current}_${sid}`,
              style: sid,
              custom_desc: sid === "custom" ? custom : undefined,
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
  }, []);

  const handleOrderCreated = useCallback((orderNumber: string) => {
    if (imagePreview) {
      const pending: PendingState = { imagePreview, selectedStyles, customDesc };
      localStorage.setItem(PENDING_ORDER_KEY, orderNumber);
      localStorage.setItem(PENDING_STATE_KEY, JSON.stringify(pending));
    }
  }, [imagePreview, selectedStyles, customDesc]);

  // Проверяем незавершённый заказ при загрузке страницы (возврат после оплаты Robokassa)
  useEffect(() => {
    const pendingOrder = localStorage.getItem(PENDING_ORDER_KEY);
    const pendingStateRaw = localStorage.getItem(PENDING_STATE_KEY);
    if (!pendingOrder || !pendingStateRaw) return;

    let pendingState: PendingState;
    try {
      pendingState = JSON.parse(pendingStateRaw);
    } catch {
      localStorage.removeItem(PENDING_ORDER_KEY);
      localStorage.removeItem(PENDING_STATE_KEY);
      return;
    }

    setStep("checking");

    const checkStatus = async (attemptsLeft: number) => {
      try {
        const resp = await fetch(`${ROBOKASSA_URL}?order_number=${encodeURIComponent(pendingOrder)}`);
        const data = await resp.json();

        if (data.status === "paid") {
          localStorage.removeItem(PENDING_ORDER_KEY);
          localStorage.removeItem(PENDING_STATE_KEY);
          setImagePreview(pendingState.imagePreview);
          setSelectedStyles(pendingState.selectedStyles);
          setCustomDesc(pendingState.customDesc);
          reachGoal("designer_payment_success", { styles: pendingState.selectedStyles });
          generateAll(pendingState.imagePreview, pendingState.selectedStyles, pendingState.customDesc);
          return;
        }

        if (attemptsLeft > 0) {
          setTimeout(() => checkStatus(attemptsLeft - 1), 2000);
        } else {
          localStorage.removeItem(PENDING_ORDER_KEY);
          localStorage.removeItem(PENDING_STATE_KEY);
          setPayError("Не удалось подтвердить оплату. Если деньги списались — напишите нам, мы разберёмся.");
          setImagePreview(pendingState.imagePreview);
          setSelectedStyles(pendingState.selectedStyles);
          setCustomDesc(pendingState.customDesc);
          setStep("pay");
        }
      } catch {
        if (attemptsLeft > 0) {
          setTimeout(() => checkStatus(attemptsLeft - 1), 2000);
        } else {
          setStep("upload");
        }
      }
    };

    checkStatus(15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        title="Конструктор дизайна участка онлайн — ИИ-визуализация за 62 ₽"
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
          <SiteSearch variant="icon" className="text-[hsl(var(--earth-brown))] hover:opacity-70 p-1" />
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
            const steps: Step[] = ["upload", "style", "pay", "checking", "generating", "result"];
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
            onOrderCreated={handleOrderCreated}
            onPayError={setPayError}
            onBack={() => setStep("style")}
          />
        )}

        {/* Step: Checking payment after redirect back from Robokassa */}
        {step === "checking" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-12 h-12 border-4 border-[hsl(var(--earth-sand))] border-t-[hsl(var(--earth-brown))] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[hsl(var(--earth-dark))] font-medium">Проверяем оплату...</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Обычно это занимает несколько секунд</p>
          </div>
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