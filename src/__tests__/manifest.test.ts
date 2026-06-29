import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('PWA manifest for GitHub Pages', () => {
  const manifestPath = resolve(process.cwd(), 'public/manifest.webmanifest');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    start_url: string;
    scope: string;
    icons: Array<{ src: string }>;
    screenshots?: Array<{ src: string }>;
    shortcuts?: Array<{ url: string }>;
  };

  it('uses relative scope and start URL', () => {
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
  });

  it('uses relative asset URLs for Pages subpath', () => {
    const urls = [
      ...manifest.icons.map((icon) => icon.src),
      ...(manifest.screenshots?.map((screenshot) => screenshot.src) ?? []),
      ...(manifest.shortcuts?.map((shortcut) => shortcut.url) ?? [])
    ];

    urls.forEach((url) => {
      expect(url.startsWith('./')).toBe(true);
    });
  });
});
