import { test, expect } from '@playwright/test';

test('quiz: responde varias preguntas y muestra explicación', async ({ page }) => {
  await page.goto('#/preparar/quiz');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/QUIZ/i);

  // elige el modo "TODOS"
  await page.getByRole('button', { name: /^TODOS/i }).click();

  for (let i = 0; i < 3; i++) {
    // elige la primera opción disponible
    const options = page.locator('.quiz-option');
    await expect(options.first()).toBeVisible();
    await options.first().click();

    // aparece la explicación
    await expect(page.locator('.quiz-explain')).toBeVisible();

    // botón siguiente visible y funcional
    const nextBtn = page.getByRole('button', { name: /siguiente/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
  }
});
