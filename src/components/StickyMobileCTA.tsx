import { useEffect, useState } from "react";

export function StickyMobileCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("program-section");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const onClick = () => {
    document.getElementById("program-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (hidden) return null;
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-6 right-5 z-[999] h-10 px-4 rounded-full font-bold text-[13px] text-white"
      style={{
        background: "#89010A",
        boxShadow: "0 4px 20px rgba(137,1,10,0.4)",
        maxWidth: 140,
      }}
    >
      Start →
    </button>
  );
}
