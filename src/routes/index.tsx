import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import tilcayo from "@/assets/tilcayo.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tilcayo y el Río — Juego sobre mercurio y pescado seguro" },
      { name: "description", content: "Simulación del juego: aprende con Tilcayo qué pescados comer seguido y cómo cuidar a tu familia del mercurio." },
      { property: "og:title", content: "Tilcayo y el Río" },
      { property: "og:description", content: "Juego para comunidades ribereñas: el río, los peces y la familia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Screen = "splash" | "login" | "map" | "w1" | "w2" | "w3";
const APP = "Tilcayo y el Río";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  window.speechSynthesis.speak(u);
}

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [drops, setDrops] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(() => setScreen("login"), 2800);
    return () => clearTimeout(t);
  }, [screen]);

  const finish = (w: string, earned: number) => {
    setDrops((d) => d + earned);
    setDone((x) => ({ ...x, [w]: true }));
    setScreen("map");
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-background">
      {screen === "splash" && <Splash onSkip={() => setScreen("login")} />}
      {screen === "login" && <Login onEnter={(n) => { setName(n); setScreen("map"); }} />}
      {screen === "map" && <WorldMap name={name} drops={drops} done={done} go={setScreen} />}
      {screen === "w1" && <World1 onEnd={(e) => finish("w1", e)} back={() => setScreen("map")} />}
      {screen === "w2" && <World2 onEnd={(e) => finish("w2", e)} back={() => setScreen("map")} />}
      {screen === "w3" && <World3 onEnd={(e) => finish("w3", e)} back={() => setScreen("map")} />}
    </main>
  );
}

function Splash({ onSkip }: { onSkip: () => void }) {
  return (
    <button onClick={onSkip} className="flex min-h-screen w-full flex-col items-center justify-center bg-primary px-6 text-primary-foreground">
      <div className="animate-pop">
        <img src={tilcayo.url} alt="Tilcayo, el gatito del monte" className="h-72 w-auto animate-bob object-contain" />
      </div>
      <h1 className="mt-4 animate-pop text-5xl font-extrabold leading-none text-secondary">{APP}</h1>
      <p className="mt-3 text-sm opacity-80">El río · Los peces · Mi familia</p>
      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-3 w-3 animate-bounce rounded-full bg-secondary" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </button>
  );
}

function Login({ onEnter }: { onEnter: (n: string) => void }) {
  const [n, setN] = useState("");
  const [lang, setLang] = useState("Castellano");
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center rounded-b-[3rem] bg-primary px-6 pb-8 pt-10 text-primary-foreground">
        <img src={tilcayo.url} alt="" className="h-32 w-32 rounded-full border-4 border-secondary object-cover object-top" />
        <h1 className="mt-3 text-3xl font-extrabold text-secondary">{APP}</h1>
        <p className="text-sm opacity-80">¡Hola! Soy Tilcayo, tu guía.</p>
      </div>
      <form className="flex flex-1 flex-col gap-4 p-6" onSubmit={(e) => { e.preventDefault(); onEnter(n.trim() || "Amigo"); }}>
        <label className="font-display text-lg font-bold">¿Cómo te llamas?</label>
        <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Tu nombre" className="rounded-2xl border-2 border-input bg-card px-4 py-3 text-lg outline-none focus:border-primary" />
        <label className="font-display text-lg font-bold">Idioma</label>
        <div className="grid grid-cols-2 gap-2">
          {["Castellano", "Tsimane'", "Tacana", "Ese Ejja"].map((l) => (
            <button type="button" key={l} onClick={() => setLang(l)} className={`rounded-2xl border-2 px-3 py-3 font-bold ${lang === l ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}>{l}</button>
          ))}
        </div>
        <button className="btn-game mt-auto bg-secondary py-4 text-xl text-secondary-foreground">¡A jugar!</button>
        <p className="text-center text-xs text-muted-foreground">Funciona sin internet · Audio en lengua local (simulación)</p>
      </form>
    </div>
  );
}

const worlds = [
  { id: "w1" as const, n: 1, title: "El Río", emoji: "🌊", learn: "Dónde se junta el mercurio", color: "bg-river" },
  { id: "w2" as const, n: 2, title: "Los Peces", emoji: "🐟", learn: "Qué pescado comer y cada cuánto", color: "bg-accent" },
  { id: "w3" as const, n: 3, title: "Mi Familia", emoji: "🏡", learn: "Cuidar a embarazadas y niños", color: "bg-secondary" },
];

function WorldMap({ name, drops, done, go }: { name: string; drops: number; done: Record<string, boolean>; go: (s: Screen) => void }) {
  return (
    <div className="min-h-screen p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={tilcayo.url} alt="" className="h-12 w-12 rounded-full border-2 border-primary object-cover object-top" />
          <div>
            <p className="text-xs text-muted-foreground">Hola,</p>
            <p className="font-display text-xl font-extrabold">{name}</p>
          </div>
        </div>
        <div className="card-game px-4 py-2 font-display font-extrabold text-primary">💧 {drops}</div>
      </header>
      <p className="mt-6 font-display text-2xl font-extrabold">Elige un mundo</p>
      <p className="text-sm text-muted-foreground">Gana gotas de sabiduría 💧</p>
      <div className="relative mt-5 flex flex-col gap-5">
        {worlds.map((w, i) => {
          const locked = i > 0 && !done[worlds[i - 1]!.id];
          return (
            <button key={w.id} disabled={locked} onClick={() => go(w.id)} className={`card-game flex items-center gap-4 p-4 text-left transition ${locked ? "opacity-50" : "active:scale-95"} ${i % 2 ? "ml-8" : "mr-8"}`}>
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${w.color}`}>{locked ? "🔒" : w.emoji}</span>
              <span className="flex-1">
                <span className="block text-xs font-bold text-muted-foreground">MUNDO {w.n}</span>
                <span className="block font-display text-xl font-extrabold">{w.title}</span>
                <span className="block text-sm text-muted-foreground">{w.learn}</span>
              </span>
              {done[w.id] && <span className="text-2xl">⭐</span>}
            </button>
          );
        })}
      </div>
      {done["w3"] && (
        <div className="card-game mt-6 animate-pop bg-primary p-5 text-center text-primary-foreground">
          <p className="font-display text-2xl font-extrabold text-secondary">¡Eres Guardián del Río!</p>
          <p className="text-sm">Comparte lo aprendido con tu comunidad.</p>
        </div>
      )}
      <p className="mt-8 text-center text-[11px] text-muted-foreground">Prototipo · Recomendaciones pendientes de validación por la autoridad sanitaria</p>
    </div>
  );
}

function GameShell({ title, back, children, progress }: { title: string; back: () => void; children: React.ReactNode; progress: number }) {
  return (
    <div className="flex min-h-screen flex-col p-5">
      <div className="flex items-center gap-3">
        <button onClick={back} className="card-game h-10 w-10 font-bold">✕</button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold">{title}</h2>
      {children}
    </div>
  );
}

function Tilcayo({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-start gap-3">
      <img src={tilcayo.url} alt="Tilcayo" className="h-14 w-14 shrink-0 rounded-full object-cover object-top" />
      <div className="card-game relative flex-1 p-3 text-sm">
        {text}
        <button onClick={() => speak(text)} className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">🔊 Escuchar</button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, onNext }: { ok: boolean; text: string; onNext: () => void }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 mx-auto max-w-md animate-pop rounded-t-3xl p-5 ${ok ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}>
      <p className="font-display text-xl font-extrabold">{ok ? "¡Muy bien! +1 💧" : "¡Casi!"}</p>
      <p className="mt-1 text-sm">{text}</p>
      <button onClick={onNext} className="btn-game mt-4 w-full bg-card py-3 text-lg text-foreground">Seguir</button>
    </div>
  );
}

function Quiz<T extends { q: string; options: string[]; correct: number; tip: string; art: string }>({ items, title, intro, back, onEnd }: { items: T[]; title: string; intro: string; back: () => void; onEnd: (e: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const item = items[i]!;
  const next = () => {
    if (i + 1 >= items.length) return onEnd(score);
    setI(i + 1); setPick(null);
  };
  return (
    <GameShell title={title} back={back} progress={(i + (pick !== null ? 1 : 0)) / items.length}>
      {i === 0 && pick === null && <Tilcayo text={intro} />}
      <div className="card-game mt-5 flex h-36 items-center justify-center text-7xl">{item.art}</div>
      <p className="mt-5 font-display text-xl font-bold">{item.q}</p>
      <div className="mt-3 flex flex-col gap-3 pb-48">
        {item.options.map((o, k) => (
          <button key={o} disabled={pick !== null} onClick={() => { setPick(k); if (k === item.correct) setScore((s) => s + 1); }}
            className={`rounded-2xl border-2 p-4 text-left font-bold transition ${pick === null ? "border-input bg-card active:scale-95" : k === item.correct ? "border-accent bg-accent text-accent-foreground" : k === pick ? "border-destructive bg-card" : "border-input bg-card opacity-50"}`}>
            {o}
          </button>
        ))}
      </div>
      {pick !== null && <Feedback ok={pick === item.correct} text={item.tip} onNext={next} />}
    </GameShell>
  );
}

const zones = [
  { id: "a", label: "Agua que corre rápido", x: "15%", y: "18%", high: false },
  { id: "b", label: "Remanso / agua quieta", x: "60%", y: "40%", high: true },
  { id: "c", label: "Barro del fondo (sedimento)", x: "25%", y: "62%", high: true },
  { id: "d", label: "Lago o curiche", x: "68%", y: "80%", high: true },
];

function World1({ onEnd, back }: { onEnd: (e: number) => void; back: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const total = zones.filter((z) => z.high).length;
  const tap = (z: (typeof zones)[number]) => {
    if (found.includes(z.id)) return;
    if (z.high) { setFound([...found, z.id]); setMsg({ ok: true, text: `${z.label}: aquí el mercurio se asienta y se transforma en metilmercurio, que pasa a los peces.` }); }
    else setMsg({ ok: false, text: "En el agua que corre rápido el mercurio no se queda tanto. Busca donde el agua descansa." });
  };
  return (
    <GameShell title="Mundo 1 · El Río" back={back} progress={found.length / total}>
      <Tilcayo text="El mercurio baja desde las minas con el agua. ¡Toca las zonas del río donde se junta más!" />
      <div className="relative mt-5 h-96 overflow-hidden rounded-3xl bg-accent">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M10 0 C 40 20, 70 25, 55 45 S 15 60, 30 75 S 75 85, 70 100 L 90 100 C 95 85, 55 80, 50 75 S 85 55, 75 45 S 40 15, 30 0 Z" className="fill-river" />
        </svg>
        <span className="absolute left-2 top-2 rounded-full bg-card px-2 py-1 text-xs font-bold">⛏️ Mina</span>
        {zones.map((z) => (
          <button key={z.id} onClick={() => tap(z)} style={{ left: z.x, top: z.y }}
            className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 text-2xl ${found.includes(z.id) ? "border-secondary bg-destructive" : "animate-pulse border-card bg-card/40"}`}>
            {found.includes(z.id) ? "⚠️" : "?"}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center font-bold">Encontradas: {found.length} / {total}</p>
      {msg && <Feedback ok={msg.ok} text={msg.text} onNext={() => { setMsg(null); if (found.length >= total) onEnd(found.length + 1); }} />}
    </GameShell>
  );
}

const fish = [
  { q: "Sábalo: pez que come plantas y barro. ¿Cada cuánto se puede comer?", art: "🐟", options: ["Seguido, varias veces por semana", "Casi nunca"], correct: 0, tip: "Los peces que comen plantas (sábalo, bogo, pacú) acumulan poco mercurio. ¡Son buena comida!" },
  { q: "Dorado: pez grande que come otros peces. ¿Cada cuánto?", art: "🐠", options: ["Todos los días", "De vez en cuando, en porciones chicas"], correct: 1, tip: "Los peces grandes cazadores juntan el mercurio de todos los peces que comen." },
  { q: "Bogo: pez pequeño. ¿Es buena opción para la familia?", art: "🐟", options: ["Sí, buena opción", "No, hay que dejar de comer pescado"], correct: 0, tip: "¡No dejes el pescado! Da proteína y es nuestra comida. Solo elige bien cuál." },
  { q: "Pintado / surubí grande. ¿Cocinarlo bien quita el mercurio?", art: "🐡", options: ["Sí, al cocinar se va", "No, el mercurio se queda"], correct: 1, tip: "Cocinar, ahumar o secar NO quita el mercurio. Secar el pescado incluso lo concentra." },
];

function World2({ onEnd, back }: { onEnd: (e: number) => void; back: () => void }) {
  return <Quiz items={fish} title="Mundo 2 · Los Peces" intro="Hay peces que comen plantas y peces que cazan. ¡Ayúdame a elegir la comida saludable!" back={back} onEnd={onEnd} />;
}

const family = [
  { q: "Rosa está embarazada. ¿Qué haría Tilcayo para su almuerzo?", art: "🤰", options: ["Sábalo o pacú", "Un dorado grande"], correct: 0, tip: "Embarazadas y bebés son los más sensibles. Mejor peces pequeños que comen plantas." },
  { q: "El hijo de 3 años quiere pescado. ¿Qué le damos?", art: "🧒", options: ["Porción chica de pez pequeño", "Nada de pescado nunca"], correct: 0, tip: "Los niños necesitan pescado para crecer. Elige peces pequeños y porciones de su tamaño." },
  { q: "Don Juan siente hormigueo en manos y le tiemblan los dedos. ¿Qué hace?", art: "🧓", options: ["Ignorarlo", "Ir a la posta de salud"], correct: 1, tip: "Hormigueo, temblores o cansancio pueden ser señales tempranas. La posta puede orientarte." },
  { q: "Hay pescado seco guardado de la crecida. ¿Qué haría Tilcayo?", art: "🐟", options: ["Comer seco de peces chicos y mezclar con otros alimentos", "Comer seco de pez grande todos los días"], correct: 0, tip: "Al secar, el mercurio se concentra. Prefiere peces chicos y combina con huevo, frutas y yuca." },
];

function World3({ onEnd, back }: { onEnd: (e: number) => void; back: () => void }) {
  return <Quiz items={family} title="Mundo 3 · Mi Familia" intro="En casa cuidamos a los más pequeños. ¿Qué haría Tilcayo?" back={back} onEnd={onEnd} />;
}
