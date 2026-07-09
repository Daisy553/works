(function (root, factory) {
  const portfolio = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = portfolio;
  }

  root.DAISY_PORTFOLIO = portfolio.DAISY_PORTFOLIO;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const placeholderImage = "assets/work/snowbreak-poster.jpg";
  const avatarImage = "assets/work/zhiyong-avatar.png";

  const DAISY_PORTFOLIO = {
    owner: {
      name: "Daisy Lab",
      title: "Technical Artist / Realtime Visual Maker",
      summary: "一些有用无用的想法。",
      email: "bigorangeyong@gmail.com",
      phone: "18747442595",
      links: {
        bilibili: "https://space.bilibili.com/3247232?spm_id_from=333.1007.0.0",
        github: "https://github.com/Daisy553",
      },
    },
    background: {
      src: "assets/interior-room-reference.png",
      video: {
        mp4: "assets/background-loop.mp4",
        webm: "assets/background-loop.webm",
      },
      alt: "Pixel-art inspired interior room reference with warm practical light and portfolio desk details.",
    },
    categories: [
      { id: "about", label: "关于我 / About" },
      { id: "personal", label: "作品 / Works" },
      { id: "breakdown", label: "分享 / Share" },
      { id: "commercial", label: "商业项目 / Commercial" },
    ],
    items: [
      {
        id: "about-daisy-lab",
        title: "智勇",
        category: "about",
        year: "Now",
        role: "技术美术（美术向）",
        summary: "什么都会一点的菜鸟",
        thumbnail: avatarImage,
        tags: ["关于我", "技术美术", "Shader"],
        media: [
          {
            type: "image",
            src: avatarImage,
            alt: "智勇的个人头像。",
            fit: "contain",
          },
        ],
        technicalPoints: [
          "用热爱做游戏。",
          "做着 Shader，也做着各种奇奇怪怪的想法。",
          "好奇心驱动一切，希望我永远在前进的路上。",
        ],
      },
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
        category: "breakdown",
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
