// App-specific settings for scripts/test-cases.mjs (npm run cases:build -- --app scla).
export default {
  // README feature groups, by ID prefix: [groupName, [prefix, …]]. Unlisted prefixes go under "Other".
  groups: [
    ['Platform', ['AUTH']],
  ],

  // Smoke reading order (not a run order). A case goes to the first stage that lists its ID
  // (ids: { PREFIX: ['PREFIX-001'] }), otherwise to the first stage that lists its prefix.
  stages: [
    { name: '1 · Access', prefixes: ['AUTH'] },
  ],

  // The one question the smoke suite answers (smoke.md), and its short form (README).
  smokeQuestion: 'can users still sign in and complete the core business flow?',
  smokeSummary: 'can users still sign in and complete the core flow?',
  // How smoke cases stay independent.
  smokeData: 'each automated case creates its own data',
};
