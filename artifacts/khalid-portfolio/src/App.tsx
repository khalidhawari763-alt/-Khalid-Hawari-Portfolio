import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDot,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  Map,
  Menu,
  Moon,
  Radio,
  Send,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type IconType = typeof Code2;

const skills: { title: string; description: string; icon: IconType; tools: string[]; index: string }[] = [
  {
    title: 'Robotics systems',
    description: 'Designing robots that sense, decide, and move through real constraints.',
    icon: Radio,
    tools: ['ROS 2', 'Navigation2', 'SLAM', 'TF2'],
    index: '01',
  },
  {
    title: 'Artificial intelligence',
    description: 'Turning sensor data into useful perception, prediction, and action.',
    icon: BrainCircuit,
    tools: ['Python', 'Computer vision', 'ML pipelines', 'Azure AI'],
    index: '02',
  },
  {
    title: 'Embedded engineering',
    description: 'Connecting low-level hardware decisions to reliable system behaviour.',
    icon: Cpu,
    tools: ['C / C++', 'Microcontrollers', 'Sensors', 'Control'],
    index: '03',
  },
  {
    title: 'Simulation & integration',
    description: 'Testing ideas in a digital twin before putting them on the floor.',
    icon: Layers3,
    tools: ['Gazebo', 'RViz', 'Linux', 'Git'],
    index: '04',
  },
];

const projects = [
  {
    id: 'striker-x',
    number: '01',
    name: 'Striker X',
    type: 'Autonomous humanoid platform',
    summary: 'A competition-minded humanoid robot concept built around perception, locomotion, and a clear decision loop.',
    detail: 'Striker X explores how a compact robot can move from camera input to controlled action. The architecture connects a perception node to a behaviour layer and actuator control, with simulation used to validate the loop before hardware tests.',
    tags: ['ROS 2', 'Python', 'Computer vision', 'Gazebo'],
    visual: 'striker',
  },
  {
    id: 'amr',
    number: '02',
    name: 'Autonomous Mobile Robot',
    type: 'Navigation & mapping system',
    summary: 'A mobile robot stack for mapping an unknown space, planning a route, and arriving without a human driver.',
    detail: 'The AMR project focuses on the seams between algorithms and hardware: sensor fusion, map quality, path planning, and safe recovery when the real world disagrees with the plan.',
    tags: ['SLAM', 'Navigation2', 'LiDAR', 'ROS 2'],
    visual: 'amr',
  },
  {
    id: 'balance',
    number: '03',
    name: 'Self-Balancing Robot',
    type: 'Control systems study',
    summary: 'A two-wheel platform that turns feedback, tuning, and fast iteration into physical stability.',
    detail: 'This project is a practical study in control. An IMU feeds the balance loop while motor commands respond to the measured tilt, bringing together embedded code, mechanical intuition, and disciplined tuning.',
    tags: ['C++', 'IMU', 'PID control', 'Embedded'],
    visual: 'balance',
  },
] as const;

const journey = [
  { year: 'NOW', title: 'Building with intention', text: 'Combining robotics, AI, embedded systems, and simulation into projects that can leave the screen.' },
  { year: 'NEXT', title: 'Going deeper on autonomy', text: 'Sharpening perception and navigation workflows through more capable ROS 2 systems.' },
  { year: 'ALWAYS', title: 'Learning by shipping', text: 'Documenting experiments, measuring what works, and letting the hardware disagree early.' },
];

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12, rootMargin: '0px 0px -35px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function MetaTags() {
  useEffect(() => {
    document.title = 'Khalid Hawari — AI & Robotics Engineering';
    const description = 'Portfolio of Khalid Hawari, an AI and Robotics Engineering student from Jordan building intelligent machines with ROS 2, embedded systems, and simulation.';
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (property) tag.setAttribute('property', name);
        else tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', 'Khalid Hawari — AI & Robotics Engineering', true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', window.location.href, true);
    setMeta('twitter:card', 'summary_large_image');
  }, []);
  return null;
}

function Header({ dark, onTheme, menuOpen, onMenu }: { dark: boolean; onTheme: () => void; menuOpen: boolean; onMenu: () => void }) {
  const closeMenu = () => menuOpen && onMenu();
  const navItems = [
    ['about', 'About'],
    ['skills', 'Systems'],
    ['projects', 'Projects'],
    ['journey', 'Journey'],
    ['contact', 'Contact'],
  ];
  return (
    <header className="nav-shell fixed top-0 z-20 w-full">
      <div className="max-frame flex h-[72px] items-center justify-between">
        <a href="#top" onClick={closeMenu} className="focus-ring flex items-center gap-3" data-testid="link-home">
          <span className="grid h-8 w-8 place-items-center border border-primary/60 bg-primary/10 font-mono text-xs text-primary">KH</span>
          <span className="font-mono text-[11px] tracking-[.16em] text-foreground">KHALID<span className="text-primary">/</span>HAWARI</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="focus-ring font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onTheme} className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} data-testid="button-theme-toggle">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button type="button" onClick={onMenu} className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu max-frame border-t border-border py-4 md:hidden" aria-label="Mobile navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={onMenu} className="focus-ring block border-b border-border/50 py-3 font-mono text-xs uppercase tracking-[.15em] text-muted-foreground hover:text-primary" data-testid={`link-mobile-${id}`}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function SectionHeading({ kicker, title, text, id }: { kicker: string; title: ReactNode; text?: string; id?: string }) {
  return (
    <div id={id} className="mb-12 max-w-2xl reveal">
      <p className="eyebrow mb-4">{kicker}</p>
      <div className="cyan-rule mb-5" />
      <h2 className="display-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h2>
      {text && <p className="copy-muted mt-5 max-w-xl text-base leading-7">{text}</p>}
    </div>
  );
}

function ProjectVisual({ type }: { type: string }) {
  return (
    <div className={`project-visual visual-${type}`} aria-label={`${type} technical placeholder visual`} role="img">
      <div className="absolute left-4 top-4 project-signal">SYS.VISUAL / 0{type === 'striker' ? '1' : type === 'amr' ? '2' : '3'}</div>
      <div className="absolute right-4 top-4 flex items-center gap-2 project-signal"><CircleDot size={10} /> LIVE MODEL</div>
      <div className="scanline" />
      {type === 'striker' && (
        <>
          <div className="robot-head" /><div className="robot-body" /><div className="leg leg-l" /><div className="leg leg-r" />
          <div className="wire" style={{ width: '28%', left: '10%', top: '47%', transform: 'rotate(-13deg)' }} />
          <div className="wire" style={{ width: '23%', right: '7%', top: '31%', transform: 'rotate(22deg)' }} />
          <div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" /><div className="orbit-dot dot-c" />
        </>
      )}
      {type === 'amr' && <><div className="map-frame" /><div className="path" /><div className="amr-node node-start" /><div className="amr-node node-end" /><div className="absolute bottom-5 left-5 project-signal">MAP / 4.82 m² / 98.4%</div></>}
      {type === 'balance' && <><div className="balance-bot" /><div className="balance-platform" /><div className="absolute bottom-5 left-5 project-signal">ANGLE / +0.018° / PID LOOP</div></>}
      <div className="absolute bottom-4 right-4 project-signal">● SIMULATION READY</div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[720px] items-center pt-28 pb-16">
      <div className="max-frame relative z-[1] grid w-full items-center gap-14 lg:grid-cols-[1.06fr_.94fr]">
        <div className="reveal">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-9 bg-primary" />
            <span className="eyebrow">AI & Robotics Engineering / Jordan</span>
          </div>
          <h1 className="display-heading max-w-3xl text-[clamp(3.6rem,9vw,7.6rem)] font-semibold">
            Building machines<br /><span className="text-primary">with a point of view.</span>
          </h1>
          <p className="copy-muted mt-8 max-w-xl text-lg leading-8">
            I’m Khalid Hawari — an AI & Robotics Engineering student turning algorithms, electronics, and motion into systems that can do something in the real world.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="button-primary focus-ring" data-testid="link-hero-projects">Explore the work <ArrowDown size={15} /></a>
            <a href="#contact" className="button-quiet focus-ring" data-testid="link-hero-contact">Start a conversation <ArrowUpRight size={15} /></a>
          </div>
          <div className="hero-rail mt-12 max-w-md">
            <p className="font-mono text-[11px] leading-6 text-muted-foreground">Currently focused on <span className="text-foreground">autonomous navigation, computer vision,</span> and the systems between an idea and a working robot.</p>
          </div>
        </div>
        <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[440px]">
          <div className="absolute -left-2 top-5 font-mono text-[9px] uppercase tracking-[.18em] text-primary/80 [writing-mode:vertical-rl]">Observe / Decide / Act</div>
          <div className="hero-orbit">
            <div className="orbit-core" /><div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" /><div className="orbit-dot dot-c" />
            <div className="absolute left-[13%] top-[68%] font-mono text-[9px] tracking-[.15em] text-muted-foreground">ROS_2</div>
            <div className="absolute right-[4%] top-[17%] font-mono text-[9px] tracking-[.15em] text-muted-foreground">AI / ML</div>
            <div className="absolute bottom-[12%] right-[16%] font-mono text-[9px] tracking-[.15em] text-muted-foreground">EMBEDDED</div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">
            <span>System 01 / online</span><span className="flex items-center gap-2 text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> signal stable</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-muted-foreground md:flex"><span className="font-mono text-[9px] uppercase tracking-[.2em]">Scroll to inspect</span><span className="h-10 w-px bg-border" /></div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative border-t border-border py-24 sm:py-32">
      <div className="max-frame grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHeading kicker="01 / The operator" title={<>Curiosity is useful.<br /><span className="text-primary">Applied curiosity</span> is better.</>} text="The best way I know to learn a system is to build one, break it, and understand exactly why." />
        <div className="grid gap-8 self-end sm:grid-cols-2 reveal reveal-delay-1">
          <div className="panel p-6">
            <Terminal className="mb-8 text-primary" size={20} />
            <p className="font-mono text-[11px] uppercase tracking-[.14em] text-muted-foreground">Approach</p>
            <p className="mt-3 text-lg leading-7">I work from first principles, then validate quickly in simulation and on hardware.</p>
          </div>
          <div className="panel mt-8 p-6 sm:mt-16">
            <Map className="mb-8 text-accent" size={20} />
            <p className="font-mono text-[11px] uppercase tracking-[.14em] text-muted-foreground">Based in</p>
            <p className="mt-3 text-lg leading-7">Jordan, building a global perspective through open technical work.</p>
          </div>
          <div className="sm:col-span-2 border-l-2 border-primary/60 pl-5">
            <p className="text-lg leading-8 text-muted-foreground">Robotics is where my interests converge: <span className="text-foreground">software that senses, hardware that responds, and decisions that have consequences.</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative border-t border-border py-24 sm:py-32">
      <div className="max-frame">
        <SectionHeading kicker="02 / Systems map" title={<>A stack built for<br /><span className="text-primary">physical intelligence.</span></>} text="The tools matter. The connections between them matter more." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <article key={skill.title} className={`panel panel-hover skill-card reveal reveal-delay-${(index % 3) + 1} p-6`} data-index={skill.index} data-testid={`card-skill-${skill.index}`}>
                <Icon size={21} className="text-primary" />
                <h3 className="mt-9 text-xl font-medium">{skill.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{skill.description}</p>
                <div className="relative z-[1] mt-5 flex flex-wrap gap-1.5">{skill.tools.map((tool) => <span key={tool} className="tag">{tool}</span>)}</div>
              </article>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-y border-border py-5 reveal">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Also in the toolkit</p>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-foreground"><span>Linux</span><span>Git & GitHub</span><span>Azure</span><span>MATLAB</span><span>SolidWorks</span></div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section id="projects" className="relative border-t border-border py-24 sm:py-32">
      <div className="max-frame">
        <SectionHeading kicker="03 / Field notes" title={<>Projects that leave<br /><span className="text-primary">the whiteboard.</span></>} text="A selection of builds where theory met sensors, motors, latency, and the occasional stubborn bug." />
        <div className="space-y-5">
          {projects.map((project) => (
            <article key={project.id} className="project-card panel reveal" data-testid={`card-project-${project.id}`}>
              <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                <ProjectVisual type={project.visual} />
                <div className="flex flex-col justify-between p-6 sm:p-9">
                  <div>
                    <div className="mb-7 flex items-center justify-between gap-4"><span className="eyebrow">Project {project.number}</span><span className="font-mono text-[10px] text-muted-foreground">2024—25</span></div>
                    <h3 className="display-heading text-4xl font-semibold sm:text-5xl">{project.name}</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[.12em] text-primary">{project.type}</p>
                    <p className="mt-6 max-w-lg leading-7 text-muted-foreground">{project.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
                  </div>
                  <div className="mt-9 flex flex-wrap items-center gap-5">
                    <button type="button" onClick={() => setSelected(selected === project.id ? null : project.id)} className="focus-ring inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-foreground transition-colors hover:text-primary" data-testid={`button-project-details-${project.id}`}>
                      {selected === project.id ? 'Close brief' : 'Inspect project'} <ChevronDown size={14} className={selected === project.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                    <a href="https://github.com/khalidhawari763-alt" target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-project-github-${project.id}`}>GitHub <ExternalLink size={13} /></a>
                  </div>
                </div>
              </div>
              {selected === project.id && <div className="border-t border-primary/25 bg-primary/[.035] px-6 py-5 sm:px-9"><p className="max-w-3xl text-sm leading-7 text-muted-foreground"><span className="mr-3 font-mono text-[10px] uppercase tracking-[.14em] text-primary">Technical brief</span>{project.detail}</p></div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="relative border-t border-border py-24 sm:py-32">
      <div className="max-frame grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHeading kicker="04 / Trajectory" title={<>Still learning.<br /><span className="text-primary">Already building.</span></>} text="A technical journey is not a checklist. It is a record of better questions." />
        <div className="relative space-y-10 pl-8 reveal reveal-delay-1">
          <div className="journey-line" />
          {journey.map((item, index) => (
            <div key={item.year} className="relative grid gap-2 sm:grid-cols-[100px_1fr]">
              <div className="journey-dot absolute -left-[32px] top-1" />
              <span className="font-mono text-[10px] tracking-[.15em] text-primary">{item.year}</span>
              <div><h3 className="text-xl font-medium">{item.title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{item.text}</p></div>
              {index < journey.length - 1 && <div className="absolute -bottom-6 left-0 h-px w-full bg-border sm:left-[100px]" />}
            </div>
          ))}
          <div className="panel mt-14 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow">Activity / github</p><p className="mt-2 text-sm text-muted-foreground">Technical activity will live here as the work evolves.</p></div>
            <a href="https://github.com/khalidhawari763-alt" target="_blank" rel="noreferrer" className="button-quiet focus-ring shrink-0" data-testid="link-github-activity">View profile <Github size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className="border-y border-border bg-card/30 py-16">
      <div className="max-frame grid gap-8 md:grid-cols-2">
        <div className="flex gap-5 reveal">
          <div className="grid h-11 w-11 shrink-0 place-items-center border border-primary/40 bg-primary/10 text-primary"><GraduationCap size={20} /></div>
          <div><p className="eyebrow">Education</p><h3 className="mt-2 text-xl font-medium">Jordan University of Science and Technology</h3><p className="mt-2 text-sm text-muted-foreground">AI & Robotics Engineering · Jordan</p></div>
        </div>
        <div className="flex gap-5 reveal reveal-delay-1">
          <div className="grid h-11 w-11 shrink-0 place-items-center border border-accent/50 bg-accent/10 text-accent"><Check size={20} /></div>
          <div><p className="eyebrow text-accent">Certification</p><h3 className="mt-2 text-xl font-medium">Microsoft Azure AI Fundamentals</h3><p className="mt-2 font-mono text-[11px] text-muted-foreground">AI-900 · Microsoft</p></div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="max-frame grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div className="reveal">
          <p className="eyebrow mb-4">05 / Open channel</p>
          <div className="cyan-rule mb-5" />
          <h2 className="display-heading text-5xl font-semibold sm:text-6xl">Have a hard<br /><span className="text-primary">problem?</span></h2>
          <p className="mt-7 max-w-sm leading-7 text-muted-foreground">I’m open to internships, research, competitions, graduate opportunities, and conversations about robots that should exist.</p>
          <div className="mt-9 space-y-3">
            <a href="mailto:khalid.hawari@example.com" className="focus-ring flex items-center gap-3 font-mono text-xs text-foreground hover:text-primary" data-testid="link-email"><Mail size={16} className="text-primary" /> khalid.hawari@example.com</a>
            <a href="https://www.linkedin.com/in/khalid-hawari-b883a8358" target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-3 font-mono text-xs text-foreground hover:text-primary" data-testid="link-linkedin"><Linkedin size={16} className="text-primary" /> linkedin.com/in/khalid-hawari-b883a8358</a>
          </div>
        </div>
        <div className="panel p-5 sm:p-8 reveal reveal-delay-1">
          {sent ? (
            <div className="flex min-h-[320px] flex-col items-start justify-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={22} /></div>
              <p className="eyebrow mt-7">Transmission received</p><h3 className="mt-3 text-3xl font-medium">Thanks for reaching out.</h3><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">This frontend form is ready for a backend connection. For now, your message has been staged locally.</p>
              <button type="button" onClick={() => setSent(false)} className="button-quiet focus-ring mt-7" data-testid="button-send-another">Send another <ArrowUpRight size={14} /></button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" aria-label="Contact form">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="form-field mt-2" placeholder="Your name" data-testid="input-contact-name" /></label>
                <label className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="form-field mt-2" placeholder="you@domain.com" data-testid="input-contact-email" /></label>
              </div>
              <label className="block font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Message<textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="form-field mt-2 min-h-[150px] resize-y" placeholder="What are you building?" data-testid="input-contact-message" /></label>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-5"><span className="font-mono text-[10px] text-muted-foreground">No pitch deck required.</span><button type="submit" className="button-primary focus-ring" data-testid="button-submit-contact">Send message <Send size={14} /></button></div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-frame flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">© {new Date().getFullYear()} Khalid Hawari</p>
        <div className="flex items-center gap-6"><span className="font-mono text-[10px] text-muted-foreground">Built from Jordan with intent.</span><a href="#top" className="focus-ring flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-primary" data-testid="link-back-top">Back to top <ArrowUpRight size={13} /></a></div>
      </div>
    </footer>
  );
}

function Home() {
  const [dark, setDark] = useState(() => localStorage.getItem('khalid-theme') !== 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('khalid-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <div className={`portfolio-shell site-grid ${dark ? 'dark' : ''}`}>
      <MetaTags />
      <Header dark={dark} onTheme={() => setDark((value) => !value)} menuOpen={menuOpen} onMenu={() => setMenuOpen((value) => !value)} />
      <main>
        <Hero />
        <div className="stat-strip"><div className="max-frame grid grid-cols-2 sm:grid-cols-4"><div className="stat-cell px-3 py-5 sm:px-5"><p className="font-mono text-2xl text-primary">03</p><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-muted-foreground">Featured builds</p></div><div className="stat-cell px-3 py-5 sm:px-5"><p className="font-mono text-2xl text-primary">04</p><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-muted-foreground">System layers</p></div><div className="stat-cell px-3 py-5 sm:px-5"><p className="font-mono text-2xl text-primary">01</p><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-muted-foreground">AI-900 certified</p></div><div className="stat-cell px-3 py-5 sm:px-5"><p className="font-mono text-2xl text-primary">JO</p><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-muted-foreground">Operating from Jordan</p></div></div></div>
        <About /><Skills /><Projects /><Journey /><Credentials /><Contact />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;