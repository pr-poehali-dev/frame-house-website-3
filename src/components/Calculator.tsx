import { useState } from "react";
import type { Section } from "@/components/sections";

interface CalculatorProps {
  calc: Section["calc"];
}

export default function Calculator({ calc }: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(calc.params.map((p) => [p.key, p.default]))
  );
  const results = calc.compute(values);

  return (
    <div className="bg-[hsl(var(--earth-cream))] border border-[hsl(var(--earth-sand))] rounded-xl p-5 wood-texture">
      <h4 className="font-serif text-xl font-semibold text-[hsl(var(--earth-brown))] mb-5">
        🧮 {calc.title}
      </h4>
      <div className="space-y-4 mb-6">
        {calc.params.map((param) => (
          <div key={param.key}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-[hsl(var(--earth-deep))]">
                {param.label}
              </label>
              <span className="text-sm font-semibold text-[hsl(var(--earth-ochre))]">
                {values[param.key]} {param.unit}
              </span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={values[param.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [param.key]: parseFloat(e.target.value) }))
              }
              className="w-full"
              style={{
                background: `linear-gradient(to right, hsl(38,70%,52%) 0%, hsl(38,70%,52%) ${((values[param.key] - param.min) / (param.max - param.min)) * 100}%, hsl(43,40%,72%) ${((values[param.key] - param.min) / (param.max - param.min)) * 100}%, hsl(43,40%,72%) 100%)`
              }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {results.map((r) => (
          <div key={r.label} className="bg-white/60 rounded-lg p-3 text-center border border-[hsl(var(--earth-sand))]">
            <div className="text-2xl font-bold font-serif text-[hsl(var(--earth-brown))]">{r.value}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-tight">{r.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-3 italic">
        * Расчёт приблизительный, для точного — обратитесь к проектировщику
      </p>
    </div>
  );
}
