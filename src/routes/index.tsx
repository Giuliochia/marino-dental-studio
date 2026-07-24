import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles, Stethoscope, HeartHandshake, Sprout, Award } from "lucide-react";
import heroImg from "@/assets/hero-studio.jpg";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Dentistico Marino — Odontoiatria a Milano" },
      { name: "description", content: "Cura odontoiatrica personale in un ambiente sereno. Prima visita, igiene, ortodonzia e implantologia nel cuore di Milano." },
      { property: "og:title", content: "Studio Dentistico Marino" },
      { property: "og:description", content: "Cura odontoiatrica personale in un ambiente sereno, nel cuore di Milano." },
    ],
  }),
  component: Home,
});

const services = [
  { icon: Sparkles, title: "Igiene e prevenzione", body: "Sedute regolari di detartrasi, controlli periodici e piani di prevenzione su misura." },
  { icon: Stethoscope, title: "Conservativa ed endodonzia", body: "Restauri estetici, otturazioni in composito e cure canalari con strumentazione moderna." },
  { icon: Sprout, title: "Ortodonzia invisibile", body: "Allineatori trasparenti e apparecchi tradizionali per adulti e adolescenti." },
  { icon: ShieldCheck, title: "Implantologia", body: "Riabilitazione di uno o più elementi mancanti con protocolli mininvasivi." },
];

const values = [
  { icon: HeartHandshake, title: "Ascolto prima di tutto", body: "Ogni piano di cura nasce da un colloquio: tempi, priorità e preventivi condivisi." },
  { icon: Award, title: "25 anni di esperienza", body: "Un team stabile guidato dal Dott. Marino, formazione continua e chirurgia certificata." },
  { icon: Sparkles, title: "Tecnologia contemporanea", body: "Radiografia digitale a bassa dose, scanner intraorale, sterilizzazione tracciata." },
];

function Home() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        <div className="container-page grid gap-10 pt-8 pb-20 md:grid-cols-12 md:gap-12 md:pt-14 md:pb-32">
          <div className="md:col-span-6 md:pt-10 lg:pt-16">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Milano · Dal 1999
              </span>
              <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.05] text-ink md:text-[3.6rem] lg:text-[4.2rem]">
                La cura del sorriso,<br />
                <span className="italic text-primary">senza fretta.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/75 md:text-lg">
                Uno studio dentistico dove il tempo per ascoltare è parte della cura.
                Prevenzione, ortodonzia invisibile e implantologia, con la serenità di sentirsi in buone mani.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/prenota"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Prenota una visita
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a href="#servizi" className="text-sm text-foreground/80 underline-offset-4 hover:text-primary hover:underline">
                  Scopri i servizi
                </a>
              </div>

              <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
                <div><dt className="font-serif text-2xl text-ink">25+</dt><dd className="mt-1 text-xs text-muted-foreground">anni di attività</dd></div>
                <div><dt className="font-serif text-2xl text-ink">4.9<span className="text-primary">/5</span></dt><dd className="mt-1 text-xs text-muted-foreground">recensioni pazienti</dd></div>
                <div><dt className="font-serif text-2xl text-ink">6</dt><dd className="mt-1 text-xs text-muted-foreground">specialisti in studio</dd></div>
              </dl>
            </motion.div>
          </div>

          <div className="md:col-span-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/40 blur-2xl" />
              <img
                src={heroImg}
                alt="Sala operativa dello Studio Dentistico Marino"
                width={1600}
                height={1200}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover shadow-[0_30px_80px_-40px_rgba(30,45,35,0.35)] md:aspect-[5/6]"
              />
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -bottom-6 left-6 max-w-[240px] rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur md:left-auto md:right-6"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Disponibilità questa settimana
                </div>
                <div className="mt-1 font-serif text-lg text-ink">Prima visita gratuita</div>
                <div className="mt-0.5 text-xs text-muted-foreground">Valutazione clinica e piano di cura senza impegno.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="servizi" className="scroll-mt-24 border-t border-border bg-surface py-24">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.24em] text-primary">Servizi</span>
                <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-ink md:text-5xl">
                  Tutto ciò di cui il tuo sorriso ha bisogno, in un unico luogo.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Un approccio conservativo e mininvasivo, con un percorso di cura chiaro fin dalla prima visita.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <article className="group relative h-full rounded-2xl border border-border bg-background p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-30px_rgba(30,45,35,0.4)]">
                  <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/70 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon size={20} />
                  </div>
                  <h3 className="font-serif text-xl text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="chi-siamo" className="scroll-mt-24 py-28">
        <div className="container-page grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <span className="text-xs uppercase tracking-[0.24em] text-primary">Chi siamo</span>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Un team, un metodo, <em className="text-primary">una persona alla volta.</em>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/75">
              Lo Studio Marino nasce nel 1999 come studio di quartiere e cresce con le persone che ci scelgono.
              Continuiamo a credere che la miglior odontoiatria si faccia dedicando tempo, spiegando, e proponendo solo ciò che serve davvero.
            </p>
            <Link
              to="/prenota"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-300"
            >
              Prenota il tuo primo colloquio <ArrowRight size={16} />
            </Link>
          </Reveal>

          <div className="md:col-span-7">
            <ul className="grid gap-5">
              {values.map((v, i) => (
                <Reveal as="li" key={v.title} delay={i * 0.08}>
                  <div className="flex gap-5 rounded-2xl border border-border bg-surface p-6 transition-colors duration-500 hover:bg-accent/30">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background text-primary shadow-sm">
                      <v.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif text-xl text-ink">{v.title}</div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="container-page grid gap-8 py-16 md:grid-cols-[1.5fr_1fr] md:items-center md:py-20">
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              Prenota online. Ti confermiamo l'appuntamento in poche ore.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
              Scegli il servizio, il giorno e l'orario che preferisci. Ci pensiamo noi al resto.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/prenota"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Prenota una visita <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
