import React from 'react';
import { IBeaker, IBook, IBookTxt, IPlay } from './Icons';
import { Chapter } from '../data/textbookData';
import { Filter } from '../utils/questionGenerator';

interface Props {
  textbookData: Chapter[];
  selectedFilter: Filter | null;
  expandedChapters: Set<number>;
  onToggleChapter: (id: number) => void;
  onSelectChapter: (chapter: Chapter) => void;
  onSelectLesson:  (lesson: { id: string; title: string; topics: string[] }) => void;
}

export default function Sidebar({
  textbookData, selectedFilter, expandedChapters,
  onToggleChapter, onSelectChapter, onSelectLesson,
}: Props) {
  return (
    <div style={{ width: 248, background: '#4A0E0E', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 16px rgba(0,0,0,0.2)', flexShrink: 0, zIndex: 20 }}>

      {/* Logo */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#3D0B0B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <IBeaker />
          <span style={{ fontWeight: 900, fontSize: 17 }}>ChemQuiz</span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2 }}>
          CHEM 351 · BYU-Idaho
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        <div style={{ padding: '0 16px 6px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Textbook Chapters
        </div>

        {textbookData.map(chapter => {
          const isExpanded = expandedChapters.has(chapter.id);
          const isSelected = selectedFilter?.type === 'chapter' && selectedFilter?.id === chapter.id;

          return (
            <div key={chapter.id} style={{ marginBottom: 2 }}>
              {/* Chapter row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <button
                  onClick={() => onToggleChapter(chapter.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 0', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', transform: isExpanded ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s', lineHeight: 1 }}>▶</span>
                  <IBook size={13} />
                  <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, color: isSelected ? '#E6B325' : 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
                    {chapter.title}
                  </span>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onSelectChapter(chapter); }}
                  title="Practice this chapter"
                  style={{ background: isSelected ? 'rgba(230,179,37,0.2)' : 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 5, color: isSelected ? '#E6B325' : 'rgba(255,255,255,0.3)', display: 'flex', flexShrink: 0 }}
                >
                  <IPlay size={11} />
                </button>
              </div>

              {/* Lesson list */}
              {isExpanded && (
                <div style={{ paddingLeft: 36, paddingRight: 10, paddingBottom: 4, borderLeft: '2px solid rgba(255,255,255,0.08)', marginLeft: 18 }}>
                  {chapter.lessons.map(lesson => {
                    const isSel = selectedFilter?.type === 'lesson' && selectedFilter?.id === lesson.id;
                    return (
                      <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0' }}>
                        <button
                          onClick={() => onSelectLesson(lesson)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left' }}
                        >
                          <IBookTxt size={11} />
                          <span style={{ fontSize: 11, color: isSel ? '#E6B325' : 'rgba(255,255,255,0.65)', fontWeight: isSel ? 700 : 400, lineHeight: 1.3 }}>
                            {lesson.title}
                          </span>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); onSelectLesson(lesson); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: 'rgba(255,255,255,0.25)', display: 'flex', flexShrink: 0 }}
                        >
                          <IPlay size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
