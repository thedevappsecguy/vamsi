export const focusYear = new Date().getFullYear();

export const focusAreas = [
  "Application Security",
  "AI/ML Security",
  "DevSecOps",
  "Threat Modeling",
];

export const profileIntro =
  "Turning security requirements into practical product and platform capabilities.";

type ProfilePointSegment = {
  text: string;
  href?: string;
};

export const profilePoints: ProfilePointSegment[][] = [
  [
    {
      text: "Guide product security decisions across the lifecycle - from architecture and threat modeling to vulnerability response and release readiness.",
    },
  ],
  [
    {
      text: "Build scalable controls, paved roads, automation, and tooling that engineering teams can adopt by default.",
    },
  ],
  [
    { text: "Lead security for AI-powered features and " },
    { text: "agentic workflows", href: "notes/kaggle-agent-security-postmortem/" },
    {
      text: " across secure design, guardrails, tool-use controls, threat detection, logging, and security observability.",
    },
  ],
];

export const projects = [
  {
    slug: "skill-scanner",
    name: "skill-scanner",
    kind: "CLI",
    blurb:
      "Security scanner for AI skills and instruction files across agentic workflows. Uses multiple LLMs plus VirusTotal to flag prompt injection, data-exfil patterns, and suspicious capability escalations.",
    tags: ["Python", "CLI", "AI Security", "Agents", "Multi-LLM", "VirusTotal"],
    install: "pip install skill-scanner",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/thedevappsecguy/skill-scanner",
      },
      {
        label: "PyPI",
        href: "https://pypi.org/project/skill-scanner/",
      },
    ],
  },
  {
    slug: "sec-skills",
    name: "sec-skills",
    kind: "Skills",
    blurb:
      "Shared AI agent skills repository for the agentic coding workflows I use day-to-day. Battle-tested prompts, guardrails, and review checklists for Claude, Cursor, and Codex.",
    tags: ["AI Agents", "Skills", "Claude", "Cursor", "Codex", "Agentic"],
    install: "git clone https://github.com/thedevappsecguy/sec-skills",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/thedevappsecguy/sec-skills",
      },
    ],
  },
  {
    slug: "safe-packages",
    name: "safe-packages",
    kind: "CLI",
    blurb:
      "A CLI tool to scan dependencies for vulnerabilities and flag potentially compromised packages. Supply chain security for cautious teams - OSV-backed with heuristics for typosquats and sudden maintainer changes.",
    tags: ["Python", "CLI", "Security", "OSV", "Supply Chain"],
    install: "pip install safe-packages",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/thedevappsecguy/safe-packages",
      },
      {
        label: "PyPI",
        href: "https://pypi.org/project/safe-packages/",
      },
    ],
  },
];

export const socialLinks = [
  {
    label: "GitHub",
    sub: "Source code & projects",
    href: "https://github.com/thedevappsecguy",
  },
  {
    label: "LinkedIn",
    sub: "Professional network",
    href: "https://www.linkedin.com/in/vamsi-krishna-bonam/",
  },
  {
    label: "Credly",
    sub: "Verified certifications",
    href: "https://www.credly.com/users/vamsikrishnabonam/",
  },
];
