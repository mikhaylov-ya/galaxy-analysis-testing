import { test, expect } from '@playwright/test';

import { invalidHistoryEntry, validHistoryEntry } from '../mocks/mocks';
import { uploadByClick } from '../util';

import { HIGHLIGHT_TITLES } from '@/utils/consts';

test.describe('Тест страницы CSV-аналитики', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('валидный файла загружается, отправляется на бэкенд, показываются хайлайты, которые затем сохраняются в localStorage', async ({
        page,
    }) => {
        const getByText = (text: string) => page.locator(`text=${text}`);
        await page.waitForSelector('[role="button"]');
        await expect(page.locator('button:has-text("Загрузить файл")')).toBeVisible();
        await expect(page.locator('text=или перетащите сюда .csv файл')).toBeVisible();
        // Загружаем файл в аплоаудер
        await uploadByClick(page);
        await page.locator('text=файл загружен!').waitFor({ timeout: 1000 });

        // Отправляем в бэкенд
        await page.getByTestId('send-button').click();
        await page.locator('text=идёт парсинг файла').waitFor({ timeout: 50 });
        // Проверяем наличие хайлайтов: секции в целом и каждой карточки в отдельности
        await page.getByTestId('highlight-section').waitFor({ timeout: 1500 });
        const highlightTitles = Object.values(HIGHLIGHT_TITLES).filter((s) => s !== 'Обработано строк');
        for (const title of highlightTitles) {
            await expect(getByText(title)).toBeVisible();
        }

        // ждем пока бэкенд закончит свою работу
        // иначе бэкенд упадет при разрыве соединения посреди процесса анализа
        await page.waitForTimeout(10000);

        // Проверяем наличие данных об анализе в localStorage
        const storedValue = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tableHistory') ?? '');
        });
        // Сравниваем по всем полям кроме timestamp и id - они динамические
        // Для них достаточно знать что они есть
        expect(storedValue).toMatchObject(JSON.parse(validHistoryEntry));
        expect(storedValue[0].id).toBeDefined();
        expect(storedValue[0].timestamp).toBeDefined();
    });

    test('невалидный файл: хайлайты не отображаются, в localStorage сохраняется', async ({ page }) => {
        await page.waitForSelector('[role="button"]');

        await uploadByClick(page, { valid: false });
        await page.locator('text=файл загружен!').waitFor({ timeout: 1000 });

        await page.getByTestId('send-button').click();
        await page.locator('text=идёт парсинг файла').waitFor({ timeout: 50 });
        await page.waitForTimeout(1000);
        await expect(page.getByTestId('highlight-section')).toBeVisible();

        const storedValue = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tableHistory') ?? '');
        });

        // Тест будет падать в Chrome, но успешно проходить в Firefox из-за разной обработки null-значений
        expect(storedValue).toMatchObject(JSON.parse(invalidHistoryEntry));
    });
});
