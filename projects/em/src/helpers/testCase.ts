// src/helpers/testCase.ts — tags and annotations for a catalog case (docs/test-cases/), as
// .claude/skills/playwright-skill/references/test-case-conventions.md describes them.

export interface CatalogCase {
  /** Case ID, e.g. 'SET-007'. Must also start the test title. */
  id: string;
  /** Source ID from the case table, e.g. 'TC_Setting_07'. */
  source?: string;
  priority: 'P1' | 'P2' | 'P3';
  smoke?: boolean;
  critical?: boolean;
  review?: string;
  /**
   * Jira issues the case guards, e.g. ['EM-39'] → tags @sanity and @EM-39 and a jira annotation.
   * @sanity puts the case in sanity runs too ("is the ticket still fixed?").
   */
  jira?: string[];
}

export function testCase({ id, source, priority, smoke, critical, review, jira = [] }: CatalogCase) {
  return {
    tag: [
      ...(smoke ? ['@smoke'] : []), ...(jira.length ? ['@sanity'] : []), `@${priority}`, ...(critical ? ['@critical'] : []),
      ...(review ? ['@review'] : []), ...jira.map(j => `@${j}`)
    ],
    annotation: [
      { type: 'tc', description: id },
      ...(source ? [{ type: 'source', description: source }] : []),
      ...(review ? [{ type: 'review', description: review }] : []),
      ...jira.map(j => ({ type: 'jira', description: j }))
    ]
  };
}
