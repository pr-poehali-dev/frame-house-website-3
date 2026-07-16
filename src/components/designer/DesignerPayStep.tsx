import { PaymentButton } from "@/components/extensions/robokassa/PaymentButton";

interface Style {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  preview: string;
}

interface PayForm {
  name: string;
  email: string;
  phone: string;
}

interface DesignerPayStepProps {
  styles: Style[];
  selectedStyles: string[];
  totalPrice: number;
  pricePer: number;
  robokassaUrl: string;
  payForm: PayForm;
  payError: string | null;
  onPayFormChange: (form: PayForm) => void;
  onOrderCreated: (orderNumber: string) => void;
  onPayError: (message: string) => void;
  onBack: () => void;
}

export default function DesignerPayStep({
  styles,
  selectedStyles,
  totalPrice,
  pricePer,
  robokassaUrl,
  payForm,
  payError,
  onPayFormChange,
  onOrderCreated,
  onPayError,
  onBack,
}: DesignerPayStepProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/80 rounded-2xl border border-[hsl(var(--earth-sand))]/60 p-6">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
            ИИ-генерация дизайна
          </h2>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {selectedStyles.map((sid) => {
              const s = styles.find((x) => x.id === sid)!;
              return (
                <span key={sid} className="text-xs bg-[hsl(var(--earth-sand))]/40 px-2 py-0.5 rounded-full">
                  {s.emoji} {s.label}
                </span>
              );
            })}
          </div>
          <div className="text-3xl font-bold text-[hsl(var(--earth-brown))] mt-3">{totalPrice} ₽</div>
          {selectedStyles.length > 1 && (
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{selectedStyles.length} варианта × {pricePer} ₽</p>
          )}
        </div>

        {payError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{payError}</div>
        )}

        <div className="space-y-3 mb-5">
          <input type="text" placeholder="Ваше имя" value={payForm.name}
            onChange={(e) => onPayFormChange({ ...payForm, name: e.target.value })}
            className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
          <input type="email" placeholder="Email" value={payForm.email}
            onChange={(e) => onPayFormChange({ ...payForm, email: e.target.value })}
            className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
          <input type="tel" placeholder="Телефон" value={payForm.phone}
            onChange={(e) => onPayFormChange({ ...payForm, phone: e.target.value })}
            className="w-full border border-[hsl(var(--earth-sand))] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))]" />
        </div>

        <PaymentButton
          apiUrl={robokassaUrl}
          amount={totalPrice}
          userName={payForm.name || "Пользователь"}
          userEmail={payForm.email || "user@example.com"}
          userPhone={payForm.phone || "70000000000"}
          cartItems={selectedStyles.map((sid) => {
            const s = styles.find((x) => x.id === sid)!;
            return { id: sid, name: `Дизайн — ${s.label}`, price: pricePer, quantity: 1 };
          })}
          successUrl={`${window.location.origin}/designer`}
          failUrl={`${window.location.origin}/designer`}
          onOrderCreated={onOrderCreated}
          onError={(e) => onPayError(e.message)}
          buttonText={`Оплатить ${totalPrice} ₽`}
          className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
          disabled={!payForm.name || !payForm.email}
        />

        <button onClick={onBack}
          className="mt-3 w-full text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] py-2">
          ← Назад к выбору стилей
        </button>
      </div>
    </div>
  );
}