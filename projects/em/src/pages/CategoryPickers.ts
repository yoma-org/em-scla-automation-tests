// src/pages/CategoryPickers.ts — the Category pickers that settings cases check after creating a category.
// Each method opens the screen and returns its picker; nothing is submitted.
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { OptionPicker } from '@components/OptionPicker';

export class CategoryPickers {
  constructor(private readonly page: Page) {}

  private async at(path: string, ready: Locator, scope: Locator, label = 'Category'): Promise<OptionPicker> {
    await this.page.goto(path);
    await ready.waitFor();
    const picker = new OptionPicker(this.page, scope, label);
    await picker.combobox.waitFor();
    return picker;
  }

  private get main(): Locator {
    return this.page.getByRole('main');
  }

  private heading(name: string): Locator {
    return this.main.getByRole('heading', { name, level: 1 });
  }

  /** Accounts Receivable › Category filter: income and expense, parents as groups. */
  accountsReceivable(): Promise<OptionPicker> {
    return this.at(Routes.arWorklist, this.heading('Manage Account Receivable'), this.main.getByRole('group', { name: 'Manage AR controls' }));
  }

  /** Cash Received › Funding Received form › Category: Fund income categories only. */
  fundingReceived(): Promise<OptionPicker> {
    return this.at(Routes.fundingReceived, this.heading('Funding Received'), this.main.getByRole('form'));
  }

  /** Cash Outflow › New cash outflow form › Category: expense categories. */
  cashOutflow(): Promise<OptionPicker> {
    return this.at(Routes.cashOutflows, this.heading('Cash Outflow'), this.main.getByRole('form'));
  }

  /** Invoices / Debit Note › Create Invoice › Income Categories (non-Fund income, parents as groups). */
  invoice(): Promise<OptionPicker> {
    const form = this.main.getByRole('form', { name: 'New invoice' });
    return this.at(Routes.createInvoice, this.heading('Create Invoice'), form, 'Income Categories');
  }

  /** Apartment › Wallet › Add Credit Note › Category (dialog "New credit note"). */
  creditNote(apartmentId: string): Promise<OptionPicker> {
    const dialog = this.page.getByRole('dialog', { name: 'New credit note' });
    return this.at(Routes.creditNoteNew(apartmentId), dialog, dialog.getByRole('form'));
  }
}
