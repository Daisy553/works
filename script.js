(function () {
  const portfolio = window.DAISY_PORTFOLIO;
  const stateApi = window.DAISY_PORTFOLIO_STATE;

  if (!portfolio || !stateApi) {
    return;
  }

  const backgroundVideo = document.querySelector('#room-bg-video');
  const canvas = document.querySelector('#pixel-bg');
  const shell = document.querySelector('[data-portfolio-shell]');
  const categoryNav = document.querySelector('[data-category-nav]');
  const albumTrack = document.querySelector('[data-album-track]');
  const albumPrev = document.querySelector('[data-album-prev]');
  const albumNext = document.querySelector('[data-album-next]');
  const categoryLabel = document.querySelector('[data-category-label]');
  const albumCount = document.querySelector('[data-album-count]');
  const detail = document.querySelector('#work-detail');
  const detailMedia = document.querySelector('[data-detail-media]');
  const detailTitle = document.querySelector('[data-detail-title]');
  const detailKicker = document.querySelector('[data-detail-kicker]');
  const detailSummary = document.querySelector('[data-detail-summary]');
  const detailRole = document.querySelector('[data-detail-role]');
  const detailTags = document.querySelector('[data-detail-tags]');
  const detailPoints = document.querySelector('[data-detail-points]');

  const ctx = canvas ? canvas.getContext('2d') : null;
  const backgroundImage = new Image();
  const lowResCanvas = document.createElement('canvas');
  const lowResCtx = lowResCanvas.getContext('2d');
  const softRegionCanvas = document.createElement('canvas');
  const softRegionCtx = softRegionCanvas.getContext('2d');

  const appState = {
    categoryId: stateApi.getInitialCategoryId(portfolio),
    albumIndex: 0,
    backgroundReady: false,
    albumMotionTimer: null,
    categoryMotionTimer: null,
    navFeedbackTimer: null,
    directorySwitchTimer: null,
    directoryFadeTimer: null,
    backgroundDriftFrame: null,
    videoBackgroundFailed: false,
    feedbackCategoryId: '',
  };

  const ambientDust = Array.from({ length: 128 }, (_, index) => {
    const seed = Math.sin(index * 91.17) * 10000;
    const next = seed - Math.floor(seed);
    const second = Math.sin((index + 17) * 47.63) * 10000;
    const third = Math.sin((index + 31) * 29.31) * 10000;

    return {
      x: 0.06 + next * 0.58,
      y: 0.04 + (second - Math.floor(second)) * 0.82,
      drift: 0.4 + (third - Math.floor(third)) * 0.9,
      alpha: 0.24 + (next % 0.42),
      size: index % 5 === 0 ? 2.2 : 1.2,
    };
  });

  const softLightRegions = [
    { x: 0.11, y: 0.04, w: 0.25, h: 0.52, alpha: 0.052, phase: 0.25, speed: 0.0005 },
    { x: 0.0, y: 0.0, w: 0.13, h: 0.78, alpha: 0.04, phase: 1.1, speed: 0.00042 },
    { x: 0.35, y: 0.02, w: 0.1, h: 0.64, alpha: 0.06, phase: 1.9, speed: 0.00038 },
    { x: 0.07, y: 0.56, w: 0.36, h: 0.12, alpha: 0.045, phase: 2.6, speed: 0.00034 },
    { x: 0.28, y: 0.74, w: 0.22, h: 0.14, alpha: 0.058, phase: 3.3, speed: 0.00044 },
    { x: 0.56, y: 0.7, w: 0.22, h: 0.15, alpha: 0.035, phase: 4.2, speed: 0.00036 },
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let previousFocus = null;
  let animationActive = false;
  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : {
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      };

  function getItems() {
    return stateApi.getCategoryItems(portfolio, appState.categoryId);
  }

  function getActiveCategory() {
    return (portfolio.categories || []).find((category) => category.id === appState.categoryId) || null;
  }

  function setChildren(parent, children) {
    if (!parent) {
      return;
    }

    parent.replaceChildren(...children);
  }

  function usesVideoBackground() {
    return Boolean(backgroundVideo && !appState.videoBackgroundFailed && !reducedMotionQuery.matches);
  }

  function syncBackgroundVideo() {
    if (!backgroundVideo) {
      return;
    }

    if (!usesVideoBackground()) {
      backgroundVideo.pause();
      return;
    }

    const playAttempt = backgroundVideo.play();

    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        appState.videoBackgroundFailed = true;
        drawBackground(0);
      });
    }
  }

  function renderNavigation() {
    if (!categoryNav || !Array.isArray(portfolio.categories)) {
      return;
    }

    const buttons = portfolio.categories.map((category, index) => {
      const button = document.createElement('button');
      const isActive = category.id === appState.categoryId;
      const itemCount = stateApi.getCategoryItems(portfolio, category.id).length;
      const label = document.createElement('span');
      const count = document.createElement('span');

      button.type = 'button';
      const isFeedback = category.id === appState.feedbackCategoryId;

      button.className = `directory-button${isActive ? ' is-active' : ''}${isFeedback ? ' is-feedback' : ''}`;
      button.dataset.categoryId = category.id;
      button.setAttribute('aria-label', `${category.label}, ${itemCount} ${itemCount === 1 ? 'work' : 'works'}`);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('data-index', String(index + 1).padStart(2, '0'));
      if (isActive) {
        button.setAttribute('aria-current', 'true');
      }

      label.className = 'directory-label';
      label.textContent = category.label;
      count.className = 'directory-count';
      count.textContent = String(itemCount).padStart(2, '0');
      count.setAttribute('aria-hidden', 'true');
      button.append(label, count);
      button.addEventListener('click', () => setCategory(category.id));

      return button;
    });

    setChildren(categoryNav, buttons);
  }

  function updateNavigationState() {
    if (!categoryNav) {
      return;
    }

    categoryNav.querySelectorAll('.directory-button').forEach((button) => {
      const isActive = button.dataset.categoryId === appState.categoryId;
      const isFeedback = button.dataset.categoryId === appState.feedbackCategoryId;

      button.classList.toggle('is-active', isActive);
      button.classList.toggle('is-feedback', isFeedback);
      button.setAttribute('aria-pressed', String(isActive));
      if (isActive) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }

  function getCardPosition(index, activeIndex, length) {
    if (length <= 0) {
      return 'hidden';
    }

    let diff = index - activeIndex;
    const half = length / 2;

    if (diff > half) diff -= length;
    if (diff < -half) diff += length;

    if (diff === 0) return 'active';
    if (diff === -1) return 'before';
    if (diff === 1) return 'after';
    if (diff === -2) return 'far-before';
    if (diff === 2) return 'far-after';

    return 'hidden';
  }

  function updateArchiveStatus(items) {
    const activeCategory = getActiveCategory();

    if (categoryLabel) {
      categoryLabel.textContent = activeCategory ? activeCategory.label : 'Archive';
    }

    if (albumCount) {
      const current = items.length > 0 ? appState.albumIndex + 1 : 0;
      albumCount.textContent = `${String(current).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }
  }

  function markAlbumMotion(direction) {
    if (!albumTrack) {
      return;
    }

    window.clearTimeout(appState.albumMotionTimer);
    albumTrack.classList.remove('is-moving-next', 'is-moving-prev', 'is-category-change');

    if (direction === 0) {
      return;
    }

    // Force the newly rendered cards to replay the direction-aware transition.
    void albumTrack.offsetWidth;
    albumTrack.classList.add(direction > 0 ? 'is-moving-next' : 'is-moving-prev');
    appState.albumMotionTimer = window.setTimeout(() => {
      albumTrack.classList.remove('is-moving-next', 'is-moving-prev');
    }, 760);
  }

  function finishAlbumRender(children, direction) {
    setChildren(albumTrack, children);
    markAlbumMotion(direction);
  }

  function pulseCategory(categoryId) {
    appState.feedbackCategoryId = categoryId;
    updateNavigationState();

    window.clearTimeout(appState.navFeedbackTimer);
    appState.navFeedbackTimer = window.setTimeout(() => {
      if (appState.feedbackCategoryId === categoryId) {
        appState.feedbackCategoryId = '';
        updateNavigationState();
      }
    }, 460);
  }

  function createAlbumCard(item, position) {
    const card = document.createElement('article');
    const image = document.createElement('img');
    const caption = document.createElement('div');
    const title = document.createElement('h2');
    const meta = document.createElement('p');
    const action = document.createElement('span');

    card.className = `album-card is-${position}`;
    card.tabIndex = position === 'hidden' ? -1 : 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.title}, ${position === 'active' ? 'open detail' : 'select work'}`);

    image.src = item.thumbnail;
    image.alt = item.title;
    image.loading = position === 'active' ? 'eager' : 'lazy';

    caption.className = 'album-caption';
    title.textContent = item.title;
    meta.textContent = [item.year, item.role].filter(Boolean).join(' / ');
    action.className = 'album-action';
    action.textContent = position === 'active' ? 'View Case' : 'Bring Forward';

    caption.append(title, meta, action);
    card.append(image, caption);

    card.addEventListener('click', () => {
      if (position === 'before' || position === 'far-before') {
        moveAlbum(position === 'far-before' ? -2 : -1);
        return;
      }

      if (position === 'after' || position === 'far-after') {
        moveAlbum(position === 'far-after' ? 2 : 1);
        return;
      }

      if (position === 'active') {
        openDetail(item);
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });

    return card;
  }

  function renderAlbum(direction = 0) {
    if (!albumTrack) {
      return;
    }

    const items = getItems();
    appState.albumIndex = stateApi.normalizeAlbumIndex(appState.albumIndex, items.length);
    updateArchiveStatus(items);

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'album-empty';
      empty.textContent = 'No works in this category yet.';
      finishAlbumRender([empty], direction);
      return;
    }

    if (items.length === 1) {
      finishAlbumRender([createAlbumCard(items[0], 'active')], direction);
      return;
    }

    if (items.length === 2) {
      const nextIndex = stateApi.normalizeAlbumIndex(appState.albumIndex + 1, items.length);
      finishAlbumRender([
        createAlbumCard(items[appState.albumIndex], 'active'),
        createAlbumCard(items[nextIndex], 'after'),
      ], direction);
      return;
    }

    const cards = items
      .map((item, index) => ({ item, position: getCardPosition(index, appState.albumIndex, items.length) }))
      .filter(({ position }) => position !== 'hidden')
      .map(({ item, position }) => createAlbumCard(item, position));

    finishAlbumRender(cards, direction);
  }

  function moveAlbum(delta) {
    const items = getItems();

    if (items.length === 0) {
      return;
    }

    appState.albumIndex = stateApi.normalizeAlbumIndex(appState.albumIndex + delta, items.length);
    renderAlbum(Math.sign(delta));
  }

  function setCategory(categoryId) {
    pulseCategory(categoryId);

    if (categoryId === appState.categoryId) {
      return;
    }

    window.clearTimeout(appState.directorySwitchTimer);
    window.clearTimeout(appState.directoryFadeTimer);
    categoryNav?.classList.remove('is-switching-in');
    categoryNav?.classList.add('is-switching-out');

    appState.directorySwitchTimer = window.setTimeout(() => {
      appState.categoryId = categoryId;
      appState.albumIndex = 0;
      updateNavigationState();
      renderAlbum(0);

      categoryNav?.classList.remove('is-switching-out');
      categoryNav?.classList.add('is-switching-in');
      appState.directoryFadeTimer = window.setTimeout(() => {
        categoryNav?.classList.remove('is-switching-in');
      }, 360);

      if (albumTrack) {
        window.clearTimeout(appState.categoryMotionTimer);
        albumTrack.classList.remove('is-category-change');
        void albumTrack.offsetWidth;
        albumTrack.classList.add('is-category-change');
        appState.categoryMotionTimer = window.setTimeout(() => {
          albumTrack.classList.remove('is-category-change');
        }, 620);
      }
    }, 150);
  }

  function createDetailMedia(media) {
    if (!media) {
      return document.createTextNode('');
    }

    if (media.type === 'video') {
      const video = document.createElement('video');
      video.src = media.src;
      video.poster = media.poster || '';
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('aria-label', media.alt || 'Project video');
      return video;
    }

    const image = document.createElement('img');
    image.src = media.src;
    image.alt = media.alt || 'Project image';
    return image;
  }

  function fillList(list, values) {
    if (!list) {
      return;
    }

    const items = (values || []).map((value) => {
      const item = document.createElement('li');
      item.textContent = value;
      return item;
    });

    setChildren(list, items);
  }

  function getFocusableDetailItems() {
    if (!detail) {
      return [];
    }

    return [...detail.querySelectorAll('a[href], button, input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])')].filter(
      (element) => !element.disabled && element.getAttribute('aria-hidden') !== 'true'
    );
  }

  function moveFocusIntoDetail() {
    if (detail && !detail.hasAttribute('tabindex')) {
      detail.tabIndex = -1;
    }

    const focusTarget = detail?.querySelector('[data-detail-close]') || getFocusableDetailItems()[0] || detail;
    focusTarget?.focus({ preventScroll: true });
  }

  function restorePreviousFocus() {
    if (previousFocus && typeof previousFocus.focus === 'function' && document.contains(previousFocus)) {
      previousFocus.focus();
    }

    previousFocus = null;
  }

  function trapDetailFocus(event) {
    if (event.key !== 'Tab' || !detail?.classList.contains('is-open')) {
      return;
    }

    const focusable = getFocusableDetailItems();

    if (focusable.length === 0) {
      event.preventDefault();
      detail.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!detail.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function pauseDetailMedia() {
    detailMedia?.querySelectorAll('video, audio').forEach((media) => {
      media.pause();

      try {
        media.currentTime = 0;
      } catch (error) {
        // Some media streams do not allow seeking; pausing is enough for close.
      }
    });
  }

  function openDetail(item) {
    if (!detail || !item) {
      return;
    }

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const firstMedia = Array.isArray(item.media) ? item.media[0] : null;
    const activeCategory = (portfolio.categories || []).find((category) => category.id === item.category);

    if (detailMedia) {
      detailMedia.replaceChildren(createDetailMedia(firstMedia));
    }

    if (detailTitle) detailTitle.textContent = item.title || '';
    if (detailKicker) detailKicker.textContent = [activeCategory?.label || item.category, item.year].filter(Boolean).join(' / ');
    if (detailSummary) detailSummary.textContent = item.summary || '';
    if (detailRole) detailRole.textContent = item.role ? `Role: ${item.role}` : '';

    fillList(detailTags, item.tags);
    fillList(detailPoints, item.technicalPoints);

    resetBackgroundDrift();
    document.body?.classList.add('is-detail-open');
    detail.classList.add('is-open');
    detail.setAttribute('aria-hidden', 'false');
    shell?.setAttribute('aria-hidden', 'true');

    if (shell && 'inert' in shell) {
      shell.inert = true;
    }

    moveFocusIntoDetail();
  }

  function closeDetail() {
    if (!detail) {
      return;
    }

    pauseDetailMedia();
    document.body?.classList.remove('is-detail-open');
    detail.classList.remove('is-open');
    detail.setAttribute('aria-hidden', 'true');
    shell?.setAttribute('aria-hidden', 'false');

    if (shell && 'inert' in shell) {
      shell.inert = false;
    }

    restorePreviousFocus();
  }

  function setBackgroundDrift(x, y) {
    const rootStyle = document.documentElement?.style;

    if (!rootStyle) {
      return;
    }

    rootStyle.setProperty('--bg-shift-x', `${x.toFixed(2)}px`);
    rootStyle.setProperty('--bg-shift-y', `${y.toFixed(2)}px`);
  }

  function resetBackgroundDrift() {
    window.cancelAnimationFrame(appState.backgroundDriftFrame);
    setBackgroundDrift(0, 0);
  }

  function isForegroundTarget(target) {
    return target instanceof Element && Boolean(target.closest('.identity-panel, .album-card, .album-control, .directory-button, .detail-view.is-open'));
  }

  function updateBackgroundDrift(event) {
    if (reducedMotionQuery.matches || isForegroundTarget(event.target)) {
      resetBackgroundDrift();
      return;
    }

    const viewportWidth = window.innerWidth || 1;
    const viewportHeight = window.innerHeight || 1;
    const x = ((event.clientX / viewportWidth) - 0.5) * 10;
    const y = ((event.clientY / viewportHeight) - 0.5) * 7;

    window.cancelAnimationFrame(appState.backgroundDriftFrame);
    appState.backgroundDriftFrame = window.requestAnimationFrame(() => {
      setBackgroundDrift(x, y);
    });
  }

  function bindEvents() {
    albumPrev?.addEventListener('click', () => moveAlbum(-1));
    albumNext?.addEventListener('click', () => moveAlbum(1));

    document.querySelectorAll('[data-detail-close]').forEach((button) => {
      button.addEventListener('click', closeDetail);
    });

    document.addEventListener('keydown', (event) => {
      const detailOpen = detail?.classList.contains('is-open');

      trapDetailFocus(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Escape' && detailOpen) {
        closeDetail();
        return;
      }

      if (detailOpen) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        moveAlbum(-1);
      }

      if (event.key === 'ArrowRight') {
        moveAlbum(1);
      }
    });

    albumTrack?.addEventListener(
      'wheel',
      (event) => {
        if (Math.abs(event.deltaY) < 4 && Math.abs(event.deltaX) < 4) {
          return;
        }

        event.preventDefault();
        moveAlbum(event.deltaY + event.deltaX > 0 ? 1 : -1);
      },
      { passive: false }
    );

    window.addEventListener('resize', () => {
      resizeCanvas();
      resetBackgroundDrift();

      if (reducedMotionQuery.matches) {
        drawBackground(0);
      }
    });

    document.addEventListener('mousemove', updateBackgroundDrift);
    document.addEventListener('mouseleave', resetBackgroundDrift);

    backgroundVideo?.addEventListener('error', () => {
      appState.videoBackgroundFailed = true;
      drawBackground(0);
    });

    reducedMotionQuery.addEventListener('change', () => {
      resetBackgroundDrift();
      startBackground();
    });
  }

  function resizeCanvas() {
    if (!canvas || !ctx) {
      return;
    }

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth || document.documentElement.clientWidth || 1;
    height = window.innerHeight || document.documentElement.clientHeight || 1;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lowResCanvas.width = Math.max(190, Math.ceil(width / 3.1));
    lowResCanvas.height = Math.max(140, Math.ceil(height / 3.1));
  }

  function getCoverRect(image, targetWidth, targetHeight, offsetX = 0, offsetY = 0) {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = targetWidth / targetHeight;

    const heightToDraw = imageRatio > targetRatio ? targetHeight : targetWidth / imageRatio;
    const widthToDraw = imageRatio > targetRatio ? targetHeight * imageRatio : targetWidth;

    return {
      x: (targetWidth - widthToDraw) / 2 + offsetX,
      y: (targetHeight - heightToDraw) / 2 + offsetY,
      width: widthToDraw,
      height: heightToDraw,
    };
  }

  function drawCoverImage(context, image, targetWidth, targetHeight, offsetX = 0, offsetY = 0) {
    const rect = getCoverRect(image, targetWidth, targetHeight, offsetX, offsetY);

    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);

    return rect;
  }

  function getImageRegionBox(image, coverRect, region) {
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;

    return {
      sourceX: region.x * imageWidth,
      sourceY: region.y * imageHeight,
      sourceWidth: region.w * imageWidth,
      sourceHeight: region.h * imageHeight,
      targetX: coverRect.x + region.x * coverRect.width,
      targetY: coverRect.y + region.y * coverRect.height,
      targetWidth: region.w * coverRect.width,
      targetHeight: region.h * coverRect.height,
    };
  }

  function drawSoftImageRegion(context, image, coverRect, region, alpha) {
    const box = getImageRegionBox(image, coverRect, region);
    const targetWidth = Math.max(1, Math.ceil(box.targetWidth));
    const targetHeight = Math.max(1, Math.ceil(box.targetHeight));

    softRegionCanvas.width = targetWidth;
    softRegionCanvas.height = targetHeight;
    softRegionCtx.imageSmoothingEnabled = false;
    softRegionCtx.clearRect(0, 0, targetWidth, targetHeight);
    softRegionCtx.globalCompositeOperation = 'source-over';
    softRegionCtx.globalAlpha = 1;
    softRegionCtx.drawImage(
      image,
      box.sourceX,
      box.sourceY,
      box.sourceWidth,
      box.sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const mask = softRegionCtx.createRadialGradient(
      targetWidth * 0.5,
      targetHeight * 0.5,
      Math.min(targetWidth, targetHeight) * 0.08,
      targetWidth * 0.5,
      targetHeight * 0.5,
      Math.max(targetWidth, targetHeight) * 0.64
    );
    mask.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    mask.addColorStop(0.62, 'rgba(0, 0, 0, 0.58)');
    mask.addColorStop(1, 'rgba(0, 0, 0, 0)');

    softRegionCtx.globalCompositeOperation = 'destination-in';
    softRegionCtx.fillStyle = mask;
    softRegionCtx.fillRect(0, 0, targetWidth, targetHeight);

    context.save();
    context.globalAlpha = alpha;
    context.globalCompositeOperation = 'screen';
    context.drawImage(softRegionCanvas, box.targetX, box.targetY, targetWidth, targetHeight);
    context.restore();
  }

  function drawDust(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (const mote of ambientDust) {
      const drift = Math.sin(time * 0.00036 * mote.drift + mote.x * 9) * 34;
      const float = (time * 0.012 * mote.drift) % (height * 0.24);
      const x = width * mote.x + drift;
      const y = (height * mote.y + float) % height;
      const alpha = mote.alpha * (0.58 + Math.sin(time * 0.0014 + mote.y * 12) * 0.32);

      ctx.fillStyle = `rgba(255, 231, 180, ${Math.max(0.04, alpha)})`;
      ctx.fillRect(x, y, mote.size, mote.size);
    }

    ctx.restore();
  }

  function drawBreathingImageRegions(context, image, coverRect, time) {
    for (const region of softLightRegions) {
      const pulse = 0.48 + Math.sin(time * region.speed + region.phase) * 0.22;

      drawSoftImageRegion(context, image, coverRect, region, region.alpha * pulse);
    }
  }

  function drawBackground(time = 0) {
    if (!ctx || !lowResCtx) {
      animationActive = false;
      return;
    }

    const lowWidth = lowResCanvas.width;
    const lowHeight = lowResCanvas.height;
    const breath = 0.5 + Math.sin(time * 0.00072) * 0.5;
    const grainAlpha = 0.004 + breath * 0.004;
    const useVideo = usesVideoBackground();

    lowResCtx.imageSmoothingEnabled = false;
    lowResCtx.clearRect(0, 0, lowWidth, lowHeight);

    let coverRect = null;

    if (!useVideo && appState.backgroundReady) {
      coverRect = drawCoverImage(lowResCtx, backgroundImage, lowWidth, lowHeight);
      drawBreathingImageRegions(lowResCtx, backgroundImage, coverRect, time);
    } else if (!useVideo) {
      const gradient = lowResCtx.createLinearGradient(0, 0, lowWidth, lowHeight);
      gradient.addColorStop(0, '#4a3824');
      gradient.addColorStop(0.52, '#30251d');
      gradient.addColorStop(1, '#090807');
      lowResCtx.fillStyle = gradient;
      lowResCtx.fillRect(0, 0, lowWidth, lowHeight);
    }

    lowResCtx.globalAlpha = grainAlpha;
    for (let y = 0; y < lowHeight; y += 6) {
      for (let x = y % 9; x < lowWidth; x += 23) {
        lowResCtx.fillStyle = (x + y) % 2 === 0 ? '#f3d69b' : '#1f2022';
        lowResCtx.fillRect(x, y, 1, 1);
      }
    }
    lowResCtx.globalAlpha = 1;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(lowResCanvas, 0, 0, width, height);

    const shadowGradient = ctx.createLinearGradient(width * 0.52, 0, width, height);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.04)');
    shadowGradient.addColorStop(0.44, 'rgba(0, 0, 0, 0.14)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(0, 0, width, height);

    drawDust(time);

    const vignette = ctx.createRadialGradient(width * 0.47, height * 0.48, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.78);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(18, 14, 18, 0.16)');
    vignette.addColorStop(1, 'rgba(8, 8, 12, 0.56)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = `rgba(255, 236, 194, ${0.008 + Math.sin(time * 0.0038) * 0.002})`;
    for (let y = 0; y < height; y += 7) {
      ctx.fillRect(0, y, width, 1);
    }

    if (reducedMotionQuery.matches) {
      animationActive = false;
      return;
    }

    requestAnimationFrame(drawBackground);
  }

  function startBackground() {
    syncBackgroundVideo();

    if (reducedMotionQuery.matches) {
      animationActive = false;
      drawBackground(0);
      return;
    }

    if (animationActive) {
      return;
    }

    animationActive = true;
    requestAnimationFrame(drawBackground);
  }

  function init() {
    renderNavigation();
    renderAlbum();
    bindEvents();
    resizeCanvas();

    if (portfolio.background && portfolio.background.src) {
      backgroundImage.onload = () => {
        appState.backgroundReady = true;

        if (reducedMotionQuery.matches) {
          drawBackground(0);
        }
      };
      backgroundImage.src = portfolio.background.src;
    }

    startBackground();
  }

  init();
})();
