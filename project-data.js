(function (root, factory) {
  const portfolio = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = portfolio;
  }

  root.DAISY_PORTFOLIO = portfolio.DAISY_PORTFOLIO;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const placeholderImage = "assets/work/snowbreak-poster.jpg";

  const DAISY_PORTFOLIO = {
    owner: {
      name: "Daisy",
      title: "Technical Artist / Realtime Visual Maker",
      summary:
        "Realtime visual maker focused on production-ready effects, procedural workflows, and art-directed rendering for games and interactive media.",
      email: "bigorangeyong@gmail.com",
    },
    background: {
      src: "assets/interior-room-reference.png",
      alt: "Pixel-art inspired interior room reference with warm practical light and portfolio desk details.",
    },
    categories: [
      { id: "commercial", label: "Commercial" },
      { id: "personal", label: "Personal" },
      { id: "breakdown", label: "Breakdown" },
      { id: "research", label: "Research" },
      { id: "about", label: "About" },
    ],
    items: [
      {
        id: "snowbreak-production",
        title: "Snowbreak Production Effects",
        category: "commercial",
        year: "2025",
        role: "Technical Artist",
        summary:
          "Production-facing realtime VFX work for high-readability combat moments, balancing authored timing with engine constraints.",
        thumbnail: placeholderImage,
        tags: ["Realtime VFX", "Production", "Optimization"],
        media: [
          {
            type: "video",
            src: "assets/work/snowbreak-reel.mp4",
            poster: placeholderImage,
            alt: "Snowbreak realtime effects production reel.",
          },
        ],
        technicalPoints: [
          "Tuned particle timing and material response for clear player feedback.",
          "Balanced overdraw, texture usage, and spawn density for runtime performance.",
          "Prepared reusable effect setups that could be iterated quickly with art direction.",
        ],
      },
      {
        id: "houdini-procedural-workflow",
        title: "Houdini Procedural Workflow",
        category: "research",
        year: "2024",
        role: "Technical Artist / Procedural Tooling",
        summary:
          "A procedural study for generating reusable environment and effect-support assets with predictable art controls.",
        thumbnail: placeholderImage,
        tags: ["Houdini", "Procedural", "Tool Design"],
        media: [
          {
            type: "image",
            src: placeholderImage,
            alt: "Placeholder preview for Houdini procedural workflow research.",
          },
        ],
        technicalPoints: [
          "Built parameterized controls for shape variation and repeatable asset output.",
          "Organized node networks around artist-facing inputs and deterministic export steps.",
          "Documented handoff notes for engine import, scale checks, and material assignment.",
        ],
      },
      {
        id: "niagara-vfx-study",
        title: "Niagara VFX Study",
        category: "breakdown",
        year: "2024",
        role: "Realtime VFX Artist",
        summary:
          "A breakdown-oriented Niagara study exploring layered motion, material modulation, and timing hierarchy.",
        thumbnail: placeholderImage,
        tags: ["Niagara", "VFX Breakdown", "Shaders"],
        media: [
          {
            type: "image",
            src: placeholderImage,
            alt: "Placeholder preview for Niagara VFX study breakdown.",
          },
        ],
        technicalPoints: [
          "Separated primary, secondary, and detail emitters for readable effect staging.",
          "Used material parameters to drive color, dissolve, and soft edge transitions.",
          "Profiled emitter counts and bounds to keep the setup practical for realtime scenes.",
        ],
      },
      {
        id: "water-lookdev",
        title: "Water Lookdev",
        category: "personal",
        year: "2024",
        role: "Look Development Artist",
        summary:
          "Personal realtime water lookdev focused on surface readability, stylized motion, and compact shader controls.",
        thumbnail: placeholderImage,
        tags: ["Water", "Lookdev", "Materials"],
        media: [
          {
            type: "image",
            src: placeholderImage,
            alt: "Placeholder preview for realtime water lookdev.",
          },
        ],
        technicalPoints: [
          "Layered normal detail and flow direction controls for stylized surface motion.",
          "Tested color absorption, foam masks, and glancing highlights under varied lighting.",
          "Kept shader parameters grouped for fast visual iteration inside the editor.",
        ],
      },
      {
        id: "production-pipeline-notes",
        title: "Production Pipeline Notes",
        category: "commercial",
        year: "2023",
        role: "Pipeline-Focused Technical Artist",
        summary:
          "A compact production notes archive covering naming, review handoff, optimization checks, and reusable setup patterns.",
        thumbnail: placeholderImage,
        tags: ["Pipeline", "Documentation", "Optimization"],
        media: [
          {
            type: "image",
            src: placeholderImage,
            alt: "Placeholder preview for production pipeline notes.",
          },
        ],
        technicalPoints: [
          "Collected repeatable checklist items for asset naming, folder structure, and review prep.",
          "Recorded performance notes for texture sizes, draw calls, and effect complexity.",
          "Outlined handoff conventions that reduce friction between art, tech art, and implementation.",
        ],
      },
    ],
  };

  return { DAISY_PORTFOLIO };
});
