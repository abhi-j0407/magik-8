import { test, expect } from '@playwright/test';

test('loads Magik 8 oracle app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Magik 8' })).toBeVisible();
  await expect(page.getByRole('tablist', { name: 'Answer theme' })).toBeVisible();
});

test('tap reveal shows oracle answer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /tap to shake/i }).click();
  await expect(page.getByRole('button', { name: /ask the oracle again/i })).toBeVisible({
    timeout: 5000,
  });
  const answer = page.locator('[aria-live="polite"]');
  await expect(answer).toBeVisible();
  await expect(answer).not.toHaveText('');
});

test('theme switch when answered', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /tap to shake/i }).click();
  await expect(page.getByRole('button', { name: /ask the oracle again/i })).toBeVisible({
    timeout: 5000,
  });
  const career = page.getByRole('tab', { name: 'Career Coach' });
  await career.click();
  await expect(career).toHaveAttribute('aria-selected', 'true');
});
