// EM-specific settings for scripts/test-cases.mjs (npm run cases:build -- --app em).
export default {
  // README feature groups, by ID prefix.
  groups: [
    ['Billing', ['INV', 'UO', 'UOI', 'EMF']],
    ['Collection & cash', ['PAY', 'CR', 'CONC', 'CO', 'CT', 'CBA']],
    ['Apartment ledgers', ['APT', 'CON', 'WAL', 'DEP']],
    ['Balances (OB / CB)', ['OB-SOA', 'OB-WAL', 'OB-DEP', 'OB-ACS']],
    ['Receivables & reporting', ['DASH', 'AR', 'RPT', 'SRCH']],
    ['Platform', ['AUTH', 'SET', 'RBAC', 'API']],
  ],

  // Smoke reading order (not a run order).
  stages: [
    { name: '1 · Access', prefixes: ['AUTH', 'API'], ids: { API: ['API-001', 'API-002'] } },
    { name: '2 · Setup & master data', prefixes: ['SET', 'CBA', 'APT', 'CON'], ids: { SET: ['SET-003'], CBA: ['CBA-001'], APT: ['APT-001'], CON: ['CON-001'] } },
    { name: '3 · Billing', prefixes: ['UO', 'UOI', 'EMF', 'INV'] },
    { name: '4 · Collection', prefixes: ['PAY', 'CR', 'APT', 'CON'], ids: { APT: ['APT-016'] } },
    { name: '5 · Wallet & deposit', prefixes: ['WAL', 'DEP'] },
    { name: '6 · Cash management', prefixes: ['CO', 'CT', 'CBA'] },
    { name: '7 · Balances & reporting', prefixes: ['DASH', 'AR', 'APT', 'RPT', 'OB-SOA', 'OB-WAL', 'OB-DEP', 'OB-ACS', 'API'] },
    { name: '8 · Access control', prefixes: ['RBAC'] },
  ],

  smokeQuestion: 'can EM still bill, collect and report money?',
  smokeSummary: 'can EM still bill, collect and report?',
  smokeData: 'each automated case creates its own data (apartment, contact, accounts)',
};
