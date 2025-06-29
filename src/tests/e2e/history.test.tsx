import { test, expect } from '@playwright/test';

test.describe('Тест истории', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/history');
    });

    test('клик на кнопку генерации редиректит на страницу генерации', async ({ page }) => {
        const genButton = await page.locator('button:has-text("Сгенерировать больше")');
        await expect(genButton).toBeVisible();
        await genButton.click();
        // Перешли на страницу генерации
        await expect(page.url()).toBe('http://localhost:5173/generate');
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();
    });
});
