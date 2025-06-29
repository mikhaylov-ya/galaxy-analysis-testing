import { type Page } from "playwright";

export const uploadByClick = async (page: Page, file: File) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  
  await page.getByTestId('upload-button').click();
  
  const fileChooser = await fileChooserPromise;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fileChooser.setFiles([{
    name: file.name,
    mimeType: file.type,
    buffer,
  }]);
}
