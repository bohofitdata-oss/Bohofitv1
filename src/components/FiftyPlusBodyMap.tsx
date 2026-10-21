import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BODY_AREAS, EXTRA_AREAS } from "@/lib/fiftyplus-focus";
import { cn } from "@/lib/utils";

export function FiftyPlusBodyMap({ selected, onToggle }: { selected: string[]; onToggle: (area: string) => void }) {
  const [view, setView] = useState<"Front" | "Back">("Front");
  const chip = (label: string) => <Button key={label} variant="outline" aria-pressed={selected.includes(label)} onClick={() => onToggle(label)} className={cn("rounded-full h-auto min-h-11 py-3 px-4 text-sm whitespace-normal font-normal", selected.includes(label) ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-border bg-transparent text-muted-foreground hover:border-warm-gold/60 hover:bg-transparent hover:text-foreground")}>{selected.includes(label) && <Check className="size-3.5" />}{label}</Button>;
  return <div>
    <div className="flex justify-center gap-1 mb-8" role="group" aria-label="Body map view">{(["Front", "Back"] as const).map(side => <Button key={side} variant="ghost" aria-pressed={view === side} onClick={() => setView(side)} className={cn("rounded-full px-6", view === side ? "bg-warm-gold/10 text-warm-gold hover:bg-warm-gold/15" : "text-muted-foreground")}>{side}</Button>)}</div>
    <div className="fiftyplus-body-map relative mx-auto" data-view={view}>
      <svg viewBox="0 0 320 560" className="w-full h-full text-muted-foreground" role="img" aria-label={`${view} view of the body`}>
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="160" cy="49" rx="28" ry="35" />
          <path d="M146 79 L144 99 Q125 105 110 112 Q96 122 93 150 L82 212 L65 272 Q61 286 69 291 Q77 294 82 279 L106 220 L119 171 L120 239 Q112 272 119 299 L129 379 L128 477 L119 515 Q118 526 136 526 L148 522 L151 478 L154 381 L160 311 L166 381 L169 478 L172 522 L184 526 Q202 526 201 515 L192 477 L191 379 L201 299 Q208 272 200 239 L201 171 L214 220 L238 279 Q243 294 251 291 Q259 286 255 272 L238 212 L227 150 Q224 122 210 112 Q195 105 176 99 L174 79" />
          {view === "Front" ? <><path d="M141 48 Q146 45 151 48 M169 48 Q174 45 179 48 M154 64 Q160 67 166 64 M137 135 Q160 147 183 135 M137 250 Q160 259 183 250" /><path d="M160 159 L160 229" /></> : <><path d="M160 103 L160 257 M123 133 Q145 136 147 168 M197 133 Q175 136 173 168 M127 267 Q145 278 160 272 Q175 278 193 267" /></>}
          <path d="M130 385 Q139 390 148 385 M172 385 Q181 390 190 385 M133 485 L147 485 M173 485 L187 485" />
        </g>
      </svg>
      {BODY_AREAS.map(area => <Button key={area.label} variant="ghost" type="button" aria-label={area.label} title={area.label} aria-pressed={selected.includes(area.label)} onClick={() => onToggle(area.label)} className={cn("fiftyplus-map-dot absolute size-11 p-0 rounded-full text-warm-gold hover:bg-warm-gold/15 focus-visible:ring-warm-gold", `map-${area.position}`, selected.includes(area.label) && "is-selected")}><span className="size-3 rounded-full bg-warm-gold border border-warm-gold" /></Button>)}
    </div>
    <div className="mt-6 flex flex-wrap justify-center gap-2 md:hidden" aria-label="Body areas">{BODY_AREAS.map(area => chip(area.label))}</div>
    <div className="mt-6 flex flex-wrap justify-center gap-2">{EXTRA_AREAS.map(chip)}</div>
    <p className="text-sm text-muted-foreground text-center mt-7">Tap where it hurts. Your coach sees this before you meet.</p>
    <div className="mt-8 grid sm:grid-cols-2 gap-4" aria-live="polite">{BODY_AREAS.filter(area => selected.includes(area.label)).map(area => <article key={area.label} className="rounded-lg border border-warm-gold/20 bg-card p-5"><h3 className="font-sans text-base font-medium text-warm-gold">{area.label}</h3><p className="text-xs text-muted-foreground mt-4">What people tell us</p><div className="mt-2 text-sm text-foreground/85 space-y-1">{area.quotes.map(quote => <p key={quote} className="text-foreground/85">“{quote}”</p>)}</div><p className="text-xs text-warm-gold mt-5">How we help</p><p className="mt-2 text-sm text-muted-foreground leading-relaxed">{area.help}</p></article>)}</div>
  </div>;
}