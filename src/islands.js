export const ISLANDS = [
  {
    id: "bio",
    title: "Bio",
    description: "A short, intentional introduction.",
    position: { xPct: 22, yPct: 58 },
    islandImage: "assets/img/island-bio.png",
    thumbnail: "assets/img/thumb-bio.jpg",
    contentSource: "assets/content/bio.html",
  },
  {
    id: "research",
    title: "Research",
    description: "Work at the intersection of CS and systems.",
    position: { xPct: 62, yPct: 40 },
    islandImage: "assets/img/island-research.png",
    thumbnail: "assets/img/thumb-research.jpg",
    contentSource: "assets/content/research.html",
  },
  {
    id: "work",
    title: "Work",
    description: "Professional experience and collaborations.",
    position: { xPct: 46, yPct: 70 },
    islandImage: "assets/img/island-work.png",
    thumbnail: "assets/img/thumb-work.jpg",
    contentSource: "assets/content/work.html",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Selected things built with care.",
    position: { xPct: 32, yPct: 36 },
    islandImage: "assets/img/island-projects.png",
    thumbnail: "assets/img/thumb-projects.jpg",
    contentSource: "assets/content/projects.html",
  },
  {
    id: "writing",
    title: "Writing",
    description: "Notes, essays, and experiments.",
    position: { xPct: 76, yPct: 66 },
    islandImage: "assets/img/island-writing.png",
    thumbnail: "assets/img/thumb-writing.jpg",
    contentSource: "assets/content/writing.html",
  },
  {
    id: "travel",
    title: "Travel",
    description: "Places that left an impression.",
    position: { xPct: 14, yPct: 32 },
    islandImage: "assets/img/island-travel.png",
    thumbnail: "assets/img/thumb-travel.jpg",
    contentSource: "assets/content/travel.html",
  },
  {
    id: "fun",
    title: "Fun",
    description: "Lightweight, playful corners of the lake.",
    position: { xPct: 84, yPct: 28 },
    islandImage: "assets/img/island-fun.png",
    thumbnail: "assets/img/thumb-fun.jpg",
    contentSource: "assets/content/fun.html",
  },
];

export function getIslandById(id) {
  return ISLANDS.find((island) => island.id === id) || null;
}

export function renderIslands(container) {
  const map = new Map();

  for (const island of ISLANDS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "island";
    btn.dataset.id = island.id;
    btn.dataset.title = island.title;
    btn.dataset.description = island.description;
    btn.dataset.image = island.islandImage;
    btn.dataset.thumb = island.thumbnail;
    btn.style.left = `${island.position.xPct}%`;
    btn.style.top = `${island.position.yPct}%`;
    btn.setAttribute(
      "aria-label",
      `${island.title} — ${island.description}`
    );

    container.appendChild(btn);
    map.set(island.id, btn);
  }

  return map;
}

