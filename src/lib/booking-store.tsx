import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ServiceKey = "visita" | "igiene" | "ortodonzia" | "implantologia" | "estetica" | "urgenza";

export const SERVICES: { key: ServiceKey; label: string; duration: string; description: string }[] = [
  { key: "visita", label: "Prima visita e check-up", duration: "30 min", description: "Valutazione completa, radiografie se necessario, piano di cura personalizzato." },
  { key: "igiene", label: "Igiene e prevenzione", duration: "45 min", description: "Detartrasi, sbiancamento leggero, istruzioni per l'igiene domiciliare." },
  { key: "ortodonzia", label: "Consulenza ortodontica", duration: "45 min", description: "Valutazione per apparecchi tradizionali o allineatori trasparenti." },
  { key: "implantologia", label: "Consulenza implantologica", duration: "45 min", description: "Studio del caso per impianti singoli o riabilitazioni complete." },
  { key: "estetica", label: "Estetica dentale", duration: "30 min", description: "Faccette, sbiancamento professionale, restauri estetici." },
  { key: "urgenza", label: "Visita d'urgenza", duration: "30 min", description: "Dolore acuto, trauma o problema urgente — risposta in giornata." },
];

export type Appointment = {
  id: string;
  service: ServiceKey;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes?: string;
  status: "confermato" | "annullato";
  createdAt: number;
};

const KEY = "marino-appointments-v1";

// Seed a few plausible appointments so the staff view isn't empty
function seed(): Appointment[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const d1 = new Date(today); d1.setDate(today.getDate() + 1);
  const d2 = new Date(today); d2.setDate(today.getDate() + 2);
  const d3 = new Date(today); d3.setDate(today.getDate() + 3);
  return [
    { id: "a1", service: "igiene", date: iso(today), time: "10:30", firstName: "Giulia", lastName: "Bianchi", phone: "333 000 0001", email: "giulia.b@example.com", status: "confermato", createdAt: Date.now() - 86400000 },
    { id: "a2", service: "visita", date: iso(d1), time: "15:00", firstName: "Marco", lastName: "Rossi", phone: "333 000 0002", email: "m.rossi@example.com", status: "confermato", createdAt: Date.now() - 3600000 },
    { id: "a3", service: "ortodonzia", date: iso(d2), time: "11:15", firstName: "Alessia", lastName: "Conti", phone: "333 000 0003", email: "a.conti@example.com", notes: "Interesse per allineatori invisibili.", status: "confermato", createdAt: Date.now() - 7200000 },
    { id: "a4", service: "implantologia", date: iso(d3), time: "17:00", firstName: "Paolo", lastName: "Ferri", phone: "333 000 0004", email: "p.ferri@example.com", status: "confermato", createdAt: Date.now() - 400000 },
  ];
}

type Ctx = {
  appointments: Appointment[];
  add: (a: Omit<Appointment, "id" | "status" | "createdAt">) => Appointment;
  cancel: (id: string) => void;
  reschedule: (id: string, date: string, time: string) => void;
  remove: (id: string) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setAppointments(JSON.parse(raw));
      else setAppointments(seed());
    } catch { setAppointments(seed()); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(appointments)); } catch {}
  }, [appointments, hydrated]);

  const ctx: Ctx = {
    appointments,
    add: (a) => {
      const appt: Appointment = { ...a, id: crypto.randomUUID(), status: "confermato", createdAt: Date.now() };
      setAppointments((p) => [...p, appt]);
      return appt;
    },
    cancel: (id) => setAppointments((p) => p.map((x) => (x.id === id ? { ...x, status: "annullato" } : x))),
    reschedule: (id, date, time) => setAppointments((p) => p.map((x) => (x.id === id ? { ...x, date, time, status: "confermato" } : x))),
    remove: (id) => setAppointments((p) => p.filter((x) => x.id !== id)),
  };

  return <BookingCtx.Provider value={ctx}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const c = useContext(BookingCtx);
  if (!c) throw new Error("useBooking outside provider");
  return c;
}

export function serviceLabel(k: ServiceKey) {
  return SERVICES.find((s) => s.key === k)?.label ?? k;
}
