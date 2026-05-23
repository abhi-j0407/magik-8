import { test, expect } from '@playwright/test';

/**
 * Path B — `VITE_WEBGL=true` + `VITE_WEBGL_E2E=true` build (playwright `chromium-webgl`).
 * Skips when headless Chrome cannot create a WebGL context (some CI images).
 * Uses bottom CTA for tap (Oracle `<Float>` idle bob makes the ball button unstable for Playwright).
 */
test.describe('Magik 8 oracle (WebGL path)', () => {
  test.beforeEach(async ({ page }) => {
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    });
    test.skip(!hasWebGL, 'WebGL unavailable in this browser — skip Path B');
  });

  test('tap reveal reaches answered with aria-live answer', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: /magik 8 ball — tap or shake to reveal/i }),
    ).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /tap to shake the magik 8/i }).click();
    await expect(
      page.getByRole('button', { name: /magik 8 ball — tap to ask again/i }),
    ).toBeVisible({ timeout: 25_000 });
    await expect(page.locator('[aria-live="polite"]').first()).toHaveText(/\S+/, {
      timeout: 15_000,
    });
  });

  test('theme switch when answered', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: /magik 8 ball — tap or shake to reveal/i }),
    ).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /tap to shake the magik 8/i }).click();
    await expect(
      page.getByRole('button', { name: /magik 8 ball — tap to ask again/i }),
    ).toBeVisible({ timeout: 25_000 });
    const career = page.getByRole('tab', { name: 'Career Coach' });
    await career.click();
    await expect(career).toHaveAttribute('aria-selected', 'true');
  });
});
