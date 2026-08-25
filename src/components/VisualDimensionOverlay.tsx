import React, { useState, useEffect, useCallback } from 'react';

export interface LayoutTelemetry {
  pageName: string;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth: number;
  containerPaddingLeft: number;
  containerPaddingRight: number;
  contentWidth: number;
  gridWidth: number;
  columnCount: number;
  horizontalGap: number;
  verticalGap: number;
  cardWidth: number;
  cardHeight: number;
  imageWidth: number;
  imageHeight: number;
  // Bounds for overlay drawing
  containerRect: DOMRect | null;
  gridRect: DOMRect | null;
  card1Rect: DOMRect | null;
  card2Rect: DOMRect | null;
  img1Rect: DOMRect | null;
}

interface VisualDimensionOverlayProps {
  activeView?: 'home' | 'explore' | 'single';
}

export const VisualDimensionOverlay: React.FC<VisualDimensionOverlayProps> = ({ activeView }) => {
  const [telemetry, setTelemetry] = useState<LayoutTelemetry>({
    pageName: 'EXPLORE',
    viewportWidth: 0,
    viewportHeight: 0,
    containerWidth: 0,
    containerPaddingLeft: 0,
    containerPaddingRight: 0,
    contentWidth: 0,
    gridWidth: 0,
    columnCount: 0,
    horizontalGap: 0,
    verticalGap: 0,
    cardWidth: 0,
    cardHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    containerRect: null,
    gridRect: null,
    card1Rect: null,
    card2Rect: null,
    img1Rect: null,
  });

  const [isVisible, setIsVisible] = useState(true);

  const measureLayout = useCallback(() => {
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    // Detect active page name
    const singlePromptSection = document.querySelector('section[data-single-prompt-hero="true"]') || document.querySelector('section.bg-\\[\\#232833\\]');
    const exploreWrapper = document.querySelector('.promptjo-explore-wrapper');
    const homeSection = document.querySelector('section#prompts');

    let pageName = 'EXPLORE';
    if (activeView === 'single' || (!activeView && singlePromptSection)) {
      pageName = 'SINGLE PROMPT';
    } else if (activeView) {
      pageName = activeView.toUpperCase();
    } else if (exploreWrapper) {
      pageName = 'EXPLORE';
    } else if (homeSection) {
      pageName = 'HOME';
    }

    // Find container element based on page
    let containerEl: Element | null = null;
    let gridEl: Element | null = null;

    if (pageName === 'SINGLE PROMPT') {
      containerEl = document.querySelector('main > div.max-w-6xl') ||
                    document.querySelector('.max-w-6xl') ||
                    document.querySelector('.max-w-7xl');
      gridEl = singlePromptSection;
    } else if (pageName === 'HOME') {
      containerEl = document.querySelector('section#prompts > div.max-w-7xl') ||
                    document.querySelector('section#prompts .max-w-7xl') ||
                    document.querySelector('.max-w-7xl');
      gridEl = document.querySelector('section#prompts .grid') ||
               document.querySelector('#prompts .grid');
    } else {
      containerEl = document.querySelector('.promptjo-explore-wrapper > div.max-w-7xl') ||
                    document.querySelector('.promptjo-explore-wrapper .max-w-7xl') ||
                    document.querySelector('.max-w-7xl');
      gridEl = document.querySelector('.promptjo-explore-wrapper .grid') ||
               document.querySelector('.grid');
    }

    let containerRect: DOMRect | null = null;
    let containerWidth = 0;
    let padLeft = 0;
    let padRight = 0;
    let contentWidth = 0;

    if (containerEl) {
      containerRect = containerEl.getBoundingClientRect();
      containerWidth = Math.round(containerRect.width);
      const style = window.getComputedStyle(containerEl);
      padLeft = Math.round(parseFloat(style.paddingLeft) || 0);
      padRight = Math.round(parseFloat(style.paddingRight) || 0);
      contentWidth = containerWidth - padLeft - padRight;
    }

    let gridRect: DOMRect | null = null;
    let gridWidth = 0;
    let cols = 0;
    let hGap = 0;
    let vGap = 0;

    if (gridEl) {
      gridRect = gridEl.getBoundingClientRect();
      gridWidth = Math.round(gridRect.width);
      const style = window.getComputedStyle(gridEl);
      const gridTemplateCols = style.gridTemplateColumns ? style.gridTemplateColumns.split(' ').filter(Boolean) : [];
      cols = gridTemplateCols.length || (pageName === 'SINGLE PROMPT' ? 1 : 4);
      
      const columnGapStr = style.columnGap || style.gap;
      const rowGapStr = style.rowGap || style.gap;
      hGap = Math.round(parseFloat(columnGapStr) || 0);
      vGap = Math.round(parseFloat(rowGapStr) || 0);
    }

    // Find cards inside grid
    let card1Rect: DOMRect | null = null;
    let card2Rect: DOMRect | null = null;
    let img1Rect: DOMRect | null = null;
    let cardW = 0;
    let cardH = 0;
    let imgW = 0;
    let imgH = 0;

    if (pageName === 'SINGLE PROMPT') {
      // In Single Prompt view, measure the Hero Image Stage Card and its actual rendered Image
      const heroStage = document.querySelector('[data-hero-image-stage="true"]') as HTMLElement;
      if (heroStage) {
        card1Rect = heroStage.getBoundingClientRect();
        cardW = Math.round(card1Rect.width);
        cardH = Math.round(card1Rect.height);

        const img1 = heroStage.querySelector('img');
        if (img1) {
          img1Rect = img1.getBoundingClientRect();
          imgW = Math.round(img1Rect.width);
          imgH = Math.round(img1Rect.height);
        } else {
          imgW = cardW;
          imgH = cardH;
        }
      }
    } else if (gridEl) {
      const cards = gridEl.querySelectorAll('[data-prompt-card="true"], .group.relative');
      if (cards.length > 0) {
        const c1 = cards[0] as HTMLElement;
        card1Rect = c1.getBoundingClientRect();
        cardW = Math.round(card1Rect.width);
        cardH = Math.round(card1Rect.height);

        const img1 = c1.querySelector('img');
        if (img1) {
          img1Rect = img1.getBoundingClientRect();
          imgW = Math.round(img1Rect.width);
          imgH = Math.round(img1Rect.height);
        } else {
          imgW = cardW;
          imgH = cardH;
        }

        if (cards.length > 1) {
          const c2 = cards[1] as HTMLElement;
          card2Rect = c2.getBoundingClientRect();
        }
      }
    }

    setTelemetry({
      pageName,
      viewportWidth: vpW,
      viewportHeight: vpH,
      containerWidth,
      containerPaddingLeft: padLeft,
      containerPaddingRight: padRight,
      contentWidth,
      gridWidth,
      columnCount: cols,
      horizontalGap: hGap,
      verticalGap: vGap,
      cardWidth: cardW,
      cardHeight: cardH,
      imageWidth: imgW,
      imageHeight: imgH,
      containerRect,
      gridRect,
      card1Rect,
      card2Rect,
      img1Rect,
    });
  }, [activeView]);

  useEffect(() => {
    measureLayout();

    const handleUpdate = () => {
      requestAnimationFrame(measureLayout);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });

    // MutationObserver to capture grid loading
    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, { childList: true, subtree: true });

    const timer = setInterval(measureLayout, 400);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
      observer.disconnect();
      clearInterval(timer);
    };
  }, [measureLayout]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-[9999] px-3 py-1.5 rounded-xl bg-[#D97757] text-white font-mono text-xs shadow-xl hover:bg-[#E58A66] cursor-pointer dir-ltr flex items-center gap-2"
      >
        <span>📐 Show Measurement Overlay ({telemetry.pageName})</span>
      </button>
    );
  }

  const {
    pageName,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerPaddingLeft,
    containerPaddingRight,
    contentWidth,
    gridWidth,
    columnCount,
    horizontalGap,
    verticalGap,
    cardWidth,
    cardHeight,
    imageWidth,
    imageHeight,
    containerRect,
    gridRect,
    card1Rect,
    card2Rect,
  } = telemetry;

  return (
    <>
      {/* 1. TOP-LEFT HUD TELEMETRY PANEL */}
      <div className="fixed top-4 left-4 z-[9999] w-80 bg-[#0E1422]/95 border-2 border-[#D97757] rounded-2xl p-4 text-white shadow-2xl backdrop-blur-md font-mono text-xs dir-ltr select-none">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97757] animate-ping" />
            <span className="font-bold text-[#D97757] text-sm">PROMPTJO TELEMETRY</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center bg-[#D97757]/20 border border-[#D97757]/40 px-2 py-1 rounded">
            <span className="text-[#D97757] font-bold">PAGE:</span>
            <span className="font-bold text-white text-xs tracking-wider">{pageName}</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">VIEWPORT:</span>
            <span className="font-bold text-amber-400">{viewportWidth} × {viewportHeight} px</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">FULL CARD:</span>
            <span className="font-bold text-emerald-400">{cardWidth} × {cardHeight} px</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">IMAGE AREA:</span>
            <span className="font-bold text-cyan-400">{imageWidth} × {imageHeight} px</span>
          </div>

          {pageName === 'SINGLE PROMPT' && imageWidth > 0 && imageHeight > 0 && (
            <div className="flex justify-between items-center bg-[#14171F] border border-[#3A4150] px-2 py-1 rounded">
              <span className="text-slate-400">STAGE FIT:</span>
              <span className="font-bold text-amber-300">
                {imageWidth > imageHeight * 1.3 ? '16:9 Landscape' : Math.abs(imageWidth - imageHeight) <= 15 ? '1:1 Square' : '9:16 Portrait'}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">GRID WIDTH:</span>
            <span className="font-bold text-purple-400">{gridWidth} px</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">COLUMNS / GAP:</span>
            <span className="font-bold text-fuchsia-400">{columnCount} cols / {horizontalGap}px h-gap ({verticalGap}px v-gap)</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">CONTAINER:</span>
            <span className="font-bold text-sky-400">{containerWidth} px</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">PADDING (L/R):</span>
            <span className="font-bold text-pink-400">{containerPaddingLeft}px / {containerPaddingRight}px</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
            <span className="text-slate-400">CONTENT:</span>
            <span className="font-bold text-orange-400">{contentWidth} px</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-400 text-center">
          Live DOM Measurement via getBoundingClientRect()
        </div>
      </div>

      {/* 2. OVERLAY GRAPHICAL GUIDES ON DOM ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-[9985] overflow-hidden dir-ltr">
        <svg className="w-full h-full">
          <defs>
            <marker id="arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D97757" />
            </marker>
            <marker id="arrow-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D97757" />
            </marker>
          </defs>

          {/* CONTAINER OVERLAY BOUNDARY */}
          {containerRect && (
            <g>
              {/* Outer Container Border */}
              <rect
                x={containerRect.left}
                y={containerRect.top}
                width={containerRect.width}
                height={containerRect.height}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.6"
              />
              {/* Container Label */}
              <foreignObject
                x={Math.max(10, containerRect.left + 10)}
                y={Math.max(10, containerRect.top - 28)}
                width="360"
                height="28"
              >
                <div className="bg-[#0284C7] text-white px-2 py-0.5 rounded text-[11px] font-mono font-bold inline-block shadow-md">
                  {pageName} CONTAINER: {containerWidth}px (Pad L:{containerPaddingLeft}px | R:{containerPaddingRight}px)
                </div>
              </foreignObject>
            </g>
          )}

          {/* GRID OVERLAY BOUNDARY */}
          {gridRect && (
            <g>
              <rect
                x={gridRect.left}
                y={gridRect.top}
                width={gridRect.width}
                height={gridRect.height}
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeDasharray="8 4"
                opacity="0.8"
              />
              <foreignObject
                x={Math.max(10, gridRect.left + gridRect.width / 2 - 150)}
                y={Math.max(10, gridRect.top - 30)}
                width="300"
                height="28"
              >
                <div className="bg-[#7E22CE] text-white px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-center shadow-lg">
                  {pageName} GRID: {gridWidth}px | COLS: {columnCount} | GAP: {horizontalGap}px
                </div>
              </foreignObject>
            </g>
          )}

          {/* CARD #1 OVERLAY & MEASUREMENT ARROWS */}
          {card1Rect && (
            <g>
              {/* Card #1 Outer Box */}
              <rect
                x={card1Rect.left}
                y={card1Rect.top}
                width={card1Rect.width}
                height={card1Rect.height}
                fill="rgba(16, 185, 129, 0.08)"
                stroke="#10B981"
                strokeWidth="2.5"
              />

              {/* Card Badge Label */}
              <foreignObject
                x={card1Rect.left}
                y={card1Rect.top + 8}
                width={card1Rect.width}
                height="60"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="bg-[#059669] text-white px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow-lg">
                    FULL CARD: {cardWidth} × {cardHeight} px
                  </span>
                  <span className="bg-[#0891B2] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-lg">
                    IMAGE: {imageWidth} × {imageHeight} px
                  </span>
                </div>
              </foreignObject>

              {/* Horizontal Width Arrow above Card #1 */}
              <line
                x1={card1Rect.left + 5}
                y1={card1Rect.bottom - 15}
                x2={card1Rect.right - 5}
                y2={card1Rect.bottom - 15}
                stroke="#D97757"
                strokeWidth="2"
                markerStart="url(#arrow-start)"
                markerEnd="url(#arrow-end)"
              />
              <foreignObject
                x={card1Rect.left}
                y={card1Rect.bottom - 36}
                width={card1Rect.width}
                height="22"
              >
                <div className="text-center">
                  <span className="bg-[#D97757] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    &lt;─ {cardWidth} px ─&gt;
                  </span>
                </div>
              </foreignObject>

              {/* Vertical Height Arrow along right side of Card #1 */}
              <line
                x1={card1Rect.right - 12}
                y1={card1Rect.top + 5}
                x2={card1Rect.right - 12}
                y2={card1Rect.bottom - 5}
                stroke="#10B981"
                strokeWidth="2"
              />
            </g>
          )}

          {/* GAP MEASUREMENT BETWEEN CARD #1 AND CARD #2 */}
          {card1Rect && card2Rect && horizontalGap > 0 && (
            <g>
              {/* Gap Highlight Box */}
              <rect
                x={Math.min(card1Rect.right, card2Rect.left)}
                y={card1Rect.top}
                width={Math.abs(card2Rect.left - card1Rect.right)}
                height={card1Rect.height}
                fill="rgba(217, 119, 87, 0.2)"
                stroke="#D97757"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Gap Label */}
              <foreignObject
                x={Math.min(card1Rect.right, card2Rect.left) - 30}
                y={card1Rect.top + card1Rect.height / 2 - 12}
                width={Math.max(horizontalGap + 60, 90)}
                height="26"
              >
                <div className="text-center">
                  <span className="bg-[#D97757] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    GAP: {horizontalGap}px
                  </span>
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>
    </>
  );
};
