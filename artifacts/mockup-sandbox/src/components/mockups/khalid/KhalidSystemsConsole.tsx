import { useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  ExternalLink,
  Layers3,
  Menu,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Project = {
  id: string;
  number: string;
  name: string;
  type: string;
  signal: string;
  accent: string;
  summary: string;
  tags: string[];
  metrics: { label: string; value: string; progress: number }[];
  architecture: string[];
  notes: string;
};

const PROJECTS: Project[] = [
  {
    id: "striker",
    number: "01",
    name: "Striker X",
    type: "Autonomous humanoid platform",
    signal: "ACTIVE BUILD",
    accent: "#e87854",
    summary:
      "A competition-minded humanoid robot that turns camera input into controlled action.",
    tags: ["ROS 2", "Python", "Vision", "Gazebo"],
    metrics: [
      { label: "Perception", value: "92.4%", progress: 92 },
      { label: "Loop latency", value: "18 ms", progress: 74 },
      { label: "Sim coverage", value: "64.8%", progress: 65 },
    ],
    architecture: ["Camera", "Perception", "Behaviour", "Actuators"],
    notes:
      "The active question is not whether it can see. It is whether the behaviour layer can stay decisive when the world moves first.",
  },
  {
    id: "amr",
    number: "02",
    name: "Atlas AMR",
    type: "Navigation & mapping system",
    signal: "FIELD TEST",
    accent: "#7fc6b0",
    summary:
      "A mobile stack for mapping an unknown space, planning a route, and recovering safely.",
    tags: ["SLAM", "Nav2", "LiDAR", "TF2"],
    metrics: [
      { label: "Map confidence", value: "98.4%", progress: 98 },
      { label: "Route solve", value: "1.6 s", progress: 81 },
      { label: "Recovery rate", value: "87.2%", progress: 87 },
    ],
    architecture: ["LiDAR", "SLAM", "Planner", "Recovery"],
    notes:
      "The interesting work lives at the seams: sensor fusion, map quality, and the moment real space disagrees with the plan.",
  },
  {
    id: "balance",
    number: "03",
    name: "Balance-01",
    type: "Embedded control study",
    signal: "TUNING",
    accent: "#d1a35a",
    summary:
      "A two-wheel platform where feedback, tuning, and fast iteration become physical stability.",
    tags: ["C++", "IMU", "PID", "Embedded"],
    metrics: [
      { label: "Angle error", value: "0.018°", progress: 96 },
      { label: "Control rate", value: "240 Hz", progress: 89 },
      { label: "Battery window", value: "4.2 h", progress: 72 },
    ],
    architecture: ["IMU", "Filter", "PID", "Motor"],
    notes:
      "Small errors compound quickly on two wheels. This loop is a study in making invisible corrections visible, measurable, and repeatable.",
  },
];

const FOCUS_COPY: Record<string, string> = {
  Perceive: "Sensors turn a moving environment into a stream the system can reason about.",
  Decide: "The behaviour layer gives noisy observations a next action and a reason to take it.",
  Act: "Commands leave the model here: motors, timing, friction, and the real world answer back.",
};

export function KhalidSystemsConsole() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [focus, setFocus] = useState("Perceive");
  const [activeTab, setActiveTab] = useState("Workbench");
  const [dossierOpen, setDossierOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const activeProject = PROJECTS.find((project) => project.id === activeId) ?? PROJECTS[0];

  const selectProject = (id: string) => {
    setActiveId(id);
    setFocus("Perceive");
    setDossierOpen(false);
    setSent(false);
  };

  return (
    <div className={`kh-console ${quietMode ? "kh-console-quiet" : ""}`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      <style>{`
        .kh-console {
          --kh-bg: #091216;
          --kh-bg-deep: #060c0f;
          --kh-panel: #0e1b20;
          --kh-panel-raised: #12242a;
          --kh-line: rgba(158, 198, 194, .16);
          --kh-line-strong: rgba(158, 198, 194, .31);
          --kh-text: #e9f0e9;
          --kh-muted: #8ba19f;
          --kh-soft: #b8c6bf;
          --kh-accent: #e87854;
          --kh-mint: #7fc6b0;
          width: 100%;
          min-height: 100dvh;
          overflow: hidden;
          color: var(--kh-text);
          background:
            radial-gradient(circle at 78% 10%, rgba(127, 198, 176, .10), transparent 30%),
            radial-gradient(circle at 8% 92%, rgba(232, 120, 84, .07), transparent 27%),
            var(--kh-bg);
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        }
        .kh-console-quiet {
          --kh-bg: #e7e9e2;
          --kh-bg-deep: #d7ddd6;
          --kh-panel: #f0f1eb;
          --kh-panel-raised: #f8f8f2;
          --kh-line: rgba(32, 55, 52, .16);
          --kh-line-strong: rgba(32, 55, 52, .34);
          --kh-text: #19302e;
          --kh-muted: #607470;
          --kh-soft: #3f5d58;
          --kh-accent: #bb5b3d;
          --kh-mint: #287e70;
          background: var(--kh-bg);
        }
        .kh-console *, .kh-console *::before, .kh-console *::after { box-sizing: border-box; }
        .kh-console button, .kh-console a, .kh-console input, .kh-console textarea { font: inherit; }
        .kh-console button, .kh-console a { -webkit-tap-highlight-color: transparent; }
        .kh-console button { cursor: pointer; }
        .kh-mono { font-family: "DM Mono", ui-monospace, monospace; }
        .kh-shell {
          width: min(1440px, calc(100% - 56px));
          margin: 0 auto;
        }
        .kh-topbar {
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid var(--kh-line);
        }
        .kh-brand { display: flex; align-items: center; gap: 12px; min-width: 230px; }
        .kh-brand-mark {
          width: 31px; height: 31px; display: grid; place-items: center;
          border: 1px solid var(--kh-accent); color: var(--kh-accent);
          font: 500 10px/1 "DM Mono", monospace; letter-spacing: .08em;
        }
        .kh-brand-name { font-size: 11px; letter-spacing: .19em; font-weight: 600; }
        .kh-brand-name span { color: var(--kh-accent); }
        .kh-nav { display: flex; align-self: stretch; align-items: stretch; gap: 25px; }
        .kh-nav-button {
          position: relative; border: 0; background: transparent; color: var(--kh-muted);
          font: 10px/1 "DM Mono", monospace; letter-spacing: .14em; text-transform: uppercase;
        }
        .kh-nav-button:hover, .kh-nav-button.kh-active { color: var(--kh-text); }
        .kh-nav-button.kh-active::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--kh-accent);
        }
        .kh-top-actions { display: flex; align-items: center; gap: 9px; }
        .kh-status {
          display: flex; align-items: center; gap: 7px; padding: 8px 10px;
          color: var(--kh-mint); font: 9px/1 "DM Mono", monospace; letter-spacing: .12em;
          border: 1px solid var(--kh-line);
        }
        .kh-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kh-mint); box-shadow: 0 0 12px var(--kh-mint); }
        .kh-icon-button {
          width: 34px; height: 34px; display: grid; place-items: center;
          color: var(--kh-muted); border: 1px solid var(--kh-line); background: transparent;
        }
        .kh-icon-button:hover { border-color: var(--kh-accent); color: var(--kh-accent); }
        .kh-menu-button { display: none; }
        .kh-kicker {
          color: var(--kh-accent); font: 10px/1.4 "DM Mono", monospace;
          letter-spacing: .19em; text-transform: uppercase;
        }
        .kh-heading { margin: 0; font-size: clamp(32px, 4vw, 62px); line-height: .97; font-weight: 500; letter-spacing: -.065em; }
        .kh-subtle { color: var(--kh-muted); }
        .kh-hero {
          display: flex; align-items: end; justify-content: space-between; gap: 28px;
          padding: 59px 0 43px;
        }
        .kh-hero-copy { max-width: 740px; }
        .kh-hero-copy .kh-kicker { margin-bottom: 18px; }
        .kh-hero-copy p { max-width: 610px; margin: 18px 0 0; color: var(--kh-muted); font-size: 14px; line-height: 1.7; }
        .kh-hero-meta { display: flex; align-items: end; gap: 27px; padding-bottom: 4px; }
        .kh-meta-item { text-align: right; }
        .kh-meta-value { display: block; color: var(--kh-text); font: 18px/1 "DM Mono", monospace; }
        .kh-meta-label { display: block; margin-top: 8px; color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
        .kh-workbench {
          display: grid; grid-template-columns: 266px minmax(0, 1fr) 256px;
          min-height: 536px; border: 1px solid var(--kh-line); background: rgba(8, 18, 22, .42);
        }
        .kh-console-quiet .kh-workbench { background: rgba(255,255,255,.21); }
        .kh-queue { border-right: 1px solid var(--kh-line); }
        .kh-pane-heading {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          min-height: 54px; padding: 0 18px; border-bottom: 1px solid var(--kh-line);
          color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .16em; text-transform: uppercase;
        }
        .kh-pane-heading strong { color: var(--kh-text); font-weight: 400; }
        .kh-count { color: var(--kh-accent); }
        .kh-project-button {
          position: relative; width: 100%; padding: 17px 18px 18px; text-align: left;
          color: var(--kh-text); border: 0; border-bottom: 1px solid var(--kh-line); background: transparent;
          transition: background-color .2s ease, transform .2s ease;
        }
        .kh-project-button:hover { background: rgba(127,198,176,.06); }
        .kh-project-button.kh-selected { background: var(--kh-panel-raised); }
        .kh-project-button.kh-selected::before {
          content: ""; position: absolute; left: -1px; top: 0; bottom: 0; width: 2px; background: var(--kh-accent);
        }
        .kh-project-top { display: flex; justify-content: space-between; gap: 10px; }
        .kh-project-number { color: var(--kh-accent); font: 10px/1 "DM Mono", monospace; }
        .kh-project-signal { color: var(--kh-muted); font: 8px/1 "DM Mono", monospace; letter-spacing: .09em; }
        .kh-project-name { margin-top: 11px; font-size: 17px; font-weight: 500; letter-spacing: -.03em; }
        .kh-project-type { margin-top: 5px; color: var(--kh-muted); font-size: 11px; line-height: 1.35; }
        .kh-project-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 15px; }
        .kh-tag { padding: 4px 6px; color: var(--kh-soft); border: 1px solid var(--kh-line); font: 8px/1 "DM Mono", monospace; }
        .kh-main-panel { min-width: 0; padding: 32px 37px 29px; }
        .kh-detail-top { display: flex; align-items: start; justify-content: space-between; gap: 20px; }
        .kh-detail-label { display: flex; align-items: center; gap: 8px; color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .12em; text-transform: uppercase; }
        .kh-detail-label svg { color: var(--kh-accent); }
        .kh-detail-id { color: var(--kh-muted); font: 10px/1 "DM Mono", monospace; }
        .kh-main-title { margin: 25px 0 0; font-size: clamp(34px, 4vw, 56px); line-height: .97; letter-spacing: -.065em; font-weight: 500; }
        .kh-main-type { margin-top: 11px; color: var(--kh-accent); font: 10px/1.4 "DM Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
        .kh-main-summary { max-width: 560px; margin: 19px 0 0; color: var(--kh-soft); font-size: 14px; line-height: 1.65; }
        .kh-architecture { margin-top: 39px; }
        .kh-section-label { display: flex; align-items: center; justify-content: space-between; color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .15em; text-transform: uppercase; }
        .kh-section-label span:last-child { color: var(--kh-accent); }
        .kh-loop { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 18px; }
        .kh-loop-button {
          position: relative; min-height: 73px; padding: 13px 12px; text-align: left; color: var(--kh-muted);
          border: 1px solid var(--kh-line); border-right: 0; background: var(--kh-panel); transition: color .2s ease, background-color .2s ease, border-color .2s ease;
        }
        .kh-loop-button:last-child { border-right: 1px solid var(--kh-line); }
        .kh-loop-button:hover, .kh-loop-button.kh-loop-active { color: var(--kh-text); background: var(--kh-panel-raised); border-color: var(--kh-accent); z-index: 1; }
        .kh-loop-button::after { content: "→"; position: absolute; right: 11px; bottom: 10px; color: var(--kh-line-strong); font: 13px/1 "DM Mono", monospace; }
        .kh-loop-button.kh-loop-active::after { color: var(--kh-accent); }
        .kh-loop-step { display: block; color: var(--kh-accent); font: 9px/1 "DM Mono", monospace; }
        .kh-loop-name { display: block; margin-top: 9px; font-size: 12px; font-weight: 500; }
        .kh-focus-note { min-height: 51px; margin-top: 14px; padding: 12px 14px; border-left: 2px solid var(--kh-accent); background: rgba(232,120,84,.055); color: var(--kh-muted); font-size: 11px; line-height: 1.55; }
        .kh-detail-footer { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 27px; padding-top: 17px; border-top: 1px solid var(--kh-line); }
        .kh-detail-footer span { color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .1em; }
        .kh-dossier-button {
          display: inline-flex; align-items: center; gap: 9px; padding: 9px 12px; color: var(--kh-text);
          border: 1px solid var(--kh-line-strong); background: transparent; font: 9px/1 "DM Mono", monospace; letter-spacing: .11em; text-transform: uppercase;
        }
        .kh-dossier-button:hover { color: var(--kh-accent); border-color: var(--kh-accent); }
        .kh-telemetry { border-left: 1px solid var(--kh-line); }
        .kh-telemetry-body { padding: 25px 18px 20px; }
        .kh-live-card { padding: 14px 13px; border: 1px solid var(--kh-line); background: var(--kh-panel); }
        .kh-live-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .kh-live-title { color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .kh-live-state { color: var(--kh-mint); font: 8px/1 "DM Mono", monospace; letter-spacing: .1em; }
        .kh-wave { display: flex; align-items: center; gap: 3px; height: 30px; margin-top: 15px; }
        .kh-wave i { display: block; flex: 1; min-width: 2px; background: var(--kh-mint); opacity: .62; animation: kh-wave 1.9s ease-in-out infinite alternate; }
        .kh-wave i:nth-child(1) { height: 9px; animation-delay: -.4s; }.kh-wave i:nth-child(2) { height: 20px; animation-delay: -.9s; }.kh-wave i:nth-child(3) { height: 13px; animation-delay: -.2s; }.kh-wave i:nth-child(4) { height: 25px; animation-delay: -.7s; }.kh-wave i:nth-child(5) { height: 16px; animation-delay: -.3s; }.kh-wave i:nth-child(6) { height: 28px; animation-delay: -1.2s; }.kh-wave i:nth-child(7) { height: 12px; animation-delay: -.5s; }.kh-wave i:nth-child(8) { height: 22px; animation-delay: -.8s; }.kh-wave i:nth-child(9) { height: 10px; animation-delay: -.1s; }
        @keyframes kh-wave { to { transform: scaleY(.48); opacity: .3; } }
        .kh-metric-list { margin-top: 25px; }
        .kh-metric { margin-top: 17px; }
        .kh-metric:first-child { margin-top: 0; }
        .kh-metric-row { display: flex; justify-content: space-between; gap: 10px; color: var(--kh-muted); font: 9px/1 "DM Mono", monospace; }
        .kh-metric-row strong { color: var(--kh-text); font-weight: 400; }
        .kh-metric-track { height: 3px; margin-top: 9px; overflow: hidden; background: var(--kh-line); }
        .kh-metric-fill { height: 100%; background: var(--kh-accent); transform-origin: left; }
        .kh-telemetry-foot { display: flex; align-items: center; gap: 8px; margin-top: 27px; color: var(--kh-muted); font: 9px/1.4 "DM Mono", monospace; }
        .kh-telemetry-foot svg { color: var(--kh-mint); }
        .kh-dossier { margin-top: 14px; padding: 14px; border: 1px solid var(--kh-line); background: var(--kh-panel); animation: kh-reveal .25s ease both; }
        .kh-dossier p { margin: 9px 0 0; color: var(--kh-muted); font-size: 11px; line-height: 1.6; }
        .kh-dossier .kh-mono { color: var(--kh-accent); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
        @keyframes kh-reveal { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .kh-bottom-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; margin-top: 18px; padding-bottom: 44px; }
        .kh-bottom-card { min-height: 132px; padding: 19px 20px; border: 1px solid var(--kh-line); background: rgba(14,27,32,.62); }
        .kh-console-quiet .kh-bottom-card { background: rgba(255,255,255,.22); }
        .kh-bottom-card p { margin: 12px 0 0; max-width: 620px; color: var(--kh-muted); font-size: 12px; line-height: 1.55; }
        .kh-notes-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 11px; margin-top: 14px; }
        .kh-note-pill { min-height: 50px; padding: 10px; border-left: 1px solid var(--kh-accent); background: var(--kh-panel); color: var(--kh-soft); font-size: 11px; line-height: 1.35; }
        .kh-channel-button { display: inline-flex; align-items: center; gap: 9px; margin-top: 15px; padding: 9px 12px; border: 1px solid var(--kh-line-strong); background: transparent; color: var(--kh-text); font: 9px/1 "DM Mono", monospace; letter-spacing: .11em; text-transform: uppercase; }
        .kh-channel-button:hover { color: var(--kh-accent); border-color: var(--kh-accent); }
        .kh-channel { margin: 18px auto 46px; padding: 22px; border: 1px solid var(--kh-accent); background: var(--kh-panel); animation: kh-reveal .25s ease both; }
        .kh-channel-head { display: flex; justify-content: space-between; gap: 12px; }
        .kh-channel h3 { margin: 8px 0 0; font-size: 21px; font-weight: 500; letter-spacing: -.04em; }
        .kh-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
        .kh-field { width: 100%; border: 1px solid var(--kh-line); background: var(--kh-bg); color: var(--kh-text); padding: 11px 12px; outline: none; font: 11px/1.3 "DM Mono", monospace; }
        .kh-field:focus { border-color: var(--kh-accent); }
        .kh-field::placeholder { color: var(--kh-muted); }
        .kh-field-wide { grid-column: 1 / -1; min-height: 74px; resize: vertical; }
        .kh-form-submit { justify-self: end; display: inline-flex; align-items: center; gap: 8px; padding: 10px 13px; border: 1px solid var(--kh-accent); background: var(--kh-accent); color: #1e1410; font: 9px/1 "DM Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
        .kh-sent { display: flex; align-items: center; gap: 9px; margin-top: 18px; color: var(--kh-mint); font: 11px/1.4 "DM Mono", monospace; }
        .kh-focus-ring:focus-visible { outline: 2px solid var(--kh-accent); outline-offset: 4px; }
        @media (max-width: 1100px) {
          .kh-workbench { grid-template-columns: 224px minmax(0, 1fr); }
          .kh-telemetry { grid-column: 1 / -1; border-top: 1px solid var(--kh-line); border-left: 0; }
          .kh-telemetry-body { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
          .kh-metric-list { margin-top: 0; }
          .kh-telemetry-foot { margin-top: 0; }
        }
        @media (max-width: 760px) {
          .kh-shell { width: min(100% - 28px, 1440px); }
          .kh-topbar { min-height: 64px; }
          .kh-brand { min-width: 0; }
          .kh-brand-name { font-size: 9px; }
          .kh-nav { display: none; }
          .kh-menu-button { display: grid; }
          .kh-status { display: none; }
          .kh-hero { display: block; padding: 37px 0 31px; }
          .kh-heading { font-size: 42px; }
          .kh-hero-meta { justify-content: start; margin-top: 26px; }
          .kh-meta-item { text-align: left; }
          .kh-workbench { display: block; }
          .kh-queue { border-right: 0; border-bottom: 1px solid var(--kh-line); }
          .kh-project-button { display: inline-block; width: 33.333%; padding: 14px 10px 15px; vertical-align: top; border-bottom: 0; border-right: 1px solid var(--kh-line); }
          .kh-project-button:last-child { border-right: 0; }
          .kh-project-button.kh-selected::before { left: 0; right: 0; top: auto; bottom: -1px; width: auto; height: 2px; }
          .kh-project-signal, .kh-project-type, .kh-project-tags { display: none; }
          .kh-project-name { margin-top: 10px; font-size: 13px; white-space: nowrap; }
          .kh-main-panel { padding: 25px 17px 22px; }
          .kh-main-title { font-size: 41px; }
          .kh-loop { grid-template-columns: repeat(2, 1fr); }
          .kh-loop-button { border-right: 1px solid var(--kh-line); }
          .kh-loop-button:nth-child(-n+2) { border-bottom: 0; }
          .kh-detail-footer { align-items: start; flex-direction: column; }
          .kh-telemetry { border-top: 1px solid var(--kh-line); }
          .kh-telemetry-body { display: block; padding: 20px 17px; }
          .kh-metric-list { margin-top: 22px; }
          .kh-telemetry-foot { margin-top: 23px; }
          .kh-bottom-grid { display: block; margin-top: 13px; }
          .kh-bottom-card + .kh-bottom-card { margin-top: 13px; }
          .kh-notes-list { grid-template-columns: 1fr; }
          .kh-form { grid-template-columns: 1fr; }
          .kh-field-wide { grid-column: auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kh-console *, .kh-console *::before, .kh-console *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="kh-shell">
        <header className="kh-topbar">
          <div className="kh-brand">
            <span className="kh-brand-mark">KH</span>
            <span className="kh-brand-name">KHALID<span>/</span>HAWARI</span>
          </div>
          <nav className="kh-nav" aria-label="Console sections">
            {["Workbench", "Systems", "Field notes"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`kh-nav-button kh-focus-ring ${activeTab === tab ? "kh-active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="kh-top-actions">
            <div className="kh-status"><span className="kh-status-dot" /> systems online</div>
            <button
              type="button"
              onClick={() => setQuietMode((value) => !value)}
              className="kh-icon-button kh-focus-ring"
              aria-label={quietMode ? "Switch to dark console" : "Switch to quiet mode"}
              title={quietMode ? "Switch to dark console" : "Switch to quiet mode"}
            >
              {quietMode ? <Sparkles size={15} /> : <CircleDot size={15} />}
            </button>
            <button type="button" onClick={() => setChannelOpen((value) => !value)} className="kh-icon-button kh-menu-button kh-focus-ring" aria-label="Open contact channel">
              {channelOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </header>

        <section className="kh-hero">
          <div className="kh-hero-copy">
            <div className="kh-kicker">AI & robotics engineering / Jordan</div>
            <h1 className="kh-heading">A workbench for machines<br />that <span style={{ color: "var(--kh-accent)" }}>make decisions.</span></h1>
            <p>Skip the scroll. Open a system, trace its decision loop, and see where software meets sensors, motors, latency, and the stubbornness of the real world.</p>
          </div>
          <div className="kh-hero-meta">
            <div className="kh-meta-item"><span className="kh-meta-value">03</span><span className="kh-meta-label">active systems</span></div>
            <div className="kh-meta-item"><span className="kh-meta-value">04</span><span className="kh-meta-label">core layers</span></div>
            <div className="kh-meta-item"><span className="kh-meta-value">JO</span><span className="kh-meta-label">operating from</span></div>
          </div>
        </section>

        <main>
          <section className="kh-workbench" aria-label="Project workbench">
            <aside className="kh-queue">
              <div className="kh-pane-heading"><strong>Mission queue</strong><span className="kh-count">03</span></div>
              {PROJECTS.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  className={`kh-project-button kh-focus-ring ${project.id === activeId ? "kh-selected" : ""}`}
                  aria-pressed={project.id === activeId}
                >
                  <div className="kh-project-top"><span className="kh-project-number">{project.number}</span><span className="kh-project-signal">{project.signal}</span></div>
                  <div className="kh-project-name">{project.name}</div>
                  <div className="kh-project-type">{project.type}</div>
                  <div className="kh-project-tags">{project.tags.map((tag) => <span key={tag} className="kh-tag">{tag}</span>)}</div>
                </button>
              ))}
            </aside>

            <article className="kh-main-panel">
              <div className="kh-detail-top">
                <div className="kh-detail-label"><Radio size={13} /> field note / {activeProject.number}</div>
                <span className="kh-detail-id">SYS.{activeProject.number} / 2024—25</span>
              </div>
              <h2 className="kh-main-title">{activeProject.name}</h2>
              <div className="kh-main-type">{activeProject.type}</div>
              <p className="kh-main-summary">{activeProject.summary}</p>

              <div className="kh-architecture">
                <div className="kh-section-label"><span>Decision loop</span><span>observe / decide / act</span></div>
                <div className="kh-loop">
                  {activeProject.architecture.map((node, index) => (
                    <button
                      type="button"
                      key={node}
                      className={`kh-loop-button kh-focus-ring ${focus === (index === 1 ? "Perceive" : index === 2 ? "Decide" : index === 3 ? "Act" : "") ? "kh-loop-active" : ""}`}
                      onClick={() => setFocus(index === 1 ? "Perceive" : index === 2 ? "Decide" : index === 3 ? "Act" : "Perceive")}
                    >
                      <span className="kh-loop-step">0{index + 1}</span>
                      <span className="kh-loop-name">{node}</span>
                    </button>
                  ))}
                </div>
                <div className="kh-focus-note"><span className="kh-mono" style={{ color: "var(--kh-accent)", marginRight: 8 }}>{focus.toUpperCase()} /</span>{FOCUS_COPY[focus]}</div>
              </div>

              <div className="kh-detail-footer">
                <span><Layers3 size={12} style={{ verticalAlign: "middle", marginRight: 7 }} /> stack / ROS 2 · embedded · simulation</span>
                <button type="button" onClick={() => setDossierOpen((value) => !value)} className="kh-dossier-button kh-focus-ring">
                  {dossierOpen ? "Close dossier" : "Open dossier"} <ChevronRight size={13} style={{ transform: dossierOpen ? "rotate(90deg)" : undefined }} />
                </button>
              </div>
              {dossierOpen && <div className="kh-dossier"><span className="kh-mono">Technical brief</span><p>{activeProject.notes}</p></div>}
            </article>

            <aside className="kh-telemetry">
              <div className="kh-pane-heading"><strong>Live telemetry</strong><span className="kh-count">01</span></div>
              <div className="kh-telemetry-body">
                <div className="kh-live-card">
                  <div className="kh-live-head"><span className="kh-live-title">signal stream</span><span className="kh-live-state">nominal</span></div>
                  <div className="kh-wave" aria-label="Live signal visualization">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>
                </div>
                <div className="kh-metric-list">
                  {activeProject.metrics.map((metric) => (
                    <div className="kh-metric" key={metric.label}>
                      <div className="kh-metric-row"><span>{metric.label}</span><strong>{metric.value}</strong></div>
                      <div className="kh-metric-track"><div className="kh-metric-fill" style={{ width: `${metric.progress}%`, background: activeProject.accent }} /></div>
                    </div>
                  ))}
                </div>
                <div className="kh-telemetry-foot"><ShieldCheck size={14} /> simulation-ready / hardware next</div>
              </div>
            </aside>
          </section>

          <section className="kh-bottom-grid" aria-label="Notes and contact">
            <div className="kh-bottom-card">
              <div className="kh-section-label"><span>Selected field notes</span><span>{activeTab.toLowerCase()}</span></div>
              <div className="kh-notes-list">
                <div className="kh-note-pill">Build from first principles.</div>
                <div className="kh-note-pill">Validate quickly in simulation.</div>
                <div className="kh-note-pill">Let hardware disagree early.</div>
              </div>
            </div>
            <div className="kh-bottom-card">
              <div className="kh-section-label"><span>Open channel</span><span>available</span></div>
              <p>Internships, research, competitions, and difficult problems about robots that should exist.</p>
              <button type="button" onClick={() => setChannelOpen((value) => !value)} className="kh-channel-button kh-focus-ring">{channelOpen ? "Close channel" : "Start a conversation"} <ArrowUpRight size={13} /></button>
            </div>
          </section>

          {channelOpen && (
            <section className="kh-channel" aria-label="Contact form">
              <div className="kh-channel-head">
                <div><div className="kh-kicker">Transmission / open channel</div><h3>Have a hard problem?</h3></div>
                <button type="button" onClick={() => setChannelOpen(false)} className="kh-icon-button kh-focus-ring" aria-label="Close contact form"><X size={15} /></button>
              </div>
              {sent ? (
                <div className="kh-sent"><CircleDot size={15} /> Transmission staged locally. Khalid will have the signal.</div>
              ) : (
                <form className="kh-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
                  <input className="kh-field kh-focus-ring" required placeholder="Your name" aria-label="Your name" />
                  <input className="kh-field kh-focus-ring" required type="email" placeholder="you@domain.com" aria-label="Your email" />
                  <textarea className="kh-field kh-field-wide kh-focus-ring" required placeholder="What are you building?" aria-label="Your message" />
                  <button type="submit" className="kh-form-submit kh-focus-ring">Send message <Send size={13} /></button>
                </form>
              )}
            </section>
          )}
        </main>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 18, padding: "0 0 25px", color: "var(--kh-muted)", font: "9px/1.4 'DM Mono', monospace", letterSpacing: ".12em", textTransform: "uppercase" }}>
          <span>Built from Jordan with intent.</span>
          <a className="kh-focus-ring" href="https://github.com/khalidhawari" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--kh-muted)", textDecoration: "none" }}>GitHub / field activity <ExternalLink size={11} /></a>
        </footer>
      </div>
    </div>
  );
}

export default KhalidSystemsConsole;