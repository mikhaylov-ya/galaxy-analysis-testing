import { test, expect } from '@playwright/test';

import { invalidHistoryEntry, validHistoryEntry } from '../mocks/mocks';

test.describe('Тест истории', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/history');
        await page.evaluate(
            ({ validHistoryEntry, invalidHistoryEntry }) => {
                const validEntry = JSON.parse(validHistoryEntry)[0];
                const invalidEntry = JSON.parse(invalidHistoryEntry)[0];
                localStorage.setItem(
                    'tableHistory',
                    JSON.stringify([
                        { ...validEntry, id: 1, timestamp: Date.now() },
                        { ...invalidEntry, id: 2, timestamp: Date.now() + 10 },
                    ])
                );
            },
            {
                validHistoryEntry,
                invalidHistoryEntry,
            }
        );
    });

    test('клик на кнопку генерации редиректит на страницу генерации', async ({ page }) => {
        const genButton = await page.locator('button:has-text("Сгенерировать больше")');
        await expect(genButton).toBeVisible();
        await genButton.click();
        // Перешли на страницу генерации
        await expect(page.url()).toBe('http://localhost:5173/generate');
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();
    });

    test('отрисовывает сохраненный в localStorage список, открывает модальное окно с хайлайтами', async ({ page }) => {
        await page.reload({ timeout: 1000 });
        const fstHistoryItem = page.getByTestId('history-item-1');
        const sndHistoryItem = page.getByTestId('history-item-2');
        await expect(fstHistoryItem).toBeVisible();
        await expect(sndHistoryItem).toBeVisible();
        await expect(fstHistoryItem).toContainText('report.csv');
        await expect(sndHistoryItem).toContainText('invalid.csv');
        const modalButton1 = fstHistoryItem.getByTestId('modal-button-1');
        await modalButton1.click({ force: true, timeout: 1000 });

        await page.waitForSelector('[data-testid="modal-highlights"]', { timeout: 2000 });
    });

    test('очищает историю и localStorage по клику', async ({ page }) => {
        await page.reload({ timeout: 1000 });
        const clearButton = await page.locator('button:has-text("Очистить всё")');
        await expect(clearButton).toBeVisible();
        await clearButton.click();
        const fstHistoryItem = page.getByTestId('history-item-1');
        const sndHistoryItem = page.getByTestId('history-item-2');
        await expect(fstHistoryItem).not.toBeVisible();
        await expect(sndHistoryItem).not.toBeVisible();
        await page.waitForTimeout(300);
        const storedHistory = await page.evaluate(() => {
            return localStorage.getItem('tableHistory');
        });
        await expect(storedHistory).toBe(null);
    });
});
