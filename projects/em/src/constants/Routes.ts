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
  accountClassification: '/settings/classification'
} as const;
