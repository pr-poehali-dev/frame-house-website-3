import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";

const REVIEWS_URL = "https://functions.poehali.dev/f0fc7298-f1e9-4ab7-abdc-0948b31c6e24";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  created_at: string;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="Star"
          size={size}
          className={i <= value ? "text-[hsl(var(--earth-ochre))] fill-[hsl(var(--earth-ochre))]" : "text-[hsl(var(--earth-sand))]"}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default function DesignerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", text: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(REVIEWS_URL)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const resp = await fetch(REVIEWS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), text: form.text.trim(), rating }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Ошибка отправки");
      reachGoal("designer_review_submit", { rating });
      setReviews((prev) => [data.review, ...prev]);
      setForm({ name: "", text: "" });
      setRating(5);
      setShowForm(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-serif text-lg font-bold text-[hsl(var(--earth-dark))]">
            Отзывы клиентов
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Stars value={Math.round(avgRating)} />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs font-medium bg-[hsl(var(--earth-brown))] text-white px-3.5 py-2 rounded-lg hover:opacity-90 transition-all"
        >
          {showForm ? "Отменить" : "Оставить отзыв"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Ваша оценка:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Icon
                    name="Star"
                    size={20}
                    className={i <= (hoverRating || rating) ? "text-[hsl(var(--earth-ochre))] fill-[hsl(var(--earth-ochre))]" : "text-[hsl(var(--earth-sand))]"}
                  />
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Ваше имя"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
          <textarea
            placeholder="Расскажите, как вам результат"
            required
            rows={3}
            value={form.text}
            onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(var(--earth-sand))] bg-white focus:outline-none focus:border-[hsl(var(--earth-ochre))] placeholder:text-[hsl(var(--muted-foreground))] resize-none"
          />
          {error && <div className="text-xs text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] disabled:opacity-60 text-[hsl(var(--earth-deep))] font-semibold text-sm py-2.5 rounded-lg transition-all"
          >
            {sending ? "Отправка..." : "Опубликовать отзыв"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center py-6">Загружаем отзывы...</p>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center py-6">
          Отзывов пока нет — станьте первым, кто поделится впечатлением!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-[hsl(var(--earth-dark))]">{r.name}</span>
                <Stars value={r.rating} size={13} />
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{r.text}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]/60 mt-2">{formatDate(r.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
