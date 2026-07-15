(function (root, factory) {
  const portfolio = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = portfolio;
  }

  root.DAISY_PORTFOLIO = portfolio.DAISY_PORTFOLIO;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const placeholderImage = "assets/work/snowbreak-poster.jpg";
  const avatarImage = "assets/work/zhiyong-avatar.webp";

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
      src: "assets/interior-room-reference.webp",
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
        year: "27",
        role: "技术美术（美术向）",
        summary: "什么都会一点的菜鸟",
        thumbnail: avatarImage,
        tags: ["TA", "EnvArt", "Shader"],
        media: [
          {
            type: "image",
            src: avatarImage,
            alt: "智勇的个人头像。",
            fit: "contain",
          },
        ],
        technicalPoints: [
          "爱猫人士",
          "各种奇奇怪怪的想法。",
          "调参大师",
        ],
      },
      {
        id: "trail-effect",
        title: "Trail Effect",
        category: "personal",
        year: "当前",
        role: "技术美术 / C++",
        summary:
          "一个可复用的 Unreal Engine 角色残影组件，通过记录运动历史生成清晰、可控的实时残影。",
        thumbnail: "assets/traileffect/trail-effect-cover.jpg",
        tags: ["Unreal Engine", "C++", "实时特效"],
        media: [
          {
            type: "video",
            src: "assets/traileffect/trail-effect-demo.mp4",
            poster: "assets/traileffect/trail-effect-cover.jpg",
            alt: "Trail Effect 在 Unreal Engine 中生成角色实时残影的演示。",
          },
        ],
        technicalPoints: [
          "支持连续残影、一次性 Burst 与动画 Notify 驱动的生成方式。",
          "固定容量历史缓冲控制运行时内存，并支持按目标时间获取姿态。",
          "对象池限制每个 Session 的激活数量，过期 Ghost 会回收到 FreeList。",
        ],
        breakdown: [
          {
            title: "姿态采样",
            text: "按时间间隔或位移阈值捕获角色姿态；检测到传送距离时重置历史，避免残影跨场景拉伸。",
          },
          {
            title: "历史缓冲",
            text: "使用固定容量环形缓冲保存姿态快照，并根据残影目标时间查找相邻帧进行插值。",
          },
          {
            title: "生成与回收",
            text: "Ghost Actor 从对象池获取，生命周期结束后回收；材质参数随时间更新透明度与视觉变化。",
          },
        ],
        codeSamples: [
          {
            title: "按时间与位移触发采样",
            file: "Private/Components/TrailEffectComponent.cpp",
            language: "cpp",
            code: String.raw`// 累计采样与生成计时
SampleTimer += DeltaTime;
SpawnTimer += DeltaTime;

const float EffectiveSampleInterval = FMath::Max(CaptureSettings.SampleInterval, 0.01f);
bool bShouldCaptureSnapshot = bTrailWarmupPending || SampleTimer >= EffectiveSampleInterval;

// 时间未到时，位移超过阈值也会触发采样
if (!bShouldCaptureSnapshot && CaptureSettings.MinDistanceForSample > 0.f)
{
    bShouldCaptureSnapshot = !LastCapturedAnchorLocation.IsSet() ||
        FVector::Dist(LastCapturedAnchorLocation.GetValue(), CurrentTrailLocation) >= CaptureSettings.MinDistanceForSample;
}

// 捕获成功后写入历史缓冲
if (bShouldCaptureSnapshot)
{
    FTrailPoseSnapshot Snapshot;
    if (CapturePoseSnapshot(Snapshot))
    {
        PushSnapshot(Snapshot);
        SampleTimer = 0.f;
    }
}`,
          },
          {
            title: "固定容量环形缓冲",
            file: "Private/Components/TrailEffectComponent.cpp",
            language: "cpp",
            code: String.raw`void PushSnapshotToRing(
    TArray<FTrailPoseSnapshot>& Buffer,
    int32& BufferHead,
    int32& BufferCount,
    int32 Capacity,
    const FTrailPoseSnapshot& Snapshot)
{
    if (Capacity <= 0)
    {
        return;
    }

    // 循环覆盖最旧数据，避免历史记录持续增长
    Buffer[BufferHead] = Snapshot;
    BufferHead = (BufferHead + 1) % Capacity;
    BufferCount = FMath::Min(BufferCount + 1, Capacity);
}`,
          },
          {
            title: "Ghost 对象池复用",
            file: "Private/Ghost/TrailGhostPool.cpp",
            language: "cpp",
            code: String.raw`ATrailGhostActor* UTrailGhostPool::Acquire(int32 MaxActiveGhostCount, uint64 OwnerSessionId)
{
    // 每个会话都受最大激活数量限制
    if (MaxActiveGhostCount > 0 && GetActiveGhostCountForSession(OwnerSessionId) >= MaxActiveGhostCount)
    {
        return nullptr;
    }

    // 优先复用空闲对象，没有可用对象时再创建
    ATrailGhostActor* Ghost = nullptr;
    if (FreeList.Num() > 0)
    {
        Ghost = FreeList.Pop().Get();
    }
    else
    {
        Ghost = SpawnGhost();
    }

    if (Ghost)
    {
        ActiveList.Add(Ghost);
    }

    return Ghost;
}

void UTrailGhostPool::Release(ATrailGhostActor* Ghost)
{
    if (!Ghost)
    {
        return;
    }

    // 失活后从活动列表回收到空闲列表
    Ghost->DeactivateGhost();
    ActiveList.Remove(Ghost);
    FreeList.Add(Ghost);
}`,
          },
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
