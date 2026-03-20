import { questionBank, Question } from '../data/questionBank';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Filter {
  type: 'chapter' | 'lesson' | 'topic';
  id?: number | string;
  topic?: string;
  title?: string;
}

export interface TopicStats {
  mastered: number;
  needsWork: number;
}

export type TopicStatsMap = Record<string, TopicStats>;

// Maps question.type → the instruction header shown above the question.
export const TYPE_HEADERS: Record<string, string> = {
  'draw-product':   'Draw the major product of the following reaction.',
  'draw-mechanism': 'Show the complete mechanism using curved arrows.',
  'draw-structure': 'Draw the structure of the following compound.',
  'draw-synthesis': 'Design a multi-step synthesis.',
  'name-compound':  'Provide the IUPAC name (with all stereodescriptors) for this compound.',
  'identify':       'Identify/classify the following.',
  'short-answer':   'Answer the following question.',
  'rank':           'Rank the following compounds as directed.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a weighted pool of questions so that topics you're struggling
 * with appear more often. A topic with 100% errors gets weight 4;
 * a topic with 0% errors gets weight 1.
 */
function weightByPerformance(pool: Question[], topicStats: TopicStatsMap): Question[] {
  const weighted: Question[] = [];
  pool.forEach(q => {
    const stats = topicStats[q.topic] ?? { mastered: 0, needsWork: 0 };
    const attempts = stats.mastered + stats.needsWork;
    const errorRate = attempts === 0 ? 0.5 : stats.needsWork / attempts;
    const weight = Math.max(1, Math.round(1 + errorRate * 3));
    for (let i = 0; i < weight; i++) weighted.push(q);
  });
  return weighted;
}

/**
 * Picks the next question from the bank.
 * - Filters by chapter / lesson / topic if a filter is provided.
 * - Avoids repeating the same question twice in a row.
 * - In 'smart' mode, upweights questions from weaker topics.
 */
export function generateQuestion(
  filter: Filter | null,
  topicStats: TopicStatsMap,
  lastId: string | null,
  mode: 'smart' | 'random' = 'smart'
): Question | null {
  let pool = questionBank.filter(q => {
    if (!filter) return true;
    if (filter.type === 'chapter') return q.chapter === filter.id;
    if (filter.type === 'lesson')  return q.lesson  === filter.id;
    if (filter.type === 'topic')   return q.topic   === filter.topic;
    return true;
  });

  if (pool.length === 0) return null;

  // Avoid repeating the same question back-to-back
  if (pool.length > 1) pool = pool.filter(q => q.id !== lastId);

  if (mode === 'smart') pool = weightByPerformance(pool, topicStats);

  return pool[Math.floor(Math.random() * pool.length)];
}
