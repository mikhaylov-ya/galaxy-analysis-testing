import { test, expect } from '@playwright/test';

test.describe('Интеграционный тест страницы анализа', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('переходит последовательно по страницам через навигацию', async ({ page }) => {
        await expect(page.locator('[data-testid="home-page"]')).toBeVisible();

        await page.getByText('CSV Генератор').click();
        await expect(page.url()).toBe('http://localhost:5173/generate');
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();
        await expect(page.locator('[data-testid="home-page"]')).not.toBeVisible();

        await page.getByText('История').click();
        await expect(page.url()).toBe('http://localhost:5173/history');
        await expect(page.locator('[data-testid="history-page"]')).toBeVisible();
        await expect(page.locator('[data-testid="generate-page"]')).not.toBeVisible();

        await page.getByText('CSV Аналитик').click();
        await expect(page.url()).toBe('http://localhost:5173/');
        await expect(page.locator('[data-testid="home-page"]')).toBeVisible();
        await expect(page.locator('[data-testid="history-page"]')).not.toBeVisible();
    });

    test('отображает активное состояние ссылки текущей страницы', async ({ page }) => {
        const homeLink = page.getByRole('link', { name: 'CSV Аналитик' });
        await expect(homeLink).toHaveClass(/active/);

        await page.getByText('CSV Генератор').click();
        const generateLink = page.getByRole('link', { name: 'CSV Генератор' });
        await expect(generateLink).toHaveClass(/active/);
        await expect(homeLink).not.toHaveClass(/active/);
    });

    test('осуществляет переход напрямую через URL', async ({ page }) => {
        await page.goto('http://localhost:5173/generate');
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();

        const generateLink = page.getByRole('link', { name: 'CSV Генератор' });
        await expect(generateLink).toHaveClass(/active/);

        await page.goto('http://localhost:5173/history');
        await expect(page.locator('[data-testid="history-page"]')).toBeVisible();

        const historyLink = page.getByRole('link', { name: 'История' });
        await expect(historyLink).toHaveClass(/active/);
    });
    test('навигация доступна в истории браузера', async ({ page }) => {
        await page.getByText('CSV Генератор').click();
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();

        await page.getByText('История').click();
        await expect(page.locator('[data-testid="history-page"]')).toBeVisible();

        await page.goBack();
        await expect(page.locator('[data-testid="generate-page"]')).toBeVisible();

        await page.goForward();
        await expect(page.locator('[data-testid="history-page"]')).toBeVisible();
    });
});
