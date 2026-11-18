// src/pages/deposit/DepositInvoicePages.ts — deposit invoices (DI).
//   List:    /apartments/:id/deposit-invoice  [Add Deposit Invoice]; table # · date · Due Date · Amount ·
//            Created By · Approved By · Manage (eye → /apartments/deposit-invoice/:diId). Drafts are not listed.
//   Create:  /apartments/add-deposit-invoice/:id  Apartment* · Currency · Date* · Payment Terms ·
//            "Item Descritpion*" (sic) · Unit (spinbutton) · Gross Price · [Create]
//            → toast "Deposit Invoice has been created successfully" → the draft's detail page.
//   Drafts:  /apartments/draft (top-bar "DI")  Date · Apartment · Total · Created By · Manage (eye).
//   Detail:  /apartments/deposit-invoice/:diId  draft: [Approve] [Remove], "DRAFT"; approve (no confirm) →
//            "Deposit Invoice has been approved successfully", "#DI-202611-00002 CoRef : DI0000042 APPROVED",
//            a "PDF" dropdown (View PDF / Download PDF).
import { expect, type Locator, type Page } from '@playwright/test';
import { showHundredRows } from '@pages/wallet/common';

export class DepositInvoiceCreatePage {
  readonly itemDescription: Locator;
  readonly unit: Locator;
  readonly grossPrice: Locator;
  /** "Old CoRef No.*": only shown (and required) while the CoRef setting asks for it. */
  readonly oldCoRef: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.oldCoRef = page.getByPlaceholder('Old CoRef No');
    this.itemDescription = page.getByRole('textbox', { name: 'Item Descritpion*' });
    this.unit = page.getByRole('spinbutton');
    this.grossPrice = page.getByRole('textbox', { name: 'Gross Price' });
    this.createButton = page.getByRole('button', { name: 'Create', exact: true });
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/add-deposit-invoice/${apartmentId}`);
    await this.itemDescription.waitFor();
    await this.page.waitForLoadState('networkidle');
  }
}

export class DepositInvoiceDraftsPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/apartments/draft');
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page.getByText('Draft: Deposit Invoices').first()).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await showHundredRows(this.page);
  }

  row(apartment: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: apartment, exact: true }) });
  }

  manageLink(apartment: string): Locator {
    return this.row(apartment).locator('a[href^="/apartments/deposit-invoice/"]');
  }
}

export class DepositInvoiceDetailPage {
  readonly approveButton: Locator;
  readonly pdf: Locator;

  constructor(private readonly page: Page) {
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
    this.pdf = page.getByRole('combobox', { name: 'PDF' });
  }

  /** "DRAFT" before approval, "#DI-… CoRef : … APPROVED" after. */
  status(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }
}

export class DepositInvoiceListPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/deposit-invoice`);
    await this.page.getByRole('link', { name: 'Add Deposit Invoice' }).waitFor();
    await this.page.waitForLoadState('networkidle');
  }

  row(text: string | RegExp): Locator {
    return this.table.getByRole('row').filter({ hasText: text });
  }
}
