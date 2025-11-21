export type Project = {
  name: string;
  url: string;
  description?: string;
  tags?: string[];
  repo?: string;
};

export const projects: Project[] = [
  {
    name: "pos.cabeda.dev",
    url: "https://pos.cabeda.dev/",
    description: "Personal open-source projects index and playground.",
    repo: "https://github.com/cabeda/pos-mobile",
    tags: ["web", "tools", "index"],
  },
  {
    name: "tr.cabeda.dev",
    url: "https://tr.cabeda.dev/",
    description: "Tiny experiments and utility demos.",
    repo: "https://github.com/cabeda/team-randomizer",
    tags: ["experiments", "playground"],
  },
  {
      name: "data-impostor (this site)",
      url: "/",
      description: "Notes, blog and slides built with Astro.",
      repo: "https://github.com/cabeda/data-impostor",
    tags: ["blog", "astro"],
  },
  {
    name: "ChristmasSorter",
    url: "https://christmas-sorter.vercel.app",
    description: "An interactive Christmas sorting demo/game.",
    repo: "https://github.com/Cabeda/ChristmasSorter#",
    tags: ["game", "demo"],
  },
  {
    name: "audio-gen.cabeda.dev",
    url: "https://audio-gen.cabeda.dev/",
    description: "Audiobook app — text-to-speech pipeline and UI using Kokoro TTS.",
    repo: "https://github.com/Cabeda/audiobook-generator",
    tags: ["audio", "tts", "demo"],
  },
];

export default projects;
