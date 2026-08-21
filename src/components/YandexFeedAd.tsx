import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    yaContextCb?: Array<() => void>;
    Ya?: {
      Context: {
        AdvManager: {
          render: (params: { blockId: string; renderTo: string; type: string }) => void;
        };
      };
    };
  }
}

export default function YandexFeedAd() {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerId = `yandex_rtb_R-A-19523216-15-${rawId}`;
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya?.Context.AdvManager.render({
        blockId: "R-A-19523216-15",
        renderTo: containerId,
        type: "feed",
      });
    });
  }, [containerId]);

  return <div id={containerId} className="col-span-full sm:col-span-1" />;
}
