// src/constants/Routes.ts — New EM routes
export const Routes = {
  login: '/login',
  dashboard: '/dashboard',
  createInvoice: '/receivables/invoices/new',
  createApartment: '/estates/new',
  apartmentWallet: (id: number | string) => `/estates/${id}?tab=wallet`,
  walletTransfers: '/wallet/transfers'
} as const;
