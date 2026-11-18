// src/pages/billing/ImportPage.ts — Import UO Entry (/utility-operations/import) and Import EM Entry
// (/estate-managements/import). Zone · Building · [Download CSV Template] · file drop zone ("Choose").
// The template is a CSV of every apartment of the chosen building with empty values:
//   UO: "Apartment","Reading Date (DD/MM/YYYY)","Electricity (YESC)","Electricity (Generator)","Treated Water","Raw Water"
//       (current readings only; the previous reading comes from the last approved one)
//   EM: "Apartment","Monthly Fee","No. of Months","From  (DD/MM/YYYY)"   (two spaces, sic)
// Choosing a file uploads it at once (no Upload button) and goes back to the list with an inline message
// (not a toast) "1 UO Entry imported." / "1 EM Entry imported.". Imported entries are invoiced straight away.
import { expect, type Locator, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { chooseOption } from '@components/PrimeSelect';

export class ImportPage {
  readonly downloadButton: Locator;
  readonly zone: Locator;
  readonly building: Locator;
  readonly fileInput: Locator;
  /** The inline message on the list page after an upload ("1 UO Entry imported." or the errors). */
  readonly result: Locator;

  constructor(private readonly page: Page, readonly kind: 'uo' | 'em') {
    this.downloadButton = page.getByRole('button', { name: 'Download CSV Template' });
    this.zone = this.downloadButton.locator('xpath=following::*[@role="combobox"][1]');
    this.building = this.downloadButton.locator('xpath=following::*[@role="combobox"][2]');
    this.fileInput = page.locator('input[type=file]');
    this.result = page.getByRole('alert').filter({ has: page.getByRole('listitem') });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.kind === 'uo' ? '/utility-operations/import' : '/estate-managements/import');
    await this.downloadButton.waitFor();
    await expect(this.zone).not.toHaveText('');
  }

  /** Downloads the building's template to `saveAs` and returns its text. */
  async downloadTemplate(zone: string, building: string, saveAs: string): Promise<string> {
    await chooseOption(this.page, this.zone, zone);
    await expect(this.building).toHaveText(new RegExp(`^${building}$`, 'i'));
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.downloadButton.click()]);
    await download.saveAs(saveAs);
    return readFile(saveAs, 'utf8');
  }

  async upload(file: string): Promise<void> {
    await this.fileInput.setInputFiles(file);
  }
}

/** Parses a quoted CSV (no embedded commas or quotes in Old EM templates). */
export function parseCsv(text: string): string[][] {
  return text.trim().split(/\r?\n/).map(line => line.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n') + '\n';
}
