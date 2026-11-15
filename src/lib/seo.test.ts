import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CURRENT_PUBLIC_ORIGIN, resolveSeoOrigin } from "./seo";
import { isSitemapRouteIncluded, sitemapXML } from "./sitemap";
import type { AnyRoute } from "@tanstack/react-router";

function expect(actual: unknown) {
  return {
    toBe: (expected: unknown) => assert.equal(actual, expected),
    toContain: (expected: string) => assert.ok(String(actual).includes(expected)),
    not: { toContain: (expected: string) => assert.ok(!String(actual).includes(expected)) },
  };
}

describe("safe SEO origin", () => {
  test("preserves the currently published Lovable origin", () => {
    expect(resolveSeoOrigin()).toBe("https://mineirolanchesabaetee.lovable.app");
  });
  test("does not activate the future Vercel origin before verification", () => {
    expect(resolveSeoOrigin("https://mineirolanchesabaete.vercel.app")).toBe(CURRENT_PUBLIC_ORIGIN);
  });
  test("allows the future origin only with explicit confirmation", () => {
    expect(resolveSeoOrigin("https://mineirolanchesabaete.vercel.app", "true"))
      .toBe("https://mineirolanchesabaete.vercel.app");
  });
  test("rejects malformed or preview origins", () => {
    for (const value of ["invalid", "http://example.com", "https://example.com/path", "https://id-preview--example.lovable.app"]) {
      expect(resolveSeoOrigin(value, "true")).toBe(CURRENT_PUBLIC_ORIGIN);
    }
  });
});

test("private subtree cannot be included by a child", () => {
  const parent = { options: { staticData: { sitemap: "exclude-subtree" } } };
  const child = { options: { staticData: { sitemap: true } }, parentRoute: parent };
  expect(isSitemapRouteIncluded(child as unknown as AnyRoute)).toBe(false);
});

test("homepage XML uses the current origin without invented lastmod", () => {
  const xml = sitemapXML(CURRENT_PUBLIC_ORIGIN, [{ path: "/" }]);
  expect(xml).toContain("<loc>https://mineirolanchesabaetee.lovable.app/</loc>");
  expect(xml).not.toContain("lastmod");
});

test("robots sitemap directive agrees with the default production origin", () => {
  const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
  expect(robots).toContain(`Sitemap: ${CURRENT_PUBLIC_ORIGIN}/sitemap.xml`);
  expect(robots).not.toContain("Disallow: /");
});

test("auth response prohibits indexing even without browser rendering", async () => {
  const response = await fetch("http://localhost:8080/auth");
  expect(response.status).toBe(200);
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex, follow");
});

test("account response prohibits indexing even without a session", async () => {
  const response = await fetch("http://localhost:8080/conta");
  expect(response.status).toBe(200);
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex, follow");
});