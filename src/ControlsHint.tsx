import { useEffect, useState } from "react";

export function ControlsHint() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 4000);
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`controls-hint ${fading ? "fading" : ""}`}>
      <p className="controls-hint-title">使用键盘控制车辆</p>
      <div className="controls-hint-keys">
        <div className="key-row">
          <kbd>↑</kbd>
          <kbd>W</kbd>
        </div>
        <div className="key-row">
          <kbd>←</kbd>
          <kbd>A</kbd>
          <kbd>↓</kbd>
          <kbd>S</kbd>
          <kbd>→</kbd>
          <kbd>D</kbd>
        </div>
      </div>
    </div>
  );
}
