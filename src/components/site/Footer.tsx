import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer id="contatti" className="mt-24 border-t border-border bg-surface-warm">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif text-2xl text-ink">Dott. Marino</div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Studio Dentistico
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Odontoiatria di prossimità. Cura personale, tecnologia contemporanea, ambiente sereno.
          </p>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
            Contatti
          </div>
          <ul className="space-y-3 text-sm text-foreground/85">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>Via Alessandro Manzoni 14<br />20121 Milano (MI)</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>02 4785 3120</span>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>info@studiomarino.it</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
            Orari
          </div>
          <ul className="space-y-2 text-sm text-foreground/85">
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <div>Lun — Ven · 9:00 — 19:30</div>
                <div>Sabato · 9:00 — 13:00</div>
                <div className="text-muted-foreground">Domenica chiuso</div>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
            Studio
          </div>
          <ul className="space-y-2 text-sm text-foreground/85">
            <li><a href="/#servizi" className="hover:text-primary">Servizi</a></li>
            <li><a href="/#chi-siamo" className="hover:text-primary">Chi siamo</a></li>
            <li><Link to="/prenota" className="hover:text-primary">Prenota una visita</Link></li>
            <li><Link to="/staff" className="hover:text-primary">Area segreteria</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Studio Dentistico Marino — P.IVA 02847510968 (fittizia)</div>
          <div>Progetto dimostrativo — nessun dato viene realmente registrato.</div>
        </div>
      </div>
    </footer>
  );
}
