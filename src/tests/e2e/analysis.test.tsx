import { test, expect } from '@playwright/test';
import { genMockCsvFile } from '../mocks/mocks';
import { uploadByClick } from '../util';

test.describe('Тест страницы CSV-аналитики', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('файл загружается и отправляется на бэкенд, пользователю показываются хайлайты', async ({ page }) => {
    const mockCsvFile = genMockCsvFile({ rowCount: 1_000_000 });
    await page.waitForSelector('[role="button"]');
    await expect(page.locator('button:has-text("Загрузить файл")')).toBeVisible();
    await expect(page.locator('text=или перетащите сюда .csv файл')).toBeVisible();

    await uploadByClick(page, mockCsvFile);  
    await page.locator('text=файл загружен!').waitFor({ timeout: 3000 });

    await page.getByTestId('send-button').click();
    await page.locator('text=идёт парсинг файла').waitFor({ timeout: 50 });
    await page.getByTestId('highlight-card-civ').waitFor({ timeout: 500 });
  });
});
