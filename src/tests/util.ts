import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { type Page } from 'playwright';

export const uploadByClick = async (page: Page, options: { valid: boolean } = { valid: true }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.getByTestId('upload-button').click();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, `./files/${options.valid ? 'report' : 'invalid'}.csv`));
};
