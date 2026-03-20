import React, { useState, useCallback, useRef } from 'react';

import { textbookData }                         from './data/textbookData';
import { questionBank }                          from './data/questionBank';
import { generateQuestion, Filter, TopicStatsMap, TYPE_HEADERS } from './utils/questionGenerator';
import SkeletonCanvas, { SkeletonCanvasHandle } from './components/SkeletonCanvas';
import Sidebar                                   from './components/Sidebar';
import QuestionPanel                             from './components/QuestionPanel';
import { IChevD, ICheck, IX, IUndo, IRedo, ITrash } from './components/Icons';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the list of topics available under the current filter. */
function getTopicsForFilter(filter: Filter | null): string[] {
  if (!filter) return [...new Set(questionBank.map(q => q.topic))];
  if (filter.type === 'chapter') {
    const ch = textbookData.find(c => c.id === filter.id);
    return ch ? [...new Set(ch.lessons.flatMap(l => l.topics))] : [];
  }
  if (filter.type === 'lesson') {
    for (const ch of textbookData) {
      const ls = ch.lessons.find(l => l.id === filter.id);
      if (ls) return ls.topics;
    }
  }
  return [];
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [expandedChapters, setExpandedChapters] = useState(new Set<number>());
  const [selectedFilter,   setSelectedFilter]   = useState<Filter | null>(null);
  const [currentQuestion,  setCurrentQuestion]  = useState<ReturnType<typeof generateQuestion>>(null);
  const [lastQuestionId,   setLastQuestionId]   = useState<string | null>(null);
  const [openDropdown,     setOpenDropdown]      = useState<string | null>(null);
  const [showAnswer,       setShowAnswer]        = useState(false);
  const [isCorrect,        setIsCorrect]         = useState(false);
  const [topicStats,       setTopicStats]        = useState<TopicStatsMap>({});
  const [activeTool,       setActiveTool]        = useState('molecule');
  const canvasRef = useRef<SkeletonCanvasHandle>(null);

  // ── Question picking ────────────────────────────────────────────────────────
  const pickNextQuestion = useCallback((filter: Filter | null = selectedFilter) => {
    const q = generateQuestion(filter, topicStats, lastQuestionId, 'smart');
    if (!q) return;
    setCurrentQuestion(q);
    setLastQuestionId(q.id);
    setShowAnswer(false);
    setIsCorrect(false);
    setTimeout(() => canvasRef.current?.clear(), 100);
  }, [selectedFilter, topicStats, lastQuestionId]);

  // ── Grading ─────────────────────────────────────────────────────────────────
  const handleGradeToggle = () => {
    if (!currentQuestion) return;
    const nextCorrect = !isCorrect;
    setIsCorrect(nextCorrect);
    const topic = currentQuestion.topic;
    setTopicStats(prev => {
      const ex = prev[topic] ?? { mastered: 0, needsWork: 0 };
      return {
        ...prev,
        [topic]: nextCorrect
          ? { mastered: ex.mastered + 1, needsWork: Math.max(0, ex.needsWork - 1) }
          : { mastered: Math.max(0, ex.mastered - 1), needsWork: ex.needsWork + 1 },
      };
    });
  };

  // ── Filter selection ─────────────────────────────────────────────────────────
  const handleSelectChapter = (chapter: typeof textbookData[0]) => {
    const filter: Filter = { type: 'chapter', id: chapter.id, title: chapter.title };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };
  const handleSelectLesson = (lesson: { id: string; title: string; topics: string[] }) => {
    const filter: Filter = { type: 'lesson', id: lesson.id, title: lesson.title };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };
  const handleSelectTopic = (topic: string) => {
    const filter: Filter = { type: 'topic', topic, title: topic };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };

  const toggleChapter = (id: number) => {
    const s = new Set(expandedChapters);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedChapters(s);
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const masteredTopics  = Object.entries(topicStats).filter(([, s]) => s.mastered  > 0).sort((a, b) => b[1].mastered  - a[1].mastered);
  const needsWorkTopics = Object.entries(topicStats).filter(([, s]) => s.needsWork > 0).sort((a, b) => b[1].needsWork - a[1].needsWork);

  // ── Styles ────────────────────────────────────────────────────────────────────
  const hdrBtn = (active: boolean, ac = '#E6B325', ab = '#f8fafc') => ({
    height: '100%', padding: '0 14px',
    background: active ? ab : 'none',
    border: 'none',
    borderBottom: active ? `2px solid ${ac}` : '2px solid transparent',
    fontWeight: 700, fontSize: 13, color: active ? '#4A0E0E' : '#64748b',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  } as React.CSSProperties);

  const dropPanel: React.CSSProperties = {
    position: 'absolute', top: 56, left: 0, minWidth: 260,
    background: '#fff', border: '1px solid #e2e8f0',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderRadius: '0 0 12px 12px', zIndex: 50, overflow: 'hidden',
  };

  return (
    <div
      style={{ display: 'flex', height: '100vh', width: '100vw', background: '#FDFCF0', fontFamily: 'sans-serif', color: '#1e293b', overflow: 'hidden' }}
      onClick={() => setOpenDropdown(null)}
    >
      {/* ── Left sidebar ── */}
      <Sidebar
        textbookData={textbookData}
        selectedFilter={selectedFilter}
        expandedChapters={expandedChapters}
        onToggleChapter={toggleChapter}
        onSelectChapter={handleSelectChapter}
        onSelectLesson={handleSelectLesson}
      />

      {/* ── Right column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div
          style={{ height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', paddingLeft: 12, paddingRight: 16, gap: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', zIndex: 30, flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Topics dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setOpenDropdown(openDropdown === 'topics' ? null : 'topics')} style={hdrBtn(openDropdown === 'topics')}>
              Topics <IChevD size={12} />
            </button>
            {openDropdown === 'topics' && (
              <div style={dropPanel}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Current Focus</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#4A0E0E', marginTop: 2 }}>{selectedFilter?.title ?? 'All Topics'}</div>
                </div>
                <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                  {getTopicsForFilter(selectedFilter).map((topic, idx) => {
                    const isActive = selectedFilter?.type === 'topic' && selectedFilter?.topic === topic;
                    return (
                      <button key={idx} onClick={() => handleSelectTopic(topic)}
                        style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, background: isActive ? 'rgba(230,179,37,0.12)' : '#fff', color: isActive ? '#4A0E0E' : '#475569', fontWeight: isActive ? 700 : 400, border: 'none', borderLeft: isActive ? '2px solid #E6B325' : '2px solid transparent', cursor: 'pointer', display: 'block' }}>
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mastered dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setOpenDropdown(openDropdown === 'mastered' ? null : 'mastered')} style={hdrBtn(openDropdown === 'mastered', '#22c55e', '#f0fdf4')}>
              <ICheck size={12} sw={3} /> Mastered
              {masteredTopics.length > 0 && <span style={{ background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 900, borderRadius: 999, padding: '1px 6px' }}>{masteredTopics.length}</span>}
              <IChevD size={12} />
            </button>
            {openDropdown === 'mastered' && (
              <div style={dropPanel}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#f0fdf4' }}>
                  <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Topics You've Mastered</div>
                </div>
                {masteredTopics.length === 0
                  ? <div style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Grade some questions to populate this list.</div>
                  : <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                      {masteredTopics.map(([topic, stats]) => (
                        <button key={topic} onClick={() => handleSelectTopic(topic)}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, background: '#fff', color: '#334155', fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{topic}</span>
                          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><ICheck size={10} sw={3} /> {stats.mastered}</span>
                        </button>
                      ))}
                    </div>}
              </div>
            )}
          </div>

          {/* Needs Work dropdown */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setOpenDropdown(openDropdown === 'needswork' ? null : 'needswork')} style={hdrBtn(openDropdown === 'needswork', '#E6B325', '#fefce8')}>
              <IX size={12} sw={3} /> Needs Work
              {needsWorkTopics.length > 0 && <span style={{ background: '#E6B325', color: '#4A0E0E', fontSize: 10, fontWeight: 900, borderRadius: 999, padding: '1px 6px' }}>{needsWorkTopics.length}</span>}
              <IChevD size={12} />
            </button>
            {openDropdown === 'needswork' && (
              <div style={dropPanel}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: '#fefce8' }}>
                  <div style={{ fontSize: 10, color: '#a16207', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Needs More Practice</div>
                </div>
                {needsWorkTopics.length === 0
                  ? <div style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>No flagged topics yet.</div>
                  : <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                      {needsWorkTopics.map(([topic, stats]) => (
                        <button key={topic} onClick={() => handleSelectTopic(topic)}
                          style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, background: '#fff', color: '#334155', fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{topic}</span>
                          <span style={{ background: 'rgba(230,179,37,0.25)', color: '#4A0E0E', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><IX size={10} sw={3} /> {stats.needsWork}</span>
                        </button>
                      ))}
                    </div>}
              </div>
            )}
          </div>

          {/* Canvas controls */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => canvasRef.current?.undo()} title="Undo" style={{ padding: 7, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 6, display: 'flex' }}><IUndo size={15} /></button>
            <button onClick={() => canvasRef.current?.redo()} title="Redo" style={{ padding: 7, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 6, display: 'flex' }}><IRedo size={15} /></button>
            <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />
            <button onClick={() => canvasRef.current?.clear()} title="Clear" style={{ padding: 7, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 6, display: 'flex' }}><ITrash size={15} /></button>
          </div>
        </div>

        {/* Canvas workspace */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 10, minHeight: 0 }} onClick={() => setOpenDropdown(null)}>
          <SkeletonCanvas ref={canvasRef} onInteract={() => setOpenDropdown(null)} activeTool={activeTool} setActiveTool={setActiveTool} />
        </div>

        {/* Question panel */}
        <QuestionPanel
          currentQuestion={currentQuestion}
          selectedFilter={selectedFilter}
          showAnswer={showAnswer}
          isCorrect={isCorrect}
          onShowAnswer={() => setShowAnswer(true)}
          onGradeToggle={handleGradeToggle}
          onNextQuestion={() => pickNextQuestion()}
        />
      </div>
    </div>
  );
}
