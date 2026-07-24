import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Calendar, Check, Clock, Filter as FilterIcon, Mail, Phone, Search, Trash2, X, Pencil } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookingProvider, useBooking, serviceLabel, type Appointment } from "@/lib/booking-store";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Area segreteria — Studio Marino" },
      { name: "description", content: "Vista dimostrativa per la gestione degli appuntamenti dello Studio Dentistico Marino." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <BookingProvider>
      <StaffPage />
    </BookingProvider>
  ),
});

type FilterKind = "prossimi" | "oggi" | "tutti" | "annullati";

function StaffPage() {
  const { appointments } = useBooking();
  const [filter, setFilter] = useState<FilterKind>("prossimi");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let list = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (filter === "oggi") list = list.filter((a) => a.date === today && a.status === "confermato");
    else if (filter === "prossimi") list = list.filter((a) => a.date >= today && a.status === "confermato");
    else if (filter === "annullati") list = list.filter((a) => a.status === "annullato");
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((a) =>
        `${a.firstName} ${a.lastName} ${a.email} ${a.phone} ${serviceLabel(a.service)}`.toLowerCase().includes(s),
      );
    }
    return list;
  }, [appointments, filter, q]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      oggi: appointments.filter((a) => a.date === today && a.status === "confermato").length,
      prossimi: appointments.filter((a) => a.date >= today && a.status === "confermato").length,
      totali: appointments.length,
      annullati: appointments.filter((a) => a.status === "annullato").length,
    };
  }, [appointments]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-page py-14 md:py-20">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted-foreground w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Area segreteria — prototipo dimostrativo (dati in sessione)
        </div>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-primary">Agenda</div>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Appuntamenti dello studio
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Visualizza, riprogramma o annulla le prenotazioni ricevute online.</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Stat label="Oggi" v={stats.oggi} />
            <Stat label="In arrivo" v={stats.prossimi} />
            <Stat label="Totali" v={stats.totali} />
            <Stat label="Annullati" v={stats.annullati} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <FilterIcon size={14} className="text-muted-foreground" />
            {(["prossimi", "oggi", "tutti", "annullati"] as FilterKind[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs capitalize transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca paziente, servizio, email..."
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          <AnimatePresence initial={false}>
            {filtered.length === 0 && (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground"
              >
                Nessun appuntamento per questa vista.
              </motion.li>
            )}
            {filtered.map((a) => (
              <AppointmentRow key={a.id} a={a} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <Footer />
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-center">
      <div className="font-serif text-2xl text-ink">{v}</div>
      <div className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function AppointmentRow({ a }: { a: Appointment }) {
  const { cancel, reschedule, remove } = useBooking();
  const reduce = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [d, setD] = useState(a.date);
  const [t, setT] = useState(a.time);

  const dt = new Date(a.date + "T" + a.time);
  const wd = dt.toLocaleDateString("it-IT", { weekday: "short" });
  const mo = dt.toLocaleDateString("it-IT", { month: "short" });

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border bg-surface p-5 transition-colors ${a.status === "annullato" ? "border-border/60 opacity-70" : "border-border hover:border-primary/40"}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background text-center shadow-sm">
            <div>
              <div className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{wd}</div>
              <div className="font-serif text-2xl leading-none text-ink">{dt.getDate()}</div>
              <div className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{mo}</div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-lg text-ink truncate">{a.firstName} {a.lastName}</span>
              {a.status === "annullato" ? (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-destructive">Annullato</span>
              ) : (
                <span className="rounded-full bg-accent/60 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-primary">Confermato</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {a.time}</span>
              <span className="inline-flex items-center gap-1 text-primary">· {serviceLabel(a.service)}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Phone size={12} /> {a.phone}</span>
              <span className="inline-flex items-center gap-1"><Mail size={12} /> {a.email}</span>
            </div>
            {a.notes && <div className="mt-2 rounded-lg bg-background px-3 py-2 text-xs text-foreground/70">"{a.notes}"</div>}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {a.status === "confermato" && !editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Pencil size={12} /> Riprogramma
              </button>
              <button
                onClick={() => cancel(a.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                <X size={12} /> Annulla
              </button>
            </>
          )}
          {a.status === "annullato" && (
            <button
              onClick={() => remove(a.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-destructive/40 hover:text-destructive"
            >
              <Trash2 size={12} /> Rimuovi
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={reduce ? undefined : { opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-background p-4">
              <label className="text-xs text-muted-foreground">
                <span className="mb-1 flex items-center gap-1.5 uppercase tracking-wider"><Calendar size={12} /> Data</span>
                <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-ink" />
              </label>
              <label className="text-xs text-muted-foreground">
                <span className="mb-1 flex items-center gap-1.5 uppercase tracking-wider"><Clock size={12} /> Orario</span>
                <input type="time" value={t} onChange={(e) => setT(e.target.value)} className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-ink" />
              </label>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setEditing(false)} className="rounded-full border border-border px-4 py-1.5 text-xs text-foreground/80 hover:text-primary">Annulla</button>
                <button
                  onClick={() => { reschedule(a.id, d, t); setEditing(false); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <Check size={12} /> Salva
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
