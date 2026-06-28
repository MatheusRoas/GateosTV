import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FIFA/i);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have bottom navigation', async ({ page }) => {
    await page.goto('/');
    const bottomNav = page.locator('nav').last();
    await expect(bottomNav).toBeVisible();
  });
});
