import React from 'react';
import { IEye, ICheck, IX, IChevR } from './Icons';
import { Question } from '../data/questionBank';
import { Filter, TYPE_HEADERS } from '../utils/questionGenerator';

interface Props {
  currentQuestion: Question | null;
  selectedFilter: Filter | null;
  showAnswer: boolean;
  isCorrect: boolean;
  onShowAnswer: () => void;
  onGradeToggle: () => void;
  onNextQuestion: () => void;
}

export default function QuestionPanel({
  currentQuestion, selectedFilter,
  showAnswer, isCorrect,
  onShowAnswer, onGradeToggle, onNextQuestion,
}: Props) {
  const qTypeLabel = currentQuestion ? (TYPE_HEADERS[currentQuestion.type] ?? currentQuestion.prompt) : '';

  return (
    <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: 0, zIndex: 20, boxShadow: '0 -4px 20px rgba(0,0,0,0.04)' }}>

      {/* Answer reveal */}
      {showAnswer && currentQuestion && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0fdf4', background: '#f0fdf4', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 38, height: 38, background: '#22c55e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IEye size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Answer</div>
            {currentQuestion.structureImage && (
              <img
                src={`/answers/${currentQuestion.id}.png`}
                alt="answer structure"
                style={{ maxHeight: 160, maxWidth: '100%', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 8, background: '#fff', padding: 8 }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.6, fontFamily: 'Georgia, serif' }}>
              {currentQuestion.answerText}
            </div>
          </div>
        </div>
      )}

      {/* Question + controls */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, minHeight: 120 }}>

        {/* Q badge */}
        <div style={{ width: 42, height: 42, background: '#E6B325', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A0E0E', flexShrink: 0, boxShadow: '0 4px 12px rgba(230,179,37,0.35)' }}>
          <span style={{ fontWeight: 900, fontSize: 19 }}>Q</span>
        </div>

        {currentQuestion ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
              {selectedFilter && <span style={{ fontSize: 10, fontWeight: 700, color: '#4A0E0E', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>{selectedFilter.title}</span>}
              {selectedFilter && <IChevR size={10} />}
              <span style={{ fontSize: 10, fontWeight: 700, color: '#E6B325', textTransform: 'uppercase', letterSpacing: 1 }}>{currentQuestion.topic}</span>
              <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>
                {'★'.repeat(currentQuestion.difficulty) + '☆'.repeat(5 - currentQuestion.difficulty)}
              </span>
            </div>

            {/* Type header */}
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>{qTypeLabel}</div>

            {/* Specific prompt */}
            {currentQuestion.prompt !== qTypeLabel && (
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 6, fontStyle: 'italic' }}>{currentQuestion.prompt}</div>
            )}

            {/* Reagents */}
            {currentQuestion.reagents && (
              <div style={{ fontSize: 16, fontFamily: 'Georgia, serif', color: '#1e293b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', display: 'inline-block', marginTop: 4 }}>
                {currentQuestion.reagents}
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: 14, minHeight: 80 }}>
            Select a chapter or lesson in the sidebar, or click a topic below to begin.
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, width: 152 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Action</div>

          <button onClick={onNextQuestion} style={{ width: '100%', padding: '8px 0', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Next Question
          </button>

          <button
            onClick={onShowAnswer}
            disabled={showAnswer}
            style={{ width: '100%', padding: '7px 0', background: showAnswer ? '#22c55e' : '#4A0E0E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: showAnswer ? 'not-allowed' : 'pointer', opacity: currentQuestion ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
          >
            <IEye size={14} /> {showAnswer ? 'Answer Shown' : 'Show Answer'}
          </button>

          {/* Grade toggle — only visible after showing answer */}
          <button
            onClick={onGradeToggle}
            style={{ width: '100%', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: showAnswer ? 'pointer' : 'default', border: isCorrect ? '2px solid #16a34a' : '2px solid #c99a1a', background: isCorrect ? '#22c55e' : '#E6B325', color: isCorrect ? '#fff' : '#4A0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: showAnswer ? 1 : 0, pointerEvents: showAnswer ? 'auto' : 'none', boxShadow: isCorrect ? '0 2px 10px rgba(34,197,94,0.35)' : '0 2px 10px rgba(230,179,37,0.35)', transition: 'opacity 0.2s,background 0.2s' }}
          >
            {isCorrect ? <><ICheck size={14} sw={3} /> Correct</> : <><IX size={14} sw={2.5} /> Incorrect</>}
          </button>
        </div>
      </div>
    </div>
  );
}
