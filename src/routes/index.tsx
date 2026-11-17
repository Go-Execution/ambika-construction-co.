import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Clock3,
  Fence,
  Hammer,
  HardHat,
  House,
  Layers3,
  MapPin,
  Menu,
  PanelsTopLeft,
  Phone,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/ambika-construction-logo.png";
import homePhotoUrl from "@/assets/california-home.jpg";
import concretePhotoUrl from "@/assets/concrete-project.jpg";
import framingPhotoUrl from "@/assets/construction-framing.jpg";
import remodelingPhotoUrl from "@/assets/kitchen-remodel.jpg";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    title: "New construction",
    description: "Thoughtful new builds, from the first plans to the finishing details.",
    Icon: House,
  },
  {
    title: "Additions & ADUs",
    description: "Make room to grow with a carefully planned home addition or ADU.",
    Icon: PanelsTopLeft,
  },
  {
    title: "Remodeling",
    description: "Bring new life to your kitchen, bathroom, or the spaces in between.",
    Icon: Hammer,
  },
  {
    title: "Roofing",
    description: "Dependable roofing work focused on lasting protection and a clean finish.",
    Icon: ShieldCheck,
  },
  {
    title: "Concrete",
    description: "Well-prepared, carefully finished concrete for homes and commercial spaces.",
    Icon: Blocks,
  },
  {
    title: "Framing",
    description: "Sound structural framing that gives every project a solid start.",
    Icon: Fence,
  },
  {
    title: "Electrical & plumbing",
    description: "Essential electrical and plumbing work, coordinated with your project.",
    Icon: Zap,
  },
  {
    title: "Demolition",
    description: "Careful site preparation and demolition to clear the way for what is next.",
    Icon: Layers3,
  },
];

const projects = [
  {
    title: "Residential construction",
    category: "New construction",
    image: homePhotoUrl,
    alt: "Contemporary California home with a landscaped front garden.",
  },
  {
    title: "Interior remodeling",
    category: "Remodeling",
    image: remodelingPhotoUrl,
    alt: "Renovated kitchen with custom oak cabinetry and a stone island.",
  },
  {
    title: "Concrete & site work",
    category: "Concrete",
    image: concretePhotoUrl,
    alt: "Finished concrete driveway at a contemporary California residence.",
  },
];

const advantages = [
  {
    title: "Quality craftsmanship",
    description: "Care in the details makes a difference in the finished work.",
    Icon: Hammer,
  },
  {
    title: "Reliable service",
    description: "A dependable, straightforward approach from the first conversation.",
    Icon: Clock3,
  },
  {
    title: "Attention to detail",
    description: "Every decision, finish, and fitting deserves careful consideration.",
    Icon: ShieldCheck,
  },
  {
    title: "Residential & commercial",
    description: "Construction and improvement services for different kinds of spaces.",
    Icon: HardHat,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ambika Construction Company | Stockton, California" },
      {
        name: "description",
        content:
          "Residential and commercial construction, remodeling, roofing, concrete, and more in Stockton, California. Call Ambika Construction Company for an estimate.",
      },
      {
        property: "og:title",
        content: "Ambika Construction Company | Stockton, California",
      },
      {
        property: "og:description",
        content:
          "Dependable residential and commercial construction services in Stockton, California.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Ambika Construction Company | Stockton, California",
      },
      {
        name: "twitter:description",
        content:
          "Residential and commercial construction, remodeling, roofing, concrete, and more in Stockton, California.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sectionIds = ["home", "about", "services", "projects", "contact"];
    let frameId = 0;

    const updateScrollState = () => {
      frameId = 0;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 24);
      setScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0);

      if (!prefersReducedMotion) {
        setHeroParallax(Math.min(y * 0.14, 72));
      }

      const probeY = y + 160;
      let current = "#home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probeY) {
          current = `#${id}`;
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  function handleEstimateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const subject = `Construction estimate request — ${String(values.get("service"))}`;
    const body = [
      `Name: ${String(values.get("name"))}`,
      `Email: ${String(values.get("email"))}`,
      `Phone: ${String(values.get("phone") || "Not provided")}`,
      `Service needed: ${String(values.get("service"))}`,
      "",
      String(values.get("message")),
    ].join("\n");

    setFormMessage("Opening your email app to send your estimate request.");
    window.location.href = `mailto:Ambikaconstructionus@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main id="home">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-10 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <p className="text-xs font-medium tracking-[0.04em] text-primary-foreground/85">
            Serving Stockton, California & surrounding communities
          </p>
          <a
            className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-80"
            href="tel:+12096881697"
            aria-label="Call Ambika Construction Company at 209-688-1697"
          >
            <Phone
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:rotate-12"
            />
            <span>209-688-1697</span>
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1240px] items-center justify-between gap-5 px-5 transition-[min-height] duration-300 sm:px-8 lg:px-10",
            scrolled ? "min-h-[70px]" : "min-h-[82px]",
          )}
        >
          <a
            href="#home"
            className="flex min-w-0 shrink items-center transition-opacity duration-200 hover:opacity-90"
            aria-label="Ambika Construction Company home"
          >
            <img
              src={logoUrl}
              className={cn(
                "h-auto w-[235px] max-w-[60vw] object-contain object-left transition-[max-height] duration-300",
                scrolled ? "max-h-[56px]" : "max-h-[66px]",
              )}
              alt="Ambika Construction Company — Commercial & Residential"
            />
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 xl:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={activeSection === item.href}
                className={cn(
                  "nav-link-underline text-[13px] font-medium transition-colors duration-200 hover:text-primary",
                  activeSection === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <Button
              asChild
              className="group h-11 rounded-[3px] bg-primary px-5 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0"
            >
              <a href="#contact">
                Get a free estimate{" "}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="size-10 shrink-0 rounded-[3px] transition-transform duration-150 active:scale-95 xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] origin-left bg-primary/80 transition-transform duration-75"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav-enter border-t border-border bg-background px-5 py-3 xl:hidden"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex min-h-12 items-center border-b border-border text-sm font-medium text-foreground transition-colors hover:text-primary last:border-b-0"
              >
                {item.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                />
              </a>
            ))}
            <Button
              asChild
              className="mt-3 h-11 w-full rounded-[3px] bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Get a free estimate <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </Button>
          </nav>
        )}
      </header>

      <section
        aria-labelledby="hero-heading"
        className="home-hero relative isolate flex min-h-[550px] items-center overflow-hidden sm:min-h-[590px] lg:min-h-[646px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className="absolute inset-0 will-change-transform"
            style={{ transform: `translate3d(0, ${heroParallax}px, 0)` }}
          >
            <div
              className="hero-bg-photo h-[114%] w-full -translate-y-[7%]"
              style={{ "--hero-image": `url("${homePhotoUrl}")` } as CSSProperties}
            />
          </div>
          <div className="home-hero-overlay absolute inset-0" />
          <div className="hero-grid-accent absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10">
          <div className="max-w-[610px]">
            <p className="hero-animate-eyebrow mb-6 flex items-center gap-3 text-xs font-semibold uppercase text-primary-foreground/90 sm:text-[13px]">
              <span aria-hidden="true" className="hero-animate-rule h-px w-9 bg-silver" />
              Residential & commercial construction
            </p>
            <h1
              id="hero-heading"
              className="font-display text-[50px] leading-[1.08] font-medium text-primary-foreground sm:text-[64px] lg:text-[74px]"
            >
              <span className="hero-animate-title-1 block">Building quality.</span>
              <span className="hero-animate-title-2 text-hero-detail block">Creating trust.</span>
            </h1>
            <p className="hero-animate-copy mt-6 max-w-[465px] text-base leading-7 text-primary-foreground/85 sm:text-[17px]">
              Reliable residential and commercial construction services in Stockton, California.
            </p>
            <div className="hero-animate-actions mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="group h-12 rounded-[3px] bg-background px-6 text-sm font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg active:translate-y-0"
              >
                <a href="#contact">
                  Get a free estimate{" "}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-[3px] border-primary-foreground/55 bg-primary/10 px-6 text-sm font-semibold text-primary-foreground backdrop-blur-[2px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-foreground/15 hover:text-primary-foreground active:translate-y-0"
              >
                <a href="#services">Explore our services</a>
              </Button>
            </div>
          </div>
        </div>
        <a
          href="#about"
          aria-label="Continue to learn about Ambika Construction Company"
          className="hero-animate-discover group absolute right-8 bottom-8 z-10 hidden items-center gap-3 text-xs font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:inline-flex lg:right-12"
        >
          Discover Ambika{" "}
          <ArrowRight
            aria-hidden="true"
            className="hero-discover-arrow size-4 transition-transform duration-200 group-hover:translate-x-1.5"
          />
        </a>
      </section>

      <section id="about" className="scroll-mt-24 bg-background">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
          <Reveal
            variant="curtain"
            duration={850}
            className="group relative order-2 min-h-[320px] overflow-hidden sm:min-h-[390px] lg:order-1 lg:min-h-[455px]"
          >
            <img
              src={framingPhotoUrl}
              alt="Construction professionals carefully framing a residential addition."
              className="absolute inset-0 h-full w-full object-cover object-[46%_center] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              width="1536"
              height="1024"
            />
            <Reveal
              variant="up"
              delay={260}
              duration={600}
              className="absolute right-0 bottom-0 bg-background px-5 py-4 shadow-sm sm:px-7 sm:py-5"
            >
              <p className="text-xs font-semibold text-primary">AMBika Construction Company</p>
              <p className="mt-1 text-xs text-muted-foreground">Commercial & residential</p>
            </Reveal>
          </Reveal>

          <Reveal variant="up" delay={80} className="order-1 lg:order-2">
            <p className="section-eyebrow">
              <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />A thoughtful
              approach to building
            </p>
            <h2 className="mt-5 max-w-[500px] font-display text-4xl leading-[1.15] font-medium text-foreground sm:text-[48px]">
              Your trusted construction partner.
            </h2>
            <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-muted-foreground">
              Ambika Construction Company provides residential and commercial construction services
              in Stockton, California, and surrounding communities. Every project deserves clear
              communication, thoughtful work, and care for the details.
            </p>
            <p className="mt-4 max-w-[500px] text-[15px] leading-7 text-muted-foreground">
              From a new build to a renovation, we bring a considered, dependable approach to the
              work and the people who count on it.
            </p>
            <a
              href="#contact"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 border-b border-silver pb-1 text-sm font-semibold text-primary transition-colors hover:border-primary"
            >
              Talk about your project{" "}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-secondary">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-10">
            <Reveal variant="up">
              <p className="section-eyebrow">
                <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />
                How we can help
              </p>
              <h2 className="mt-5 max-w-[550px] font-display text-4xl leading-[1.15] font-medium text-foreground sm:text-[48px]">
                Complete construction solutions.
              </h2>
            </Reveal>
            <Reveal variant="up" delay={120} className="md:justify-self-end">
              <p className="max-w-[435px] pb-1 text-[15px] leading-7 text-muted-foreground">
                From new builds to renovations, we bring care and experience to every stage of your
                project.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid border-t border-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, description, Icon }, index) => (
              <a
                key={title}
                href="#contact"
                onClick={() => setSelectedService(title)}
                className="service-card group flex min-h-[195px] flex-col border-b border-border py-6 hover:bg-background/60 sm:min-h-[210px] sm:px-5 sm:py-7 lg:px-6 [&:nth-child(odd)]:sm:border-r [&:nth-child(4n+2)]:lg:border-r [&:nth-child(4n+3)]:lg:border-r [&:nth-child(4n+2)]:sm:border-r-0 [&:nth-child(4n+3)]:sm:border-r-0 [&:first-child]:sm:pl-0 [&:nth-child(4n+1)]:lg:pl-0"
              >
                <Reveal
                  variant="up"
                  delay={index * 55}
                  duration={600}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      aria-hidden="true"
                      className="size-[21px] text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                      strokeWidth={1.6}
                    />
                    <span className="font-display text-sm text-muted-foreground/75 transition-colors duration-200 group-hover:text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-7 text-[16px] font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 max-w-[270px] text-sm leading-[1.7] text-muted-foreground">
                    {description}
                  </p>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold text-primary">
                    Learn more
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </Reveal>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <Reveal variant="up">
              <p className="section-eyebrow">
                <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />
                Construction, considered
              </p>
              <h2 className="mt-5 max-w-[570px] font-display text-4xl leading-[1.15] font-medium text-foreground sm:text-[48px]">
                Our work speaks for itself.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                An introduction to the kinds of construction and improvements we do.
              </p>
            </Reveal>
            <Reveal variant="left" delay={120}>
              <Button
                asChild
                variant="outline"
                className="group h-11 self-start rounded-[3px] border-border px-5 text-xs font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary sm:mb-1 sm:self-auto"
              >
                <a href="#contact">
                  Discuss your project{" "}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </Button>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={150}>
            <p className="mt-6 border-l-2 border-silver pl-3 text-xs leading-5 text-muted-foreground">
              Representative project imagery; images do not depict confirmed company projects.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.title} variant="up" delay={index * 110} duration={700}>
                <a
                  href="#contact"
                  onClick={() => setSelectedService(project.category)}
                  className="group block min-w-0"
                  aria-label={`Discuss ${project.category.toLowerCase()} with Ambika Construction Company`}
                >
                  <div className="relative aspect-[1.23] overflow-hidden bg-secondary">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      width="1536"
                      height="1024"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 left-3 bg-background/95 px-3 py-1.5 text-[10px] font-semibold text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-4">
                    <h3 className="min-w-0 text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary" aria-labelledby="why-us-heading">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-24">
          <Reveal variant="up" className="max-w-[640px]">
            <p className="section-eyebrow">
              <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />
              The Ambika approach
            </p>
            <h2
              id="why-us-heading"
              className="mt-5 font-display text-4xl leading-[1.15] font-medium text-foreground sm:text-[46px]"
            >
              Built on quality, driven by trust.
            </h2>
          </Reveal>
          <div className="mt-10 grid border-t border-border sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {advantages.map(({ title, description, Icon }, index) => (
              <Reveal
                as="article"
                key={title}
                variant="up"
                delay={index * 85}
                duration={650}
                className="service-card group flex gap-4 border-b border-border py-6 sm:px-5 sm:py-7 lg:flex-col lg:gap-5 lg:px-6 lg:py-7 [&:nth-child(odd)]:sm:border-r [&:nth-child(odd)]:lg:border-r-0 [&:first-child]:sm:pl-0 [&:nth-child(4n+1)]:lg:pl-0"
              >
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                  strokeWidth={1.6}
                />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 max-w-[255px] text-sm leading-[1.7] text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="estimate-band relative overflow-hidden bg-primary text-primary-foreground"
        aria-labelledby="estimate-heading"
      >
        <div
          aria-hidden="true"
          className="estimate-band-sheen pointer-events-none absolute inset-0"
        />
        <div className="relative z-10 mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-[88px]">
          <Reveal variant="up" className="max-w-[640px]">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase text-primary-foreground/75">
              <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />
              Your next step
            </p>
            <h2
              id="estimate-heading"
              className="mt-5 font-display text-4xl leading-[1.15] font-medium text-primary-foreground sm:text-[47px]"
            >
              Ready to start your next project?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/75 sm:text-[15px]">
              Let’s discuss your construction needs and find the right way forward.
            </p>
          </Reveal>
          <Reveal
            variant="up"
            delay={140}
            className="flex shrink-0 flex-col items-start gap-5 sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center"
          >
            <Button
              asChild
              className="group h-12 rounded-[3px] bg-background px-6 text-sm font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg active:translate-y-0"
            >
              <a href="#contact">
                Request a free estimate{" "}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </Button>
            <a
              href="tel:+12096881697"
              className="group inline-flex min-h-11 items-center gap-2.5 text-sm font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              <Phone
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:rotate-12"
              />{" "}
              209-688-1697
            </a>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <Reveal variant="up" className="max-w-[660px]">
            <p className="section-eyebrow">
              <span aria-hidden="true" className="reveal-rule h-px w-8 bg-silver" />
              Let’s talk about your project
            </p>
            <h2 className="mt-5 font-display text-4xl leading-[1.15] font-medium text-foreground sm:text-[48px]">
              Let’s build something great.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              Tell us a little about your project. We’ll be glad to hear from you.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-12 border-t border-border pt-9 lg:mt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-12">
            <Reveal variant="up" delay={80} className="min-w-0">
              <form
                onSubmit={handleEstimateSubmit}
                className="min-w-0"
                aria-label="Request a free estimate"
              >
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <label className="block min-w-0 text-xs font-semibold text-foreground">
                    Name{" "}
                    <span aria-hidden="true" className="text-primary">
                      *
                    </span>
                    <input
                      autoComplete="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="contact-input mt-2.5"
                    />
                  </label>
                  <label className="block min-w-0 text-xs font-semibold text-foreground">
                    Email{" "}
                    <span aria-hidden="true" className="text-primary">
                      *
                    </span>
                    <input
                      autoComplete="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="contact-input mt-2.5"
                    />
                  </label>
                  <label className="block min-w-0 text-xs font-semibold text-foreground">
                    Phone
                    <input
                      autoComplete="tel"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      className="contact-input mt-2.5"
                    />
                  </label>
                  <label className="block min-w-0 text-xs font-semibold text-foreground">
                    Service needed{" "}
                    <span aria-hidden="true" className="text-primary">
                      *
                    </span>
                    <select
                      name="service"
                      required
                      value={selectedService}
                      onChange={(event) => setSelectedService(event.target.value)}
                      className={cn(
                        "contact-input mt-2.5",
                        !selectedService && "text-muted-foreground",
                      )}
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {services.map((service) => (
                        <option key={service.title} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                      <option value="Other">Other / not sure yet</option>
                    </select>
                  </label>
                  <label className="block min-w-0 text-xs font-semibold text-foreground sm:col-span-2">
                    Message{" "}
                    <span aria-hidden="true" className="text-primary">
                      *
                    </span>
                    <textarea
                      name="message"
                      placeholder="Tell us a little about what you have in mind…"
                      required
                      rows={4}
                      className="contact-input mt-2.5 min-h-[112px] resize-y py-3"
                    />
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Button
                    type="submit"
                    className="group h-12 rounded-[3px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0"
                  >
                    Send estimate request{" "}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Button>
                  <span aria-live="polite" className="text-xs leading-5 text-muted-foreground">
                    {formMessage}
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-xs leading-5 text-muted-foreground">
                  Your message opens in your email app, addressed to Ambika Construction Company.
                </p>
              </form>
            </Reveal>

            <Reveal
              as="aside"
              variant="up"
              delay={160}
              className="min-w-0"
              aria-label="Ambika Construction Company contact information"
            >
              <div className="grid gap-6 border-b border-border pb-7 sm:grid-cols-2 sm:gap-5">
                <div>
                  <p className="text-xs font-semibold text-foreground">Call us</p>
                  <a
                    href="tel:+12096881697"
                    className="group mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone
                      aria-hidden="true"
                      className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:rotate-12"
                    />
                    209-688-1697
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Email us</p>
                  <a
                    href="mailto:Ambikaconstructionus@gmail.com"
                    className="group mt-2 inline-flex max-w-full items-start gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-primary transition-transform duration-200 group-hover:scale-110"
                    >
                      @
                    </span>
                    <span>Ambikaconstructionus@gmail.com</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Visit us</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=4547+S+B+Street%2C+Stockton%2C+CA+95206"
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2 inline-flex items-start gap-2 text-sm leading-6 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MapPin
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary transition-transform duration-200 group-hover:-translate-y-0.5"
                    />
                    <span>4547 S B Street, Stockton, CA 95206</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Business hours</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    8:00 AM–5:00 PM
                  </p>
                </div>
              </div>

              <Reveal
                variant="scale"
                delay={220}
                className="mt-6 overflow-hidden bg-secondary transition-shadow duration-300 hover:shadow-md"
              >
                <iframe
                  title="Map to Ambika Construction Company at 4547 S B Street, Stockton, California"
                  src="https://maps.google.com/maps?q=4547%20S%20B%20Street%2C%20Stockton%2C%20CA%2095206&output=embed"
                  className="h-[250px] w-full border-0 sm:h-[280px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 border-b border-primary-foreground/15 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.75fr_1fr_1fr] lg:gap-12 lg:py-14">
            <Reveal variant="up" delay={0} threshold={0.05} className="max-w-[290px]">
              <a
                href="#home"
                aria-label="Ambika Construction Company — back to top"
                className="inline-block transition-opacity duration-200 hover:opacity-90"
              >
                <img
                  src={logoUrl}
                  alt="Ambika Construction Company"
                  className="h-auto w-[242px] max-w-full bg-background object-contain"
                  loading="lazy"
                  width="1437"
                  height="421"
                />
              </a>
              <p className="mt-4 text-sm leading-6 text-primary-foreground/70">
                Residential & commercial construction in Stockton, California.
              </p>
            </Reveal>

            <Reveal variant="up" delay={80} threshold={0.05}>
              <h2 className="text-xs font-semibold text-primary-foreground">Explore</h2>
              <nav aria-label="Footer navigation" className="mt-4 flex flex-col items-start gap-3">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-xs text-primary-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </Reveal>

            <Reveal variant="up" delay={160} threshold={0.05}>
              <h2 className="text-xs font-semibold text-primary-foreground">Our services</h2>
              <nav
                aria-label="Construction services"
                className="mt-4 flex flex-col items-start gap-3"
              >
                {services.slice(0, 5).map((service) => (
                  <a
                    key={service.title}
                    href="#services"
                    className="text-xs text-primary-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary-foreground"
                  >
                    {service.title}
                  </a>
                ))}
              </nav>
            </Reveal>

            <Reveal variant="up" delay={240} threshold={0.05}>
              <h2 className="text-xs font-semibold text-primary-foreground">Get in touch</h2>
              <div className="mt-4 flex flex-col items-start gap-3">
                <a
                  href="tel:+12096881697"
                  className="inline-flex items-center gap-2 text-xs text-primary-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary-foreground"
                >
                  <Phone aria-hidden="true" className="size-3.5 shrink-0" /> 209-688-1697
                </a>
                <a
                  href="mailto:Ambikaconstructionus@gmail.com"
                  className="inline-flex max-w-full items-start gap-2 break-all text-xs text-primary-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary-foreground"
                >
                  <span aria-hidden="true" className="shrink-0">
                    @
                  </span>
                  Ambikaconstructionus@gmail.com
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-start gap-2 text-xs leading-5 text-primary-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary-foreground"
                >
                  <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                  4547 S B Street, Stockton, CA 95206
                </a>
              </div>
            </Reveal>
          </div>

          <div className="flex min-h-[65px] flex-col justify-center gap-2 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Ambika Construction Company Inc. All rights reserved.</p>
            <a
              href="#home"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary-foreground"
            >
              Back to top{" "}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
