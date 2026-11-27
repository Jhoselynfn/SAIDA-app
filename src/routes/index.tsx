import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import tilcayo from "@/assets/tilcayo.jpg.asset.json";
import saidaLogo from "@/assets/saida-logo.jpeg.asset.json";
import rioTilcayo from "@/assets/rio-tilcayo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAIDA — Juego sobre mercurio y salud" },
      { name: "description", content: "Navega, come y decide con Tilcayo: aprende a cuidarte del mercurio y conviértete en Agente SAIDA." },
      { property: "og:title", content: "SAIDA" },
      { property: "og:description", content: "Tres juegos para aprender sobre mercurio, pescado seguro y buenas decisiones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Screen = "splash" | "choice" | "register" | "menu" | "navegar" | "comer" | "decide" | "final" | "premios" | "saber" | "consejo" | "quiz";

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
  const [registered, setRegistered] = useState(false);
  const [points, setPoints] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [from, setFrom] = useState<Screen>("menu");

  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(() => setScreen("choice"), 2800);
    return () => clearTimeout(t);
  }, [screen]);

  const finish = (g: string, earned: number) => {
    setPoints((p) => p + (done[g] ? 0 : earned));
    const nd = { ...done, [g]: true };
    setDone(nd);
    setScreen(nd["navegar"] && nd["comer"] && nd["decide"] ? "final" : "menu");
  };
  const saber = () => { setFrom(screen); setScreen("saber"); };

  return (
    <main className="relative isolate mx-auto min-h-screen max-w-md overflow-hidden bg-primary text-primary-foreground shadow-2xl">
      <div className="absolute inset-0" aria-hidden="true">
        <img src={tilcayo.url} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-primary/15" />
      </div>
      <div className="relative z-10">
      {screen === "splash" && <Splash onSkip={() => setScreen("choice")} />}
      {screen === "choice" && <Choice onPrize={() => setScreen("register")} onPlay={() => { setRegistered(false); setScreen("menu"); }} />}
      {screen === "register" && <Register back={() => setScreen("choice")} onEnter={(n) => { setName(n); setRegistered(true); setScreen("menu"); }} />}
      {screen === "menu" && <Menu name={name} registered={registered} points={points} done={done} go={setScreen} />}
      {screen === "navegar" && <Navegar onEnd={(e) => finish("navegar", e)} back={() => setScreen("menu")} />}
      {screen === "comer" && <Comer onEnd={(e) => finish("comer", e)} back={() => setScreen("menu")} />}
      {screen === "decide" && <Decide onEnd={(e) => finish("decide", e)} back={() => setScreen("menu")} saber={saber} />}
      {screen === "final" && <Final points={points} registered={registered} onPrizes={() => setScreen(registered ? "premios" : "register")} onMenu={() => setScreen("menu")} />}
      {screen === "premios" && <Premios name={name} points={points} back={() => setScreen("menu")} />}
      {screen === "saber" && <SaberMas back={() => setScreen(from)} />}
      {screen === "consejo" && <Consejo back={() => setScreen("menu")} />}
      {screen === "quiz" && <Quiz back={() => setScreen("menu")} onPass={() => { setPoints((p) => p + (done["quiz"] ? 0 : 20)); setDone({ ...done, quiz: true }); }} />}
      </div>
    </main>
  );
}

function Splash({ onSkip }: { onSkip: () => void }) {
  return (
    <button onClick={onSkip} className="flex min-h-screen w-full flex-col items-center justify-between px-6 py-8 text-primary-foreground" aria-label="Entrar al juego">
      <img src={saidaLogo.url} alt="Logo SAIDA" className="h-40 w-40 animate-pop rounded-full border-4 border-secondary object-cover object-center shadow-2xl" />
      <div className="w-full animate-pop rounded-[2rem] bg-primary/85 p-5 text-center shadow-2xl backdrop-blur-sm">
        <p className="text-lg font-bold text-secondary">Navega · Come · Decide</p>
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => <span key={i} className="h-3 w-3 animate-bounce rounded-full bg-secondary" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
        <p className="mt-3 text-xs font-bold opacity-80">Toca para comenzar</p>
      </div>
    </button>
  );
}

function Choice({ onPrize, onPlay }: { onPrize: () => void; onPlay: () => void }) {
  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col items-center rounded-3xl bg-primary/80 px-4 py-4 text-center backdrop-blur-sm">
        <p className="text-lg font-bold text-secondary">¿Cómo quieres jugar?</p>
      </div>
      <div className="mt-8 flex flex-1 flex-col justify-center gap-4">
        <button onClick={onPrize} className="btn-game flex flex-col items-center justify-center gap-1 bg-secondary px-6 py-5 text-secondary-foreground">
          <span className="text-5xl">🏆</span>
          <span className="text-xl">Ganar premios</span>
          <span className="text-sm font-normal opacity-80">Regístrate y guarda tus puntos</span>
        </button>
        <button onClick={onPlay} className="btn-game flex flex-col items-center justify-center gap-1 bg-accent px-6 py-5 text-accent-foreground">
          <span className="text-5xl">🎮</span>
          <span className="text-xl">Solo jugar</span>
          <span className="text-sm font-normal opacity-80">Entra directo, sin registro</span>
        </button>
      </div>
    </div>
  );
}

function Register({ onEnter, back }: { onEnter: (n: string) => void; back: () => void }) {
  const [n, setN] = useState("");
  const [c, setC] = useState("");
  return (
    <form className="flex min-h-screen flex-col gap-4 p-6" onSubmit={(e) => { e.preventDefault(); onEnter(n.trim() || "Amigo"); }}>
      <button type="button" onClick={back} className="card-game h-10 w-10 font-bold">←</button>
      <h1 className="text-3xl font-extrabold">Registro 🏆</h1>
      <label className="font-display text-lg font-bold">Tu nombre</label>
      <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Nombre" className="rounded-2xl border-2 border-input bg-card px-4 py-3 text-lg outline-none focus:border-primary" />
      <label className="font-display text-lg font-bold">Tu comunidad</label>
      <input value={c} onChange={(e) => setC(e.target.value)} placeholder="Comunidad" className="rounded-2xl border-2 border-input bg-card px-4 py-3 text-lg outline-none focus:border-primary" />
      <button className="btn-game mt-auto bg-secondary py-3 text-lg text-secondary-foreground">¡Empezar!</button>
    </form>
  );
}

const games = [
  { id: "navegar" as const, title: "NAVEGAR", emoji: "🛶", learn: "Recorre el río y descubre dónde se junta el mercurio", color: "bg-river" },
  { id: "comer" as const, title: "COMER", emoji: "🐟", learn: "Alimenta a Tilcayo con pescado seguro", color: "bg-accent" },
  { id: "decide" as const, title: "DECIDE", emoji: "🤔", learn: "Elige la mejor opción para tu salud", color: "bg-secondary" },
];

function Menu({ name, registered, points, done, go }: { name: string; registered: boolean; points: number; done: Record<string, boolean>; go: (s: Screen) => void }) {
  return (
    <div className="min-h-screen p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => go("consejo")} aria-label="Consejo de Tilcayo"><img src={tilcayo.url} alt="" className="h-12 w-12 animate-bob rounded-full border-2 border-primary object-cover object-top" /></button>
          <div>
            <p className="text-xs font-bold text-primary-foreground/80">{registered ? "Hola," : "Modo"}</p>
            <p className="font-display text-xl font-extrabold">{registered ? name : "Solo jugar"}</p>
          </div>
        </div>
        <div className="card-game px-4 py-2 font-display font-extrabold text-primary">⭐ {points}</div>
      </header>
      <p className="mt-6 font-display text-2xl font-extrabold">Elige un juego</p>
      <div className="mt-5 flex flex-col gap-4">
        {games.map((g) => (
          <button key={g.id} onClick={() => go(g.id)} className="card-game flex items-center gap-3 p-4 text-left transition active:scale-95">
            <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${g.color}`}>{g.emoji}</span>
            <span className="flex-1">
              <span className="block font-display text-xl font-extrabold">{g.title}</span>
              <span className="block text-sm text-muted-foreground">{g.learn}</span>
            </span>
            {done[g.id] && <span className="text-xl">✅</span>}
          </button>
        ))}
      </div>
      <button onClick={() => go("quiz")} className="btn-game mt-5 w-full bg-primary py-3 text-lg text-primary-foreground">🎓 Quiz de certificación {done["quiz"] && "✅"}</button>
      <p className="mt-2 text-center text-xs font-bold text-primary-foreground/90">Toca a Tilcayo para un consejo verificado 💡</p>
      <p className="mt-8 text-center text-[11px] font-bold text-primary-foreground/80">Prototipo · Recomendaciones pendientes de validación por la autoridad sanitaria</p>
    </div>
  );
}

function GameShell({ title, back, children, progress }: { title: string; back: () => void; children: React.ReactNode; progress: number }) {
  return (
    <div className="relative flex min-h-screen flex-col p-5">
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <button onClick={back} className="card-game h-10 w-10 font-bold" aria-label="Volver al menú">✕</button>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <h2 className="mt-4 font-display text-2xl font-extrabold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Bubble({ text, sad = false, big = false }: { text: string; sad?: boolean; big?: boolean }) {
  return (
    <div className="mt-3 flex items-end gap-3">
      <div className="relative shrink-0">
        <img src={tilcayo.url} alt="Tilcayo" className={`${big ? "h-28 w-28" : "h-16 w-16"} rounded-full object-cover object-top transition ${sad ? "grayscale" : "animate-bob"}`} />
        {sad && <span className="absolute -right-1 -top-1 text-3xl">😢</span>}
      </div>
      <div className="card-game relative mb-4 flex-1 rounded-bl-none p-3 text-sm">
        {text}
        <button onClick={() => speak(text)} className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">🔊</button>
      </div>
    </div>
  );
}

function Sheet({ ok, title, text, onNext, saber }: { ok: boolean; title: string; text: string; onNext: () => void; saber?: () => void }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md animate-pop rounded-t-3xl p-5 ${ok ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}>
      <p className="font-display text-xl font-extrabold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
      {saber && <button onClick={saber} className="mt-2 text-sm font-bold underline">📖 SABER MÁS</button>}
      <button onClick={onNext} className="btn-game mt-4 w-full bg-card py-3 text-lg text-foreground">Seguir</button>
    </div>
  );
}

/* NAVEGAR */
const zones = [
  { id: "curiche", label: "Curiche", helper: "Agua detenida", icon: "🌿", x: "79%", y: "29%", high: true },
  { id: "remanso", label: "Remanso", helper: "Agua quieta", icon: "💧", x: "43%", y: "43%", high: true },
  { id: "rapido", label: "Rápido del río", helper: "Agua que corre", icon: "🌊", x: "24%", y: "65%", high: false },
  { id: "barro", label: "Barro del fondo", helper: "Sedimentos", icon: "🟤", x: "73%", y: "76%", high: true },
];

function Navegar({ onEnd, back }: { onEnd: (e: number) => void; back: () => void }) {
  const [started, setStarted] = useState(false);
  const [found, setFound] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; finished: boolean } | null>(null);
  const total = zones.filter((z) => z.high).length;
  const tip = found.length === 0
    ? "Las gotas doradas representan el mercurio. ¡Toca las zonas del paisaje y descubre dónde se acumula!"
    : found.length < total
      ? `¡Llevamos ${found.length} de ${total}! Busca donde el agua descansa o donde hay barro.`
      : "¡Misión cumplida! En esas zonas el mercurio se acumula y puede pasar a los peces.";

  const tap = (z: (typeof zones)[number]) => {
    if (found.includes(z.id)) return;
    if (z.high) {
      const nextFound = [...found, z.id];
      const finished = nextFound.length === total;
      setFound(nextFound);
      setMsg({
        ok: true,
        text: finished
          ? "Encontraste el remanso, el barro y el curiche. ¡Ganaste 30 puntos y 3 gotas de sabiduría!"
          : `${z.label}: aquí el mercurio se asienta poco a poco y puede pasar a los peces.`,
        finished,
      });
    } else {
      setMsg({ ok: false, text: "Aquí la corriente arrastra el mercurio. Busca mejor donde el agua está quieta o hay barro.", finished: false });
    }
  };

  return (
    <GameShell title="🛶 NAVEGAR · El río" back={back} progress={found.length / total}>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary px-3 py-1 font-display text-xs font-extrabold text-primary-foreground">🎯 MISIÓN: 3 ZONAS</span>
        <span className="rounded-full bg-secondary px-3 py-1 font-display text-sm font-extrabold text-secondary-foreground">💧 {found.length}/{total}</span>
      </div>
      <Bubble text={tip} />
      <div className="relative mt-3 h-[430px] overflow-hidden rounded-[2rem] border-4 border-secondary shadow-river">
        <img src={rioTilcayo.url} alt="Vista satelital real del río y sus meandros" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/10" />
        <svg viewBox="0 0 400 440" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="var(--secondary)" stroke="var(--secondary-foreground)" strokeWidth="1.5" className="mercury-drops">
            <circle r="7"><animateMotion dur="8s" repeatCount="indefinite" path="M340 30C390 100 300 130 315 170S260 200 230 170 190 220 150 230 100 300 30 390" /></circle>
            <circle r="6"><animateMotion dur="8s" begin="-2.7s" repeatCount="indefinite" path="M340 30C390 100 300 130 315 170S260 200 230 170 190 220 150 230 100 300 30 390" /></circle>
            <circle r="5"><animateMotion dur="8s" begin="-5.4s" repeatCount="indefinite" path="M340 30C390 100 300 130 315 170S260 200 230 170 190 220 150 230 100 300 30 390" /></circle>
          </g>
          <text x="185" y="210" fontSize="48" className="canoe-bob">🛶</text>
        </svg>
        <span className="absolute right-2 top-2 rounded-full bg-card px-3 py-1 text-xs font-extrabold text-card-foreground shadow-md">⛏️ MINA · aquí empieza</span>

        {zones.map((z) => {
          const isFound = found.includes(z.id);
          return (
            <button
              key={z.id}
              aria-label={`Explorar ${z.label}`}
              disabled={!started || msg !== null}
              onClick={() => tap(z)}
              style={{ left: z.x, top: z.y }}
              className={`river-zone absolute w-32 -translate-x-1/2 -translate-y-1/2 px-2 py-2 text-left ${isFound ? "river-zone-found" : ""}`}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-2xl">{isFound ? "⚠️" : z.icon}</span>
                <span className="font-display text-sm font-extrabold leading-none">{z.label}</span>
              </span>
              <span className="mt-1 block text-[10px] font-bold opacity-80">{isFound ? "¡Mercurio encontrado!" : z.helper}</span>
              {!isFound && <span className="river-zone-hint">TOCA</span>}
            </button>
          );
        })}

        {!started && (
          <div className="absolute inset-0 flex items-end bg-primary/45 p-3" role="dialog" aria-label="Cómo jugar Navegar">
            <div className="card-game w-full animate-pop p-4 text-center">
              <p className="font-display text-2xl font-extrabold text-primary">Tu misión 🔎</p>
              <p className="mt-1 text-sm font-bold">Encuentra las 3 zonas donde se acumula el mercurio.</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
                <span className="rounded-xl bg-muted p-2">👆<br />Toca una zona</span>
                <span className="rounded-xl bg-muted p-2">⚠️<br />Descubre por qué</span>
                <span className="rounded-xl bg-muted p-2">💧<br />Gana 30 puntos</span>
              </div>
              <button onClick={() => setStarted(true)} className="btn-game mt-4 w-full bg-secondary py-3 text-lg text-secondary-foreground">¡A navegar! 🛶</button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-xs font-bold text-primary-foreground/90">Las zonas correctas se iluminan y ganan una señal de mercurio ⚠️</p>
      {msg && (
        <Sheet
          ok={msg.ok}
          title={msg.finished ? "¡Misión cumplida! 🎉" : msg.ok ? "¡Zona encontrada! +10 💧" : "¡Sigue buscando! 🌊"}
          text={msg.text}
          onNext={() => { const finished = msg.finished; setMsg(null); if (finished) onEnd(30); }}
        />
      )}
    </GameShell>
  );
}

/* COMER */
const fishes = [
  { name: "Sábalo", emoji: "🐟", hg: false },
  { name: "Pacú", emoji: "🐠", hg: false },
  { name: "Bogo", emoji: "🐟", hg: false },
  { name: "Dorado", emoji: "🐡", hg: true },
];
const MEALS = 6;

function Comer({ onEnd, back }: { onEnd: (e: number) => void; back: () => void }) {
  const [meals, setMeals] = useState(0);
  const [bad, setBad] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const sad = bad >= 3;
  const finished = meals >= MEALS || sad;
  const text = sad
    ? "No me siento bien… porque el dorado es mejor comerlo pocas veces a la semana para estar más sano. Prefiere sábalo, pacú o bogo."
    : last === "Dorado" ? `Mmm… dorado otra vez. Es un pez grande que caza y junta mucho mercurio. (${bad}/3)`
    : last ? `¡Rico ${last}! Los peces que comen plantas tienen poco mercurio.`
    : "¡Tengo hambre! Dame de comer pescado. ¿Cuál me das?";
  const feed = (f: (typeof fishes)[number]) => {
    if (finished) return;
    setMeals((m) => m + 1); setLast(f.name);
    if (f.hg) setBad((b) => b + 1);
  };
  return (
    <GameShell title="🐟 COMER · Alimenta a Tilcayo" back={back} progress={Math.min(meals / MEALS, 1)}>
      <div className="card-game mt-4 flex flex-col items-center p-4">
        <Bubble text={text} sad={sad} big />
        <p className="mt-2 text-sm font-bold text-muted-foreground">Comidas: {meals}/{MEALS}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 pb-48">
        {fishes.map((f) => (
          <button key={f.name} disabled={finished} onClick={() => feed(f)} className="card-game flex flex-col items-center p-4 transition active:scale-90 disabled:opacity-50">
            <span className="text-5xl">{f.emoji}</span>
            <span className="mt-1 font-display text-lg font-extrabold">{f.name}</span>
          </button>
        ))}
      </div>
      {finished && (
        <Sheet ok={!sad} title={sad ? "Tilcayo está triste 😢" : "¡Tilcayo está sano y feliz! ⭐"}
          text={sad ? "El dorado tiene más mercurio. Cómelo pocas veces a la semana y en porciones chicas." : "Elegiste peces con poco mercurio. ¡No dejes el pescado, solo elige bien!"}
          onNext={() => onEnd(sad ? 10 : 30)} />
      )}
    </GameShell>
  );
}

/* DECIDE */
const decisions = [
  { good: { emoji: "🦷✨", label: "Diente con empaste (resina)" }, bad: { emoji: "🦷⚫", label: "Diente con amalgama" },
    okText: "¡Muy bien! Las amalgamas contienen mercurio y es mejor usar empastes, pero lo mejor es cuidar nuestros dientes.",
    badText: "¡ALERTA! Las amalgamas contienen mercurio. Es mejor el empaste, pero especialmente es mejor prevenir las caries." },
  { good: { emoji: "🧤🧼", label: "Lavarse las manos lejos de la mina" }, bad: { emoji: "✋💧", label: "Tocar el mercurio con las manos" },
    okText: "¡Muy bien! El mercurio no se debe tocar ni calentar. Lava tus manos y aléjate de la quema de amalgama.",
    badText: "¡ALERTA! Tocar o respirar mercurio es peligroso. Nunca lo manipules sin protección." },
  { good: { emoji: "🐟", label: "Pez pequeño que come plantas" }, bad: { emoji: "🐡", label: "Pez grande cazador todos los días" },
    okText: "¡Muy bien! Los peces pequeños tienen menos mercurio.",
    badText: "¡ALERTA! Los peces grandes que cazan juntan más mercurio. Cómelos pocas veces." },
];

function Decide({ onEnd, back, saber }: { onEnd: (e: number) => void; back: () => void; saber: () => void }) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [flip] = useState(() => decisions.map((_, k) => k % 2 === 1));
  const d = decisions[i]!;
  const opts = flip[i] ? [d.bad, d.good] : [d.good, d.bad];
  const choose = (o: typeof d.good) => { const ok = o === d.good; setRes(ok); if (ok) setScore((s) => s + 1); };
  const next = () => {
    if (i + 1 >= decisions.length) return onEnd(Math.round((score / decisions.length) * 40));
    setI(i + 1); setRes(null);
  };
  return (
    <GameShell title="🤔 DECIDE · ¿Qué es mejor?" back={back} progress={(i + (res !== null ? 1 : 0)) / decisions.length}>
      <Bubble text="¿Cuál es mejor? Toca la tarjeta correcta." />
      <div className="mt-4 grid grid-cols-2 gap-3 pb-56">
        {opts.map((o) => (
          <button key={o.label} disabled={res !== null} onClick={() => choose(o)} className="card-game flex aspect-[3/4] flex-col items-center justify-center gap-3 p-3 text-center transition active:scale-95">
            <span className="text-6xl">{o.emoji}</span>
            <span className="font-display font-bold">{o.label}</span>
          </button>
        ))}
      </div>
      {res !== null && <Sheet ok={res} title={res ? "¡Muy bien! ⭐" : "⚠️ ¡ALERTA!"} text={res ? d.okText : d.badText} onNext={next} saber={saber} />}
    </GameShell>
  );
}

function SaberMas({ back }: { back: () => void }) {
  return (
    <div className="min-h-screen p-5">
      <button onClick={back} className="card-game h-10 w-10 font-bold">←</button>
      <h1 className="mt-4 text-3xl font-extrabold">📖 Saber más</h1>
      {[
        ["¿Qué es el mercurio?", "Es un metal tóxico usado en la minería de oro. Llega al río, se transforma en metilmercurio y se acumula en los peces."],
        ["Amalgamas dentales", "Las amalgamas (empastes plateados) tienen mercurio. Hoy existen empastes de resina. Lo mejor: cepillarse y prevenir caries."],
        ["Pescado seguro", "Prefiere peces pequeños que comen plantas (sábalo, pacú, bogo). Los grandes cazadores (dorado, surubí) cómelos pocas veces."],
        ["Señales de alerta", "Hormigueo, temblores o cansancio pueden ser señales. Acude a la posta de salud."],
      ].map(([t, x]) => (
        <div key={t} className="card-game mt-4 p-4"><p className="font-display text-lg font-extrabold">{t}</p><p className="text-sm">{x}</p></div>
      ))}
    </div>
  );
}

function Badge() {
  return (
    <div className="relative mx-auto flex h-40 w-40 animate-pop items-center justify-center rounded-full border-8 border-secondary bg-primary">
      <img src={tilcayo.url} alt="" className="h-28 w-28 rounded-full object-cover object-top" />
      <span className="absolute -bottom-3 rounded-full bg-secondary px-3 py-1 font-display text-sm font-extrabold text-secondary-foreground">AGENTE SAIDA</span>
    </div>
  );
}

function Final({ points, registered, onPrizes, onMenu }: { points: number; registered: boolean; onPrizes: () => void; onMenu: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-primary-foreground">
      <Badge />
      <p className="mt-8 font-display text-3xl font-extrabold text-secondary">¡ERES UN AGENTE SAIDA!</p>
      <p className="mt-2 font-display text-2xl font-extrabold">Y TIENES {points} PUNTOS</p>
      <p className="mt-6 text-lg">¿Quieres ver tus premios?</p>
      {!registered && <p className="text-xs opacity-80">Regístrate para guardarlos</p>}
      <button onClick={onPrizes} className="btn-game mt-4 w-full bg-secondary py-3 text-lg text-secondary-foreground">🏆 Ver mis premios</button>
      <button onClick={onMenu} className="mt-4 text-sm underline">Volver a jugar</button>
    </div>
  );
}

function Premios({ name, points, back }: { name: string; points: number; back: () => void }) {
  const prizes = [
    { e: "🛶", t: "Navegante del río", need: 30 },
    { e: "🐟", t: "Experto en pescado", need: 60 },
    { e: "🦷", t: "Sonrisa sana", need: 80 },
    { e: "🛡️", t: "Agente SAIDA", need: 100 },
  ];
  return (
    <div className="min-h-screen p-5">
      <button onClick={back} className="card-game h-10 w-10 font-bold">←</button>
      <div className="mt-4"><Badge /></div>
      <p className="mt-6 text-center font-display text-2xl font-extrabold">{name}</p>
      <p className="text-center font-bold text-secondary">⭐ {points} puntos</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {prizes.map((p) => {
          const ok = points >= p.need;
          return (
            <div key={p.t} className={`card-game flex flex-col items-center p-4 text-center ${ok ? "" : "opacity-40 grayscale"}`}>
              <span className="text-5xl">{ok ? p.e : "🔒"}</span>
              <span className="mt-1 font-display font-extrabold">{p.t}</span>
              <span className="text-xs text-muted-foreground">{p.need} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const consejos = [
  "Prefiere peces pequeños que comen plantas, como sábalo, pacú o bogo. Los grandes cazadores, cómelos pocas veces.",
  "Nunca toques ni calientes el mercurio. Lávate las manos y aléjate de donde queman amalgama.",
  "Las mujeres embarazadas y los niños deben cuidarse más del mercurio en el pescado.",
  "Cepíllate los dientes para prevenir caries. Así no necesitarás amalgamas con mercurio.",
  "Si sientes hormigueo, temblores o mucho cansancio, acude a la posta de salud.",
];

function Consejo({ back }: { back: () => void }) {
  const [i, setI] = useState(() => 0);
  const t = consejos[i]!;
  return (
    <div className="flex min-h-screen flex-col items-center p-6 text-center">
      <button onClick={back} className="card-game h-10 w-10 self-start font-bold">←</button>
      <img src={tilcayo.url} alt="Tilcayo" className="mt-4 h-40 w-40 animate-bob rounded-full border-4 border-secondary object-cover object-top" />
      <span className="mt-4 rounded-full bg-accent px-4 py-1 font-display text-sm font-extrabold text-accent-foreground">✔️ CONSEJO VERIFICADO</span>
      <div className="card-game mt-4 p-5 text-lg">{t}</div>
      <p className="mt-2 text-[11px] font-bold text-primary-foreground/80">Fuente: Guía ORO 3.1 · pendiente de validación sanitaria</p>
      <button onClick={() => speak(t)} className="btn-game mt-6 w-full bg-primary py-3 text-lg text-primary-foreground">🔊 Escuchar</button>
      <button onClick={() => setI((i + 1) % consejos.length)} className="btn-game mt-3 w-full bg-secondary py-3 text-lg text-secondary-foreground">Otro consejo 💡</button>
    </div>
  );
}

const quiz = [
  { q: "¿Dónde se junta más el mercurio en el río?", o: ["Agua que corre rápido", "Agua quieta y barro del fondo"], a: 1 },
  { q: "¿Qué pescado es más seguro comer seguido?", o: ["Sábalo", "Dorado"], a: 0 },
  { q: "¿Qué empaste no tiene mercurio?", o: ["Resina", "Amalgama"], a: 0 },
  { q: "¿Se puede tocar el mercurio con las manos?", o: ["Sí, no pasa nada", "No, es peligroso"], a: 1 },
  { q: "Si tienes temblores u hormigueo, ¿qué haces?", o: ["Ir a la posta de salud", "Esperar"], a: 0 },
];

function Quiz({ back, onPass }: { back: () => void; onPass: () => void }) {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  const [end, setEnd] = useState(false);
  const pass = ok >= 4;
  const answer = (k: number) => {
    const n = ok + (k === quiz[i]!.a ? 1 : 0);
    setOk(n);
    if (i + 1 >= quiz.length) { setEnd(true); if (n >= 4) onPass(); } else setI(i + 1);
  };
  if (end) return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-primary-foreground">
      {pass ? <Badge /> : <span className="text-7xl">😿</span>}
      <p className="mt-8 font-display text-3xl font-extrabold">{pass ? "¡CERTIFICACIÓN APROBADA! 🎓" : "Casi lo logras"}</p>
      <p className="mt-2 text-lg">Respuestas correctas: {ok}/{quiz.length}</p>
      {pass && <p className="mt-1 font-bold text-secondary">+20 puntos ⭐ · Agente SAIDA certificado</p>}
      {!pass && <button onClick={() => { setI(0); setOk(0); setEnd(false); }} className="btn-game mt-6 w-full bg-secondary py-3 text-lg text-secondary-foreground">Intentar otra vez</button>}
      <button onClick={back} className="mt-4 text-sm underline">Volver al menú</button>
    </div>
  );
  const q = quiz[i]!;
  return (
    <GameShell title="🎓 Quiz de certificación" back={back} progress={i / quiz.length}>
      <Bubble text={q.q} />
      <div className="mt-6 flex flex-col gap-4">
        {q.o.map((o, k) => <button key={o} onClick={() => answer(k)} className="card-game p-5 font-display text-xl font-bold active:scale-95">{o}</button>)}
      </div>
      <p className="mt-4 text-center text-sm font-bold text-primary-foreground/90">Pregunta {i + 1}/{quiz.length} · Necesitas 4 para aprobar</p>
    </GameShell>
  );
}
