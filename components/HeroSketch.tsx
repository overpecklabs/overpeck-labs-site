// Hand-drawn style marker sketches for the whiteboard hero.
// Paths with class "draw" are animated with a stroke-dasharray "draw-on" effect (see Hero.tsx):
//   data-step="1..5"  -> drawn in sequence on page load
//   data-scroll       -> extra flourishes drawn as you scroll
// Text with class "sk-text" fades in with its step.

export const INK = { black: "#1d1d1f", blue: "#1f6feb", red: "#e5484d", green: "#2f9e44", teal: "#12b5a6" };

const VB = "0 0 640 520";

const stroke = (color: string, w = 3.5) => ({
  fill: "none",
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Slight wobble so lines read as marker, not vector. */
function RoughFilter({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
    </defs>
  );
}

const textStyle = (color: string, size: number) => ({ fill: color, fontSize: size, fontFamily: "var(--font-marker), 'Comic Sans MS', cursive" });

/* ---------- layers (desktop) ---------- */

function WireframeLayer() {
  return (
    <svg viewBox={VB} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <RoughFilter id="rough-a" />
      <g filter="url(#rough-a)">
        {/* browser window */}
        <path className="draw" data-step="1" {...stroke(INK.black)} d="M22 24 Q160 18 298 26 L296 228 Q160 234 24 226 Z" />
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M24 52 Q160 48 296 54" />
        <path className="draw" data-step="1" {...stroke(INK.red, 3)} d="M36 38a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M52 38a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path className="draw" data-step="1" {...stroke(INK.green, 3)} d="M68 38a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        {/* header */}
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M40 68 L72 67 L72 83 L40 84 Z" />
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M196 76 h20 M228 75 h20 M260 76 h22" />
        {/* hero image */}
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M170 96 L282 98 L280 190 L168 188 Z M171 97 L279 189 M281 99 L169 187" />
        {/* copy */}
        <path className="draw" data-step="1" {...stroke(INK.black, 4.5)} d="M40 104 Q90 101 142 104" />
        <path className="draw" data-step="1" {...stroke(INK.black, 3)} d="M40 122 Q80 120 122 123 M40 138 Q75 136 108 139" />
        {/* CTA button */}
        <path className="draw" data-step="1" {...stroke(INK.teal, 3.5)} d="M40 158 Q70 154 104 158 L103 178 Q70 181 41 178 Z" />
      </g>
      <text className="sk-text" data-step="1" x="92" y="262" style={textStyle(INK.black, 22)}>
        your new site
      </text>
    </svg>
  );
}

function FunnelLayer() {
  return (
    <svg viewBox={VB} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <RoughFilter id="rough-b" />
      <g filter="url(#rough-b)">
        {/* arrows: visitors -> funnel */}
        <path className="draw" data-step="2" {...stroke(INK.blue)} d="M304 92 C330 80 346 86 372 98 M362 89 L374 99 L361 106" />
        <path className="draw" data-step="2" {...stroke(INK.blue)} d="M304 140 C330 139 342 142 370 140 M359 132 L372 140 L360 148" />
        <path className="draw" data-step="2" {...stroke(INK.blue)} d="M304 190 C330 202 346 196 372 182 M360 178 L373 181 L365 192" />
        {/* funnel */}
        <path className="draw" data-step="3" {...stroke(INK.blue, 4)} d="M380 70 Q450 64 522 72 L472 160 L472 212 L432 214 L432 160 Z" />
        <path className="draw" data-step="3" {...stroke(INK.blue, 3)} d="M383 73 Q452 94 519 75" />
        <path className="draw" data-step="3" {...stroke(INK.black, 5)} d="M430 104 h1 M456 118 h1 M446 140 h1 M466 98 h1" />
        {/* funnel -> leads */}
        <path className="draw" data-step="4" {...stroke(INK.black)} d="M452 218 C452 252 470 270 500 284 M487 280 L501 285 L494 272" />
        {/* circled "+ Leads" */}
        <path className="draw" data-step="5" {...stroke(INK.red, 3.5)} d="M506 296 C500 268 622 262 624 300 C626 336 510 342 500 306 C497 292 520 280 540 278" />
        {/* scroll flourish: double underline */}
        <path className="draw" data-scroll {...stroke(INK.red, 3)} d="M520 330 Q565 326 610 331 M528 340 Q566 337 600 341" />
      </g>
      <text className="sk-text" data-step="5" x="520" y="312" style={textStyle(INK.green, 30)}>
        + Leads
      </text>
      <text className="sk-text" data-step="3" x="398" y="50" style={textStyle(INK.blue, 18)}>
        visitors
      </text>
    </svg>
  );
}

function FrontLayer() {
  return (
    <svg viewBox={VB} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <RoughFilter id="rough-c" />
      <g filter="url(#rough-c)">
        {/* phone */}
        <path className="draw" data-step="4" {...stroke(INK.black, 4)} d="M52 292 Q90 288 128 292 Q134 294 134 300 L132 472 Q130 480 122 480 L58 480 Q50 478 50 470 L48 300 Q48 293 52 292 Z" />
        <path className="draw" data-step="4" {...stroke(INK.black, 3)} d="M80 304 h20 M86 466 h8" />
        <path className="draw" data-step="4" {...stroke(INK.black, 3)} d="M62 332 h40 M78 352 h42 M62 372 h34" />
        {/* chat bubble */}
        <path className="draw" data-step="4" {...stroke(INK.teal, 3.5)} d="M150 320 Q150 306 166 306 L262 306 Q278 306 278 322 L278 352 Q278 366 262 366 L188 366 L164 386 L170 366 Q150 366 150 350 Z" />
        {/* scroll flourish: check mark */}
        <path className="draw" data-scroll {...stroke(INK.green, 5)} d="M290 324 L302 338 L326 306" />
        {/* bar chart */}
        <path className="draw" data-step="5" {...stroke(INK.black, 3.5)} d="M352 336 L352 480 L560 480" />
        <path className="draw" data-step="5" {...stroke(INK.green, 4)} d="M370 478 L370 446 L394 446 L394 478 M408 478 L408 424 L432 424 L432 478 M446 478 L446 398 L470 398 L470 478 M484 478 L484 360 L508 360 L508 478" />
        <path className="draw" data-step="5" {...stroke(INK.red, 4)} d="M362 438 Q400 422 428 404 T514 340 M498 338 L516 338 L510 356" />
        {/* scroll flourish: star */}
        <path className="draw" data-scroll {...stroke(INK.blue, 3)} d="M548 336 L552 350 L566 350 L555 358 L559 372 L548 364 L537 372 L541 358 L530 350 L544 350 Z" />
      </g>
      <text className="sk-text" data-step="4" x="166" y="344" style={textStyle(INK.teal, 21)}>
        Booked!
      </text>
      <text className="sk-text" data-step="4" x="36" y="510" style={textStyle(INK.black, 18)}>
        AI answers 24/7
      </text>
    </svg>
  );
}

/** Three depth layers; Hero.tsx moves them independently with the mouse. */
export function DesktopSketch() {
  return (
    <div className="sketch-stage relative aspect-[640/520] w-full [transform-style:preserve-3d]">
      <div className="sketch-layer absolute inset-0" data-depth="10">
        <WireframeLayer />
      </div>
      <div className="sketch-layer absolute inset-0" data-depth="22">
        <FunnelLayer />
      </div>
      <div className="sketch-layer absolute inset-0" data-depth="38">
        <FrontLayer />
      </div>
    </div>
  );
}

/** Simpler, static, single layer for phones (no filters, no animation). */
export function MobileSketch() {
  return (
    <svg viewBox="0 0 640 300" className="h-auto w-full" aria-hidden>
      <path {...stroke(INK.black)} d="M22 24 Q130 18 238 26 L236 196 Q130 202 24 194 Z" />
      <path {...stroke(INK.black, 3)} d="M24 52 Q130 48 236 54" />
      <path {...stroke(INK.black, 4.5)} d="M44 86 Q90 83 140 86" />
      <path {...stroke(INK.black, 3)} d="M44 104 Q80 102 120 105" />
      <path {...stroke(INK.teal, 3.5)} d="M44 128 Q74 124 108 128 L107 148 Q74 151 45 148 Z" />
      <path {...stroke(INK.blue)} d="M250 110 C280 100 300 104 322 112 M311 104 L323 112 L311 120" />
      <path {...stroke(INK.blue, 4)} d="M334 40 Q400 34 466 42 L420 122 L420 168 L384 170 L384 122 Z" />
      <path {...stroke(INK.black)} d="M404 174 C404 204 420 222 446 232 M434 228 L447 233 L441 220" />
      <path {...stroke(INK.red, 3.5)} d="M456 244 C450 216 572 210 574 248 C576 284 460 290 450 254" />
      <text x="470" y="260" style={textStyle(INK.green, 30)}>
        + Leads
      </text>
      <path {...stroke(INK.black, 3.5)} d="M500 30 L500 150 L620 150" />
      <path {...stroke(INK.green, 4)} d="M514 148 L514 120 L532 120 L532 148 M546 148 L546 96 L564 96 L564 148 M578 148 L578 66 L596 66 L596 148" />
    </svg>
  );
}
