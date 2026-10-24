import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookingProvider, SERVICES, useBooking, serviceLabel, type ServiceKey, type Appointment } from "@/lib/booking-store";

export const Route = createFileRoute("/prenota")({
  head: () => ({
    meta: [
      { title: "Prenota una visita — Studio Dentistico Marino" },
      { name: "description", content: "Prenota online la tua visita presso lo Studio Dentistico Marino a Milano. Scegli servizio, data e orario in pochi passaggi." },
      { property: "og:title", content: "Prenota una visita — Studio Marino" },
      { property: "og:description", content: "Prenotazione online semplice e veloce." },
    ],
  }),
  component: () => (
    <BookingProvider>
      <PrenotaPage />
    </BookingProvider>
  ),
});

const STEPS = ["Servizio", "Data e ora", "I tuoi dati", "Conferma"] as const;

function PrenotaPage() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", notes: "", consent: false });
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const { add } = useBooking();
  const reduce = useReducedMotion();

  const canNext =
    (step === 0 && !!service) ||
    (step === 1 && !!date && !!time) ||
    (step === 2 && !!form.firstName && !!form.lastName && !!form.phone && !!form.email && form.consent);

  function submit() {
    if (!service || !date || !time) return;
    const appt = add({
      service, date, time,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim() || undefined,
    });
    setConfirmed(appt);
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted-foreground w-fit">
            <Sparkles size={12} className="text-primary" />
            Prototipo dimostrativo — i dati vengono salvati solo nella sessione del browser.
          </div>

          <div className="mb-2 text-xs uppercase tracking-[0.24em] text-primary">Prenotazione</div>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            {confirmed ? "Grazie, a presto." : "Fissiamo il tuo appuntamento."}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {confirmed
              ? "Abbiamo ricevuto la tua richiesta. Ti ricontatteremo per la conferma definitiva."
              : "Bastano pochi passaggi. Puoi tornare indietro in qualsiasi momento."}
          </p>

          {!confirmed && <Stepper step={step} />}

          <div className="mt-10 rounded-3xl border border-border bg-surface p-6 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && <StepService value={service} onChange={setService} />}
                {step === 1 && <StepDateTime service={service!} date={date} time={time} onChangeDate={setDate} onChangeTime={setTime} />}
                {step === 2 && <StepForm form={form} setForm={setForm} />}
                {step === 3 && confirmed && <StepDone appt={confirmed} />}
              </motion.div>
            </AnimatePresence>

            {!confirmed && (
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-primary disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Indietro
                </button>
                {step < 2 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    Continua <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    Conferma prenotazione <Check size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {!confirmed && (service || date || time) && (
            <Summary service={service} date={date} time={time} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mt-10 grid grid-cols-4 gap-2">
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <li key={label} className="flex flex-col gap-2">
            <div className={`h-1 rounded-full transition-colors duration-500 ${done || active ? "bg-primary" : "bg-border"}`} />
            <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.65rem] transition-colors ${done ? "bg-primary text-primary-foreground" : active ? "bg-ink text-background" : "bg-border text-muted-foreground"}`}>
                {done ? <Check size={10} /> : i + 1}
              </span>
              <span className={active || done ? "text-ink" : "text-muted-foreground"}>{label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepService({ value, onChange }: { value: ServiceKey | null; onChange: (v: ServiceKey) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Che tipo di visita desideri?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Se non sei sicuro, scegli "Prima visita e check-up".</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {SERVICES.map((s) => {
          const active = value === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onChange(s.key)}
              className={`text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                active ? "border-primary bg-accent/40 shadow-sm" : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-serif text-lg text-ink">{s.label}</div>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {active && <Check size={12} />}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-primary"><Clock size={12} /> {s.duration}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function nextBusinessDays(count: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    if (d.getDay() !== 0) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const SLOTS = ["09:00", "09:45", "10:30", "11:15", "12:00", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15"];

function StepDateTime({ service, date, time, onChangeDate, onChangeTime }: {
  service: ServiceKey; date: string | null; time: string | null;
  onChangeDate: (d: string) => void; onChangeTime: (t: string) => void;
}) {
  const days = useMemo(() => nextBusinessDays(10), []);
  const fmtIso = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Quando ti va bene?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Per <span className="text-primary">{serviceLabel(service)}</span>. Gli slot sono indicativi e vengono confermati dalla segreteria.
      </p>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <CalendarIcon size={14} /> Data
        </div>
        <div className="flex snap-x gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {days.map((d) => {
            const iso = fmtIso(d);
            const active = date === iso;
            return (
              <button
                key={iso}
                onClick={() => onChangeDate(iso)}
                className={`snap-start shrink-0 rounded-2xl border px-4 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className={`text-[0.65rem] uppercase tracking-wider ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {d.toLocaleDateString("it-IT", { weekday: "short" })}
                </div>
                <div className="mt-1 font-serif text-2xl leading-none">{d.getDate()}</div>
                <div className={`mt-1 text-[0.65rem] uppercase ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {d.toLocaleDateString("it-IT", { month: "short" })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Clock size={14} /> Orario
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {SLOTS.map((t) => {
            const active = time === t;
            const disabled = !date;
            return (
              <button
                key={t}
                onClick={() => onChangeTime(t)}
                disabled={disabled}
                className={`rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        {!date && <p className="mt-3 text-xs text-muted-foreground">Scegli prima una data.</p>}
      </div>
    </div>
  );
}

type FormState = { firstName: string; lastName: string; phone: string; email: string; notes: string; consent: boolean };

function StepForm({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm({ ...form, [k]: v });
  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">I tuoi dati</h2>
      <p className="mt-1 text-sm text-muted-foreground">Ci servono per contattarti e confermare l'appuntamento.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Es. Giulia" />
        </Field>
        <Field label="Cognome">
          <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Es. Bianchi" />
        </Field>
        <Field label="Telefono">
          <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Es. 333 000 0000" inputMode="tel" />
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tuoindirizzo@email.it" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Note per lo studio (opzionale)">
            <textarea rows={3} className={inputCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Segnalazioni, allergie, dubbi..." />
          </Field>
        </div>
      </div>
      <label className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm text-foreground/80">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[color:var(--color-primary)]"
        />
        <span>
          Ho letto l'informativa privacy e acconsento al trattamento dei dati per finalità di appuntamento.
          <span className="block text-xs text-muted-foreground">(demo: nessun dato viene realmente registrato)</span>
        </span>
      </label>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StepDone({ appt }: { appt: Appointment }) {
  const reduce = useReducedMotion();
  const dateFmt = new Date(appt.date + "T" + appt.time).toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return (
    <div className="text-center">
      <motion.div
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={reduce ? undefined : { scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <motion.div
          initial={reduce ? false : { scale: 0 }}
          animate={reduce ? undefined : { scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: "backOut" }}
        >
          <Check size={36} strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="mt-6 font-serif text-3xl text-ink">Prenotazione ricevuta</h3>
        <p className="mt-2 text-sm text-muted-foreground">Riferimento <span className="font-mono text-ink">#{appt.id.slice(0, 6).toUpperCase()}</span></p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-background p-6 text-left">
          <Row k="Servizio" v={serviceLabel(appt.service)} />
          <Row k="Data" v={dateFmt.charAt(0).toUpperCase() + dateFmt.slice(1)} />
          <Row k="Orario" v={appt.time} />
          <Row k="Paziente" v={`${appt.firstName} ${appt.lastName}`} />
          <Row k="Contatti" v={<><div>{appt.phone}</div><div className="text-muted-foreground">{appt.email}</div></>} />
        </div>

        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Riceverai una conferma via email e SMS. Se hai un impedimento, puoi disdire scrivendoci fino a 24 ore prima.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm text-ink hover:border-primary/40">
            Torna alla home
          </Link>
          <Link to="/staff" className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:-translate-y-0.5 transition-transform duration-300">
            Vedi in agenda staff
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-right text-ink">{v}</div>
    </div>
  );
}

function Summary({ service, date, time }: { service: ServiceKey | null; date: string | null; time: string | null }) {
  const fmt = date ? new Date(date + "T00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }) : null;
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-5 py-4 text-sm text-muted-foreground">
      <span className="text-xs uppercase tracking-wider text-primary">Riepilogo</span>
      <div className="mt-1 text-ink">
        {service ? serviceLabel(service) : "—"}
        {fmt && <> · <span>{fmt}</span></>}
        {time && <> · <span>{time}</span></>}
      </div>
    </div>
  );
}
