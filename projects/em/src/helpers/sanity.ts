// src/helpers/sanity.ts — tag and annotations for sanity tests (tests/sanity/).
// Sanity cases live in docs/sanity-test/ (not in the test-case catalog):
//   tickets/open/<file>.md  → SAN-EM<ticket>-<nnn>, ticket not fixed yet  → tag @open
//   tickets/fixed/<file>.md → SAN-EM<ticket>-<nnn>, ticket fixed on UAT  → tag @fixed
//   cases/<file>.md   → SAN-<MOD>-<nnn>       (New EM vs Old EM parity pass)
// Expected results are Old EM behaviour, so a test stays red until the New EM bug is fixed.

export interface SanityCase {
  /** Case ID, e.g. 'SAN-EM92-001'. Must also start the test title. */
  id: string;
  /** Priority from the doc's case table. */
  priority: 'P1' | 'P2' | 'P3';
  /** ★ in the doc (P1 case that touches money). */
  critical?: boolean;
  /**
   * Jira task(s) the case checks. Ticket cases (SAN-EM92-…) get theirs from the ID, so pass this
   * only for parity cases (SAN-INV-013 …) that a ticket covers, e.g. ['EM-93'].
   */
  jira?: string[];
  /** Doc that holds the case, relative to projects/em/. */
  doc: string;
}

/** 'SAN-EM92-001' → 'EM-92'; undefined for parity IDs such as 'SAN-INV-013'. */
export function jiraFromId(id: string): string | undefined {
  const m = /^SAN-EM(\d+)-\d{3}$/.exec(id);
  return m ? `EM-${m[1]}` : undefined;
}

/** 'docs/sanity-test/tickets/open/g3-….md' → '@open'; '…/tickets/fixed/…' → '@fixed'; otherwise none. */
export function ticketStateTag(doc: string): '@open' | '@fixed' | undefined {
  const m = /\/tickets\/(open|fixed)\//.exec(doc);
  return m ? (`@${m[1]}` as '@open' | '@fixed') : undefined;
}

export function sanity({ id, priority, critical, jira = [], doc }: SanityCase) {
  const fromId = jiraFromId(id);
  const tasks = [...new Set([...(fromId ? [fromId] : []), ...jira])];
  const state = ticketStateTag(doc);
  return {
    // @EM-92 lets CI pick every test of one Jira task: --grep "@EM-92( |$)"
    // @open / @fixed come from the doc's folder: moving the doc moves the test to the other group.
    tag: ['@sanity', `@${priority}`, ...(critical ? ['@critical'] : []), ...(state ? [state] : []), ...tasks.map(t => `@${t}`)],
    annotation: [
      { type: 'tc', description: id },
      ...tasks.map(t => ({ type: 'jira', description: t })),
      { type: 'doc', description: doc }
    ]
  };
}
