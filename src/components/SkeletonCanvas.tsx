import React, {
    useState, useEffect, useRef, useCallback,
    forwardRef, useImperativeHandle,
  } from 'react';
  import {
    IMol, IArrow, IEquil, ICurve, IText,
    IType, IPtr, IPlus, IX, IUndo, IRedo, ITrash, IDl, IRotate, IFlip,
  } from './Icons';
  
  // ─── Grid snapping ────────────────────────────────────────────────────────────
  const GW = 86.6025, GH = 50;
  
  function snapToGrid(cx: number, cy: number, panX: number, panY: number) {
    const rx = cx - panX, ry = cy - panY;
    const col = Math.round(rx / GW), row = Math.round(ry / GH);
    let best = { x: 0, y: 0 }, bestD = Infinity;
    for (let dc = -2; dc <= 2; dc++) {
      for (let dr = -3; dr <= 3; dr++) {
        const c = col + dc, r = row + dr;
        const gx = c * GW + (((r % 2) + 2) % 2) * GW / 2;
        const gy = r * GH;
        const d = Math.hypot(rx - gx, ry - gy);
        if (d < bestD) { bestD = d; best = { x: gx, y: gy }; }
      }
    }
    return best;
  }
  
  // ─── Constants ────────────────────────────────────────────────────────────────
  const BOND_LEN = 50, SNAP_DIST = 15, BOND_OFFSET = 4;
  const generateId = () => Math.random().toString(36).substring(2, 9);
  const labelRadius = (label: string) => {
    if (!label || label === 'C') return 0;
    return label.length > 1 ? 22 : 14;
  };
  const ELEMENT_COLORS: Record<string, string> = {
    O: '#ef4444', N: '#3b82f6', S: '#eab308', F: '#22c55e',
    Cl: '#22c55e', Br: '#a16207', P: '#f97316', I: '#8b5cf6',
  };
  
  // ─── Types ────────────────────────────────────────────────────────────────────
  interface Node { id: string; x: number; y: number; label: string; }
  interface Edge { id: string; n1: string; n2: string; order: number | 'wedge' | 'dash'; }
  interface Annotation {
    id: string; type: string;
    x1?: number; y1?: number; x2?: number; y2?: number;
    cpx?: number; cpy?: number;
    x?: number; y?: number; text?: string;
    preview?: boolean;
  }
  interface GraphState {
    nodes: Node[]; edges: Edge[]; activeId: string | null;
    gridOrientation: string; annotations: Annotation[];
  }
  interface Page extends GraphState {
    id: string; name: string;
    prevActiveId: string | null; lastAngle: number;
    history: GraphState[]; historyIdx: number;
  }
  
  export interface SkeletonCanvasHandle { clear: () => void; undo: () => void; redo: () => void; }
  interface Props { onInteract?: () => void; activeTool: string; setActiveTool: (t: string) => void; }
  
  // ─── Canvas helpers ───────────────────────────────────────────────────────────
  function arrowHead(
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number, size = 10
  ) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - size * Math.cos(angle - 0.4), y2 - size * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - size * Math.cos(angle + 0.4), y2 - size * Math.sin(angle + 0.4));
    ctx.closePath(); ctx.fill();
  }
  
  function drawCurvedArrow(
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number,
    cpx: number, cpy: number, color = '#1e293b'
  ) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cpx, cpy, x2, y2); ctx.stroke();
    const tx = x2 - cpx, ty = y2 - cpy, len = Math.hypot(tx, ty), ux = tx / len, uy = ty / len, hs = 10;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - hs * (ux - 0.4 * (-uy)), y2 - hs * (uy - 0.4 * ux));
    ctx.lineTo(x2 - hs * (ux + 0.4 * (-uy)), y2 - hs * (uy + 0.4 * ux));
    ctx.closePath(); ctx.fill();
  }
  
  // ─── Page factory ─────────────────────────────────────────────────────────────
  const makeInitialPage = (name: string): Page => {
    const firstNode: Node = { id: generateId(), x: 0, y: 0, label: 'C' };
    const baseState: GraphState = {
      nodes: [firstNode], edges: [], activeId: firstNode.id,
      gridOrientation: 'vertical', annotations: [],
    };
    return {
      id: generateId(), name, ...baseState,
      prevActiveId: null, lastAngle: 120,
      history: [baseState], historyIdx: 0,
    };
  };
  
  // ─── SkeletonCanvas ───────────────────────────────────────────────────────────
  const SkeletonCanvas = forwardRef<SkeletonCanvasHandle, Props>(
    ({ onInteract, activeTool, setActiveTool }, ref) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const canvasRef    = useRef<HTMLCanvasElement>(null);
      const annoRef      = useRef<HTMLCanvasElement>(null);
  
      const [pages, setPages]             = useState<Page[]>(() => [makeInitialPage('Page 1')]);
      const [activePageIdx, setActivePageIdx] = useState(0);
      const activePage = pages[activePageIdx] ?? pages[0];
      const { nodes, edges, activeId, prevActiveId, gridOrientation, lastAngle, history, historyIdx, annotations } = activePage;
  
      const [pan, setPan]                   = useState({ x: 0, y: 0 });
      const [mouseDown, setMouseDown]       = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);
      const [isPanning, setIsPanning]       = useState(false);
      const [dimensions, setDimensions]     = useState({ width: 800, height: 600 });
      const [isEditingLabel, setIsEditingLabel] = useState(false);
      const [editValue, setEditValue]       = useState('');
      const [annoStart, setAnnoStart]       = useState<{ x: number; y: number } | null>(null);
      const [annoPreview, setAnnoPreview]   = useState<{ x: number; y: number } | null>(null);
      const [pendingTextPos, setPendingTextPos] = useState<{ x: number; y: number } | null>(null);
      const [annoTextValue, setAnnoTextValue] = useState('');
  
      // Size on mount + resize
      useEffect(() => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth, h = containerRef.current.clientHeight;
        setDimensions({ width: w, height: h });
        setPan({ x: w / 2, y: h / 2 });
      }, []);
      useEffect(() => {
        const fn = () => {
          if (containerRef.current)
            setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
        };
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
      }, []);
  
      // ── Graph state updater ──────────────────────────────────────────────────
      const updateGraph = useCallback((
        nN: Node[], nE: Edge[], nAId: string | null,
        oLA?: number, oGO?: string, oPА?: string | null, nAnno?: Annotation[]
      ) => {
        setPages(prev => {
          const np = [...prev];
          const pg = np[activePageIdx];
          const nLA = oLA !== undefined ? oLA : pg.lastAngle;
          const nGO = oGO !== undefined ? oGO : pg.gridOrientation;
          const nPA = oPА !== undefined ? oPА : pg.prevActiveId;
          const nAn = nAnno !== undefined ? nAnno : pg.annotations;
          const snap: GraphState = { nodes: nN, edges: nE, activeId: nAId, gridOrientation: nGO, annotations: nAn };
          const nH = [...pg.history.slice(0, pg.historyIdx + 1), snap];
          np[activePageIdx] = { ...pg, nodes: nN, edges: nE, activeId: nAId, lastAngle: nLA, gridOrientation: nGO, prevActiveId: nPA, history: nH, historyIdx: nH.length - 1, annotations: nAn };
          return np;
        });
      }, [activePageIdx]);
  
      // ── Page management ──────────────────────────────────────────────────────
      const addPage = () => {
        const p = makeInitialPage(`Page ${pages.length + 1}`);
        setPages(prev => [...prev, p]);
        setActivePageIdx(pages.length);
      };
      const deletePage = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        if (pages.length <= 1) return;
        setPages(prev => prev.filter((_, i) => i !== idx));
        setActivePageIdx(prev => prev >= pages.length - 1 ? pages.length - 2 : prev > idx ? prev - 1 : prev);
      };
      const addFragment = useCallback(() => {
        const j = () => Math.random() * 40 - 20;
        const nId = generateId();
        updateGraph([...nodes, { id: nId, x: -pan.x + dimensions.width / 2 + j(), y: -pan.y + dimensions.height / 2 + j(), label: 'C' }], edges, nId);
      }, [nodes, edges, pan, dimensions, updateGraph]);
  
      // ── History ──────────────────────────────────────────────────────────────
      const undo = useCallback(() => {
        setPages(prev => {
          const pg = prev[activePageIdx];
          if (pg.historyIdx <= 0) return prev;
          const st = pg.history[pg.historyIdx - 1];
          const np = [...prev];
          np[activePageIdx] = { ...pg, ...st, gridOrientation: st.gridOrientation ?? 'vertical', annotations: st.annotations ?? [], historyIdx: pg.historyIdx - 1 };
          return np;
        });
      }, [activePageIdx]);
      const redo = useCallback(() => {
        setPages(prev => {
          const pg = prev[activePageIdx];
          if (pg.historyIdx >= pg.history.length - 1) return prev;
          const st = pg.history[pg.historyIdx + 1];
          const np = [...prev];
          np[activePageIdx] = { ...pg, ...st, gridOrientation: st.gridOrientation ?? 'vertical', annotations: st.annotations ?? [], historyIdx: pg.historyIdx + 1 };
          return np;
        });
      }, [activePageIdx]);
      const clearCanvas = useCallback(() => {
        const fn: Node = { id: generateId(), x: 0, y: 0, label: 'C' };
        updateGraph([fn], [], fn.id, gridOrientation === 'horizontal' ? 30 : 120, gridOrientation, null, []);
      }, [gridOrientation, updateGraph]);
  
      useImperativeHandle(ref, () => ({ clear: clearCanvas, undo, redo }));
  
      // ── Bond / atom operations ────────────────────────────────────────────────
      const deleteLastLine = useCallback(() => {
        if (!activeId) return;
        const findEdgeIdx = () => {
          if (prevActiveId !== null) {
            const i = edges.findIndex(e => (e.n1 === activeId && e.n2 === prevActiveId) || (e.n2 === activeId && e.n1 === prevActiveId));
            if (i !== -1) return i;
          }
          for (let i = edges.length - 1; i >= 0; i--)
            if (edges[i].n1 === activeId || edges[i].n2 === activeId) return i;
          return -1;
        };
        const bI = findEdgeIdx();
        if (bI === -1) { if (nodes.length <= 1) clearCanvas(); return; }
        const rE = edges[bI];
        const nE = edges.filter((_, i) => i !== bI);
        const rId = rE.n1 === activeId ? rE.n2 : rE.n1;
        const tip = !nE.some(e => e.n1 === activeId || e.n2 === activeId);
        const nN = tip ? nodes.filter(n => n.id !== activeId) : nodes;
        if (nN.length === 0) { clearCanvas(); return; }
        const nAId = nN.some(n => n.id === rId) ? rId : nN[nN.length - 1].id;
        const pOR = edges.filter((e, i) => i !== bI && (e.n1 === rId || e.n2 === rId)).map(e => e.n1 === rId ? e.n2 : e.n1).find(id => nN.some(n => n.id === id)) ?? null;
        updateGraph(nN, nE, nAId, undefined, undefined, pOR);
      }, [activeId, prevActiveId, nodes, edges, clearCanvas, updateGraph]);
  
      const BOND_CYCLE: (number | 'wedge' | 'dash')[] = [1, 2, 3, 'wedge', 'dash'];
      const cycleBond = useCallback(() => {
        if (!activeId) return;
        const findEdge = (a: string, b: string) => edges.findIndex(e => (e.n1 === a && e.n2 === b) || (e.n2 === a && e.n1 === b));
        let idx = prevActiveId !== null ? findEdge(activeId, prevActiveId) : -1;
        if (idx === -1) for (let i = edges.length - 1; i >= 0; i--) { if (edges[i].n1 === activeId || edges[i].n2 === activeId) { idx = i; break; } }
        if (idx === -1) return;
        const cur = edges[idx].order;
        const nxt = BOND_CYCLE[(BOND_CYCLE.indexOf(cur) + 1) % BOND_CYCLE.length];
        updateGraph(nodes, edges.map((e, i) => i === idx ? { ...e, order: nxt } : e), activeId);
      }, [activeId, prevActiveId, edges, nodes, updateGraph]);
  
      const setAtomLabel = useCallback((label: string) => {
        if (!activeId) return;
        updateGraph(nodes.map(n => n.id === activeId ? { ...n, label } : n), edges, activeId);
      }, [activeId, nodes, edges, updateGraph]);
  
      const rotateEverything = useCallback(() => {
        const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        updateGraph(nodes.map(n => ({ ...n, x: cx - (n.y - cy), y: cy + (n.x - cx) })), edges, activeId, (lastAngle + 90) % 360, gridOrientation === 'horizontal' ? 'vertical' : 'horizontal');
      }, [nodes, edges, activeId, lastAngle, gridOrientation, updateGraph]);
  
      const flipMolecule = useCallback(() => {
        if (!activeId) return;
        const cI = new Set<string>(); const q = [activeId];
        while (q.length) { const c = q.pop()!; if (cI.has(c)) continue; cI.add(c); edges.forEach(e => { if (e.n1 === c && !cI.has(e.n2)) q.push(e.n2); if (e.n2 === c && !cI.has(e.n1)) q.push(e.n1); }); }
        const cN = nodes.filter(n => cI.has(n.id)); const xs = cN.map(n => n.x); const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        updateGraph(nodes.map(n => cI.has(n.id) ? { ...n, x: 2 * cx - n.x } : n), edges, activeId);
      }, [activeId, nodes, edges, updateGraph]);
  
      const navigateTo = useCallback((tA: number) => {
        if (!activeId) return;
        const ac = nodes.find(n => n.id === activeId); if (!ac) return;
        const nIds = edges.filter(e => e.n1 === activeId || e.n2 === activeId).map(e => e.n1 === activeId ? e.n2 : e.n1);
        let bN: Node | null = null, bD = Infinity;
        nodes.filter(n => nIds.includes(n.id)).forEach(n => {
          const aD = (Math.atan2(ac.y - n.y, n.x - ac.x) * 180 / Math.PI + 360) % 360;
          let d = Math.abs(aD - tA); if (d > 180) d = 360 - d;
          if (d < bD) { bD = d; bN = n; }
        });
        if (bN && bD <= 90) updateGraph(nodes, edges, (bN as Node).id, tA, gridOrientation, activeId);
      }, [activeId, nodes, edges, gridOrientation, updateGraph]);
  
      const drawTo = useCallback((aD: number) => {
        if (!activeId) return;
        const ac = nodes.find(n => n.id === activeId); if (!ac) return;
        const rad = aD * Math.PI / 180;
        const tx = ac.x + BOND_LEN * Math.cos(rad), ty = ac.y - BOND_LEN * Math.sin(rad);
        const sn = nodes.find(n => n.id !== activeId && Math.hypot(n.x - tx, n.y - ty) < SNAP_DIST);
        const tg = sn ?? { id: generateId(), x: tx, y: ty, label: 'C' };
        const nN = sn ? nodes : [...nodes, tg];
        const aB = edges.some(e => (e.n1 === activeId && e.n2 === tg.id) || (e.n2 === activeId && e.n1 === tg.id));
        const nE = aB ? edges : [...edges, { id: generateId(), n1: activeId, n2: tg.id, order: 1 as const }];
        updateGraph(nN, nE, tg.id, aD, gridOrientation, activeId);
      }, [activeId, nodes, edges, gridOrientation, updateGraph]);
  
      // ── Keyboard ──────────────────────────────────────────────────────────────
      const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        onInteract?.();
        const tn = (document.activeElement as HTMLElement).tagName;
        if (!isEditingLabel && (tn === 'INPUT' || tn === 'TEXTAREA')) return;
        if (isEditingLabel) {
          if (e.key === 'Enter') { setAtomLabel(editValue.trim() || 'C'); setIsEditingLabel(false); e.preventDefault(); }
          if (e.key === 'Escape') { setIsEditingLabel(false); e.preventDefault(); }
          return;
        }
        if (activeTool !== 'molecule') return;
        if (e.ctrlKey || e.metaKey) { if (e.key === 'z') { e.shiftKey ? redo() : undo(); e.preventDefault(); } return; }
        const nA: Record<string, number> = { '9': 30, '8': 90, '7': 150, '6': 0, '4': 180, '3': 330, '2': 270, '1': 210 };
        if (nA[e.key] !== undefined) { e.preventDefault(); e.shiftKey ? navigateTo(nA[e.key]) : drawTo(nA[e.key]); return; }
        switch (e.key) {
          case ' ': cycleBond(); e.preventDefault(); break;
          case 'Enter': { const an = nodes.find(n => n.id === activeId); setEditValue(an?.label === 'C' ? '' : (an?.label ?? '')); setIsEditingLabel(true); e.preventDefault(); break; }
          case 'Backspace': case 'Delete': deleteLastLine(); e.preventDefault(); break;
          case 'c': case 'C': setAtomLabel('C'); break;
          case 'o': case 'O': setAtomLabel('O'); break;
          case 'n': case 'N': setAtomLabel('N'); break;
          case 'f': case 'F': setAtomLabel('F'); break;
          case 'p': case 'P': setAtomLabel('P'); break;
          case 's': case 'S': setAtomLabel('S'); break;
          case 'b': case 'B': setAtomLabel('B'); break;
          case 'i': case 'I': setAtomLabel('I'); break;
          case 'h': case 'H': setAtomLabel('H'); break;
        }
      }, [isEditingLabel, editValue, drawTo, navigateTo, cycleBond, deleteLastLine, setAtomLabel, undo, redo, nodes, activeId, activeTool]);
  
      // ── Mouse ─────────────────────────────────────────────────────────────────
      const getCC = useCallback((e: React.MouseEvent) => {
        const r = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }, []);
      const DRAG_THRESHOLD = 6;
  
      const handleMouseDown = useCallback((e: React.MouseEvent) => {
        onInteract?.();
        if (!canvasRef.current) return;
        const { x: cx, y: cy } = getCC(e);
        const mx = cx - pan.x, my = cy - pan.y;
        if (activeTool === 'molecule') {
          const sN = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < SNAP_DIST * 1.5);
          if (sN) { updateGraph(nodes, edges, sN.id, undefined, undefined, activeId); }
          else { const sg = snapToGrid(cx, cy, pan.x, pan.y); setMouseDown({ x: e.clientX, y: e.clientY, canvasX: sg.x, canvasY: sg.y }); }
        } else if (activeTool === 'text') {
          setPendingTextPos({ x: cx, y: cy }); setAnnoTextValue('');
        } else { setAnnoStart({ x: cx, y: cy }); setAnnoPreview({ x: cx, y: cy }); }
      }, [pan, nodes, edges, activeId, updateGraph, onInteract, activeTool, getCC]);
  
      const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (activeTool === 'molecule') {
          if (mouseDown && !isPanning && Math.hypot(e.clientX - mouseDown.x, e.clientY - mouseDown.y) > DRAG_THRESHOLD) { setIsPanning(true); setMouseDown(null); }
          if (isPanning) setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
        } else if (annoStart) {
          const { x: cx, y: cy } = getCC(e); setAnnoPreview({ x: cx, y: cy });
        }
      }, [mouseDown, isPanning, activeTool, annoStart, getCC]);
  
      const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (activeTool === 'molecule') {
          if (mouseDown) {
            const nId = generateId();
            updateGraph([...nodes, { id: nId, x: mouseDown.canvasX, y: mouseDown.canvasY, label: 'C' }], edges, nId, undefined, undefined, null);
          }
          setMouseDown(null); setIsPanning(false);
        } else if (activeTool !== 'text' && annoStart) {
          const { x: cx, y: cy } = getCC(e);
          if (Math.hypot(cx - annoStart.x, cy - annoStart.y) < 5) { setAnnoStart(null); setAnnoPreview(null); return; }
          const nA: Annotation = { id: generateId(), type: activeTool, x1: annoStart.x, y1: annoStart.y, x2: cx, y2: cy };
          if (activeTool === 'curved') {
            const mX = (annoStart.x + cx) / 2, mY = (annoStart.y + cy) / 2;
            const dx = cx - annoStart.x, dy = cy - annoStart.y, len = Math.hypot(dx, dy);
            nA.cpx = mX - dy / len * 50; nA.cpy = mY + dx / len * 50;
          }
          updateGraph(nodes, edges, activeId, undefined, undefined, undefined, [...annotations, nA]);
          setAnnoStart(null); setAnnoPreview(null);
        }
      }, [activeTool, mouseDown, annoStart, nodes, edges, activeId, annotations, updateGraph, getCC]);
  
      const handleMouseLeave = () => { setMouseDown(null); setIsPanning(false); setAnnoStart(null); setAnnoPreview(null); };
  
      // ── Molecule canvas render ────────────────────────────────────────────────
      useEffect(() => {
        const cv = canvasRef.current; if (!cv) return;
        const dpr = window.devicePixelRatio || 1;
        cv.width = dimensions.width * dpr; cv.height = dimensions.height * dpr;
        cv.style.width = `${dimensions.width}px`; cv.style.height = `${dimensions.height}px`;
        const ctx = cv.getContext('2d')!; ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  
        const calcEdge = (n1: Node, n2: Node) => {
          const th = Math.atan2(n2.y - n1.y, n2.x - n1.x);
          return {
            x1: n1.x + pan.x + Math.cos(th) * labelRadius(n1.label),
            y1: n1.y + pan.y + Math.sin(th) * labelRadius(n1.label),
            x2: n2.x + pan.x - Math.cos(th) * labelRadius(n2.label),
            y2: n2.y + pan.y - Math.sin(th) * labelRadius(n2.label),
            theta: th,
          };
        };
  
        edges.forEach(edge => {
          const n1 = nodes.find(n => n.id === edge.n1), n2 = nodes.find(n => n.id === edge.n2);
          if (!n1 || !n2) return;
          const { x1, y1, x2, y2, theta: th } = calcEdge(n1, n2);
          const ox = -Math.sin(th) * BOND_OFFSET, oy = Math.cos(th) * BOND_OFFSET;
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.5;
          if (edge.order === 1) {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          } else if (edge.order === 2) {
            ctx.beginPath(); ctx.moveTo(x1 + ox, y1 + oy); ctx.lineTo(x2 + ox, y2 + oy); ctx.moveTo(x1 - ox, y1 - oy); ctx.lineTo(x2 - ox, y2 - oy); ctx.stroke();
          } else if (edge.order === 3) {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.moveTo(x1 + ox * 1.8, y1 + oy * 1.8); ctx.lineTo(x2 + ox * 1.8, y2 + oy * 1.8); ctx.moveTo(x1 - ox * 1.8, y1 - oy * 1.8); ctx.lineTo(x2 - ox * 1.8, y2 - oy * 1.8); ctx.stroke();
          } else if (edge.order === 'wedge') {
            const hw = 5.5, px = -Math.sin(th), py = Math.cos(th);
            ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 + px * hw, y2 + py * hw); ctx.lineTo(x2 - px * hw, y2 - py * hw); ctx.closePath(); ctx.fill();
          } else if (edge.order === 'dash') {
            const px = -Math.sin(th), py = Math.cos(th); ctx.lineWidth = 1.8; ctx.beginPath();
            for (let d = 0; d <= 6; d++) { const t = d / 6, bx = x1 + (x2 - x1) * t, by = y1 + (y2 - y1) * t, half = 5.5 * t; ctx.moveTo(bx + px * half, by + py * half); ctx.lineTo(bx - px * half, by - py * half); }
            ctx.stroke();
          }
        });
  
        nodes.forEach(n => {
          const x = n.x + pan.x, y = n.y + pan.y;
          if (n.id === activeId) {
            const hR = n.label === 'C' ? 18 : n.label.length > 1 ? 26 : 20;
            ctx.fillStyle = 'rgba(59,130,246,0.12)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x, y, hR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
          if (n.label === 'C') return;
          const color = ELEMENT_COLORS[n.label[0]] ?? '#1e293b';
          ctx.font = 'bold 18px Georgia, serif';
          const fw = ctx.measureText(n.label).width;
          ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.ellipse(x, y, fw / 2 + 4, 13, 0, 0, Math.PI * 2); ctx.fill();
          let cx2 = x - fw / 2;
          n.label.split(/(\d+)/).forEach(part => {
            if (!part) return;
            const isD = /^\d+$/.test(part);
            ctx.font = isD ? 'bold 12px Georgia, serif' : 'bold 18px Georgia, serif';
            ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = isD ? 'alphabetic' : 'middle';
            const tw = ctx.measureText(part).width; ctx.fillText(part, cx2, isD ? y + 7 : y + 1); cx2 += tw;
          });
        });
      }, [nodes, edges, activeId, pan, dimensions]);
  
      // ── Annotation canvas render ──────────────────────────────────────────────
      useEffect(() => {
        const cv = annoRef.current; if (!cv) return;
        const dpr = window.devicePixelRatio || 1;
        cv.width = dimensions.width * dpr; cv.height = dimensions.height * dpr;
        cv.style.width = `${dimensions.width}px`; cv.style.height = `${dimensions.height}px`;
        const ctx = cv.getContext('2d')!; ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  
        const all = [...annotations];
        if (annoStart && annoPreview && activeTool !== 'molecule' && activeTool !== 'text') {
          const dx = annoPreview.x - annoStart.x, dy = annoPreview.y - annoStart.y, len = Math.hypot(dx, dy) + 0.001;
          all.push({
            id: '__prev__', type: activeTool,
            x1: annoStart.x, y1: annoStart.y, x2: annoPreview.x, y2: annoPreview.y,
            cpx: activeTool === 'curved' ? (annoStart.x + annoPreview.x) / 2 - dy / len * 50 : undefined,
            cpy: activeTool === 'curved' ? (annoStart.y + annoPreview.y) / 2 + dx / len * 50 : undefined,
            preview: true,
          });
        }
  
        all.forEach(a => {
          const color = a.preview ? '#94a3b8' : '#1e293b';
          ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
          if (a.type === 'straight') {
            ctx.beginPath(); ctx.moveTo(a.x1!, a.y1!); ctx.lineTo(a.x2!, a.y2!); ctx.stroke();
            arrowHead(ctx, a.x1!, a.y1!, a.x2!, a.y2!, 11);
          } else if (a.type === 'equilibrium') {
            const th = Math.atan2(a.y2! - a.y1!, a.x2! - a.x1!);
            const px = -Math.sin(th) * 4, py = Math.cos(th) * 4;
            ctx.beginPath(); ctx.moveTo(a.x1! + px, a.y1! + py); ctx.lineTo(a.x2! + px, a.y2! + py); ctx.stroke(); arrowHead(ctx, a.x1! + px, a.y1! + py, a.x2! + px, a.y2! + py, 10);
            ctx.beginPath(); ctx.moveTo(a.x2! - px, a.y2! - py); ctx.lineTo(a.x1! - px, a.y1! - py); ctx.stroke(); arrowHead(ctx, a.x2! - px, a.y2! - py, a.x1! - px, a.y1! - py, 10);
          } else if (a.type === 'curved') {
            drawCurvedArrow(ctx, a.x1!, a.y1!, a.x2!, a.y2!, a.cpx!, a.cpy!, color);
          } else if (a.type === 'text' && a.text) {
            ctx.font = 'bold 16px Georgia, serif'; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(a.text, a.x!, a.y!);
          }
        });
      }, [annotations, annoStart, annoPreview, activeTool, dimensions]);
  
      // ── Export ────────────────────────────────────────────────────────────────
      const exportPNG = useCallback(() => {
        const cv = canvasRef.current; if (!cv) return;
        const dpr = window.devicePixelRatio || 1;
        const off = document.createElement('canvas'); off.width = cv.width; off.height = cv.height;
        const ctx = off.getContext('2d')!; ctx.scale(dpr, dpr);
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        ctx.drawImage(cv, 0, 0, dimensions.width, dimensions.height);
        if (annoRef.current) ctx.drawImage(annoRef.current, 0, 0, dimensions.width, dimensions.height);
        const link = document.createElement('a'); link.download = 'molecule.png'; link.href = off.toDataURL('image/png'); link.click();
      }, [dimensions]);
  
      const commitText = () => {
        if (!pendingTextPos || !annoTextValue.trim()) return;
        updateGraph(nodes, edges, activeId, undefined, undefined, undefined, [...annotations, { id: generateId(), type: 'text', x: pendingTextPos.x, y: pendingTextPos.y, text: annoTextValue.trim() }]);
        setPendingTextPos(null); setAnnoTextValue('');
      };
      const deleteLastAnnotation = () => {
        if (annotations.length === 0) return;
        updateGraph(nodes, edges, activeId, undefined, undefined, undefined, annotations.slice(0, -1));
      };
  
      // ── Styles ────────────────────────────────────────────────────────────────
      const S = {
        root:     { display: 'flex', width: '100%', height: '100%', background: '#f8fafc', overflow: 'hidden' } as React.CSSProperties,
        sidebar:  { width: 214, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' as const, flexShrink: 0 },
        sideHead: { padding: '12px 14px', borderBottom: '1px solid #f1f5f9' },
        sideBody: { padding: 10, display: 'flex', flexDirection: 'column' as const, gap: 10, overflowY: 'auto' as const, flex: 1 },
        card:     { background: '#f8fafc', borderRadius: 8, padding: 10, border: '1px solid #e2e8f0' },
        cardTitle:{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 },
        btn: (extra: React.CSSProperties = {}) => ({ padding: '7px 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, ...extra } as React.CSSProperties),
        toolBtn: (active: boolean) => ({ padding: '8px 0', background: active ? '#4A0E0E' : '#fff', border: active ? '1.5px solid #4A0E0E' : '1px solid #e2e8f0', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: active ? '#fff' : '#475569', transition: 'all 0.15s' } as React.CSSProperties),
        drawing:  { flex: 1, display: 'flex', flexDirection: 'column' as const, outline: 'none' },
        tabs:     { display: 'flex', background: 'rgba(226,232,240,0.5)', borderBottom: '1px solid #cbd5e1', paddingTop: 6, paddingLeft: 8, gap: 4, overflowX: 'auto' as const, flexShrink: 0 },
      };
  
      const toolsData = [
        { id: 'molecule',    label: 'Molecule',  icon: <IMol size={13} /> },
        { id: 'straight',    label: 'Arrow →',   icon: <IArrow size={13} /> },
        { id: 'equilibrium', label: 'Equil. ⇌',  icon: <IEquil size={13} /> },
        { id: 'curved',      label: 'Curved ↷',  icon: <ICurve size={13} /> },
        { id: 'text',        label: 'Text',       icon: <IText size={13} /> },
      ];
  
      const gridBg = `url("data:image/svg+xml,%3Csvg width='86.6025' height='150' viewBox='0 0 86.6025 150' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='43.3013' cy='0' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='0' cy='25' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='86.6025' cy='25' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='0' cy='75' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='86.6025' cy='75' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='43.3013' cy='100' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='43.3013' cy='150' r='2' fill='%23cbd5e1'/%3E%3C/svg%3E")`;
  
      return (
        <div style={S.root}>
          {/* Sidebar */}
          <div style={S.sidebar}>
            <div style={S.sideHead}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#334155' }}>Drawing Tools</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Molecule + Annotations</div>
            </div>
            <div style={S.sideBody}>
              <div style={S.card}>
                <div style={S.cardTitle}>Active Tool</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  {toolsData.map(t => (
                    <button key={t.id} onClick={() => setActiveTool(t.id)} style={S.toolBtn(activeTool === t.id)}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
  
              {activeTool === 'molecule' && (
                <div style={S.card}>
                  <div style={S.cardTitle}><IType size={12} /> Groups</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {['OH', 'HO', 'NH2', 'COOH', 'CH3', 'Ph', 'Cl', 'Br', 'NO2', 'CHO'].map(g => (
                      <button key={g} onClick={() => setAtomLabel(g)} style={{ padding: '2px 7px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>{g}</button>
                    ))}
                  </div>
                </div>
              )}
  
              {activeTool === 'molecule' && (
                <div style={S.card}>
                  <div style={S.cardTitle}><IPtr size={12} /> Shortcuts</div>
                  {[['Draw bond', '1–9'], ['Navigate', 'Shift+Num'], ['Cycle bond', 'Space'], ['Label', 'Enter'], ['Delete', 'Del'], ['Undo/Redo', 'Ctrl+Z/⇧Z']].map(([l, k]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, fontSize: 11, color: '#64748b' }}>
                      <span>{l}</span>
                      <kbd style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 3, padding: '1px 5px', fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{k}</kbd>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 5 }}>Bond cycle</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {[['─', 'Single'], ['═', 'Double'], ['≡', 'Triple'], ['▶', 'Wedge'], ['┅▶', 'Dash']].map(([s, d]) => (
                        <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 3, padding: '1px 5px', fontSize: 12, fontFamily: 'monospace' }}>{s}</span>
                          <span style={{ fontSize: 9, color: '#94a3b8' }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
  
              {activeTool !== 'molecule' && (
                <div style={S.card}>
                  <div style={S.cardTitle}>How to use</div>
                  {activeTool === 'text'        && <div style={{ fontSize: 11, color: '#64748b' }}>Click anywhere to place a text label.</div>}
                  {activeTool === 'straight'    && <div style={{ fontSize: 11, color: '#64748b' }}>Click and drag to draw a reaction arrow →</div>}
                  {activeTool === 'equilibrium' && <div style={{ fontSize: 11, color: '#64748b' }}>Click and drag to draw an equilibrium arrow ⇌</div>}
                  {activeTool === 'curved'      && <div style={{ fontSize: 11, color: '#64748b' }}>Click and drag to draw a curved electron-pushing arrow.</div>}
                  <button onClick={deleteLastAnnotation} style={{ ...S.btn({ color: '#ef4444', marginTop: 8 }), width: '100%' }}><ITrash size={12} /> Remove Last</button>
                </div>
              )}
  
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button onClick={undo} disabled={historyIdx === 0} style={S.btn({ opacity: historyIdx === 0 ? 0.4 : 1 })}><IUndo size={12} /> Undo</button>
                  <button onClick={redo} disabled={historyIdx === history.length - 1} style={S.btn({ opacity: historyIdx === history.length - 1 ? 0.4 : 1 })}><IRedo size={12} /> Redo</button>
                </div>
                {activeTool === 'molecule' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
                    <button onClick={addFragment} style={S.btn({ background: '#eef2ff', color: '#4f46e5', border: '1px solid #e0e7ff' })}><IPlus size={11} /> Frag.</button>
                    <button onClick={rotateEverything} style={S.btn()}><IRotate size={11} /> Rotate</button>
                    <button onClick={flipMolecule} style={S.btn()}><IFlip size={11} /> Flip</button>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button onClick={exportPNG} style={S.btn({ background: '#f1f5f9' })}><IDl size={12} /> Export</button>
                  <button onClick={clearCanvas} style={S.btn({ color: '#ef4444' })}><ITrash size={12} /> Clear All</button>
                </div>
              </div>
            </div>
          </div>
  
          {/* Drawing area */}
          <div style={S.drawing} tabIndex={0} onKeyDown={handleKeyDown}>
            {/* Page tabs */}
            <div style={S.tabs}>
              {pages.map((p, idx) => (
                <div key={p.id} onClick={() => setActivePageIdx(idx)} style={{ position: 'relative', padding: '5px 12px', fontSize: 12, fontWeight: 500, border: '1px solid', borderBottom: 'none', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', borderColor: idx === activePageIdx ? '#cbd5e1' : 'transparent', background: idx === activePageIdx ? '#f8fafc' : 'rgba(241,245,249,0.5)', color: idx === activePageIdx ? '#2563eb' : '#64748b' }}>
                  {p.name}
                  {pages.length > 1 && (
                    <button onClick={e => deletePage(e, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8', display: 'flex', borderRadius: '50%' }}>
                      <IX size={9} sw={2.5} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addPage} style={{ marginBottom: 4, marginLeft: 4, padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                <IPlus size={13} />
              </button>
            </div>
  
            {/* Canvas container */}
            <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: activeTool === 'text' ? 'text' : 'crosshair', background: '#f8fafc', backgroundImage: gridBg, backgroundPosition: `${pan.x}px ${pan.y - 25}px` }}>
              <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} style={{ position: 'absolute', inset: 0, zIndex: 1, touchAction: 'none' }} />
              <canvas ref={annoRef}   onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} style={{ position: 'absolute', inset: 0, zIndex: 2, touchAction: 'none', pointerEvents: activeTool === 'molecule' ? 'none' : 'auto' }} />
  
              {/* Atom label editor */}
              {isEditingLabel && (() => {
                const an = nodes.find(n => n.id === activeId); if (!an) return null;
                return (
                  <div style={{ position: 'absolute', zIndex: 40, background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #3b82f6', left: an.x + pan.x, top: an.y + pan.y - 52, transform: 'translateX(-50%)' }}>
                    <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Label"
                      style={{ background: '#f8fafc', padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none', fontWeight: 700, fontSize: 16, width: 80, textAlign: 'center' }}
                      onKeyDown={e => { if (e.key === 'Enter') { setAtomLabel(editValue.trim() || 'C'); setIsEditingLabel(false); } if (e.key === 'Escape') setIsEditingLabel(false); e.stopPropagation(); }} />
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>Enter to save · Esc to cancel</div>
                  </div>
                );
              })()}
  
              {/* Text annotation input */}
              {pendingTextPos && (
                <div style={{ position: 'absolute', zIndex: 40, background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.18)', border: '1px solid #E6B325', left: pendingTextPos.x, top: pendingTextPos.y - 40, transform: 'translateX(-50%)' }}>
                  <input autoFocus value={annoTextValue} onChange={e => setAnnoTextValue(e.target.value)} placeholder="Type label…"
                    style={{ background: '#f8fafc', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none', fontWeight: 600, fontSize: 14, width: 150, textAlign: 'left' }}
                    onKeyDown={e => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') setPendingTextPos(null); e.stopPropagation(); }} />
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>Enter to place · Esc to cancel</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  );
  
  export default SkeletonCanvas;
  