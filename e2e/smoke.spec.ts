import { test, expect } from '@playwright/test';

/**
 * Design V2 smoke — stable selectors use aria-labels where visible UI copy is lowercase
 * (e.g. CTA shows "ask again" but exposes "Ask the oracle again").
 */
test.describe('Magik 8 oracle (Design V2)', () => {
  test('loads chrome shell', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Magik 8' })).toBeVisible();
    await expect(page.getByRole('tablist', { name: 'Answer theme' })).toBeVisible();
    await expect(page.getByRole('button', { name: /mute sound effects/i })).toBeVisible();
    await expect(page.getByText('magik', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /tap to shake the magik 8/i }),
    ).toBeVisible();
  });

  test('tap reveal shows oracle answer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /tap to shake/i }).click();
    await expect(page.getByRole('button', { name: /ask the oracle again/i })).toBeVisible({
      timeout: 10_000,
    });
    const answer = page.locator('[aria-live="polite"]');
    await expect(answer).toBeVisible();
    await expect(answer).not.toHaveText('');
    await expect(page.getByRole('button', { name: /share answer/i })).toBeVisible();
  });

  test('theme switch when answered', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /tap to shake/i }).click();
    await expect(page.getByRole('button', { name: /ask the oracle again/i })).toBeVisible({
      timeout: 10_000,
    });
    const career = page.getByRole('tab', { name: 'Career Coach' });
    await career.click();
    await expect(career).toHaveAttribute('aria-selected', 'true');
  });
});
