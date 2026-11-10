// src/constants/Routes.ts — New EM routes
export const Routes = {
  login: '/login',
  dashboard: '/dashboard',
  /** In-app page from the account menu (the first-login page is /account/change-password). */
  changePassword: '/change-password',
  createInvoice: '/receivables/invoices/new',
  apartments: '/estates',
  createApartment: '/estates/new',
  apartment: (id: number | string) => `/estates/${id}`,
  apartmentInvoices: (id: number | string) => `/estates/${id}?tab=invoices`,
  apartmentEdit: (id: number | string) => `/estates/${id}?tab=edit`,
  apartmentWallet:(id: number | string) => `/estates/${id}?tab=wallet`,
  contact: (id: number | string) => `/estates/contacts/${id}`,
  walletTransfers: '/wallet/transfers',
  cashTransfers: '/accounts/transfers',
  cashTransfer: (id: number | string) => `/accounts/transfers/${id}`,
  cashTransferApprove: (id: number | string) => `/accounts/transfers/${id}/approve`,
  generalSettings: '/settings/general',
  buildings: '/settings/buildings',
  accountClassification: '/settings/classification',
  cashBankAccounts: '/settings/accounts',
  cashBankAccountNew: '/settings/accounts/new',
  cashBankAccountEdit: (id: number | string) => `/settings/accounts/${id}/edit`,
  paymentMethodNew: '/settings/classification/payment-methods/new',
  uoPricing: '/settings/service-items',
  categories: (kind: CategoryKind) => `/settings/${kind}-categories`,
  categoryEdit: (kind: CategoryKind, id: number | string) => `/settings/${kind}-categories/${id}/edit`,
  arWorklist: '/receivables/worklist',
  fundingReceived: '/accounts/funding-received',
  cashOutflows: '/accounts/outflows',
  contacts: '/estates/contacts',
  contactInvoices: (id: number | string) => `/estates/contacts/${id}?tab=invoices`,
  makePayment: (estateId: number | string) => `/receivables/payments/make-payment?estate_id=${estateId}`,
  walletRecharge: (estateId: number | string) => `/wallet/operations?estate_id=${estateId}&type=RECHARGE&new=1`,
  addDeposit: (estateId: number | string) => `/wallet/deposits?estate_id=${estateId}&type=ADD&new=1`,
  creditNoteNew: (estateId: number | string) => `/wallet/credit-notes?estate_id=${estateId}&new=1`,
  reports: {
    transactions: '/reports/cash-transfers',
    cashReceived: '/reports/cash-receipts',
    cashOutflow: '/reports/cash-outflow'
  }
} as const;

export type ReportName = keyof typeof Routes.reports;

export type CategoryKind = 'income' | 'expense';
