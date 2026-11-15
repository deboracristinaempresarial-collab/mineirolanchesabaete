// Change both variables only AFTER the new public origin has been published and verified.
// Future candidate: https://mineirolanchesabaete.vercel.app (not active).
export const CURRENT_PUBLIC_ORIGIN = "https://mineirolanchesabaetee.lovable.app";

export function resolveSeoOrigin(candidate?: string, verified?: string): string {
  if (!candidate || verified !== "true") return CURRENT_PUBLIC_ORIGIN;
  try {
    const url = new URL(candidate);
    if (
      url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash ||
      url.hostname === "localhost" || url.hostname.startsWith("id-preview--")
    ) return CURRENT_PUBLIC_ORIGIN;
    return url.origin;
  } catch {
    return CURRENT_PUBLIC_ORIGIN;
  }
}

export const SEO_ORIGIN = resolveSeoOrigin(
  import.meta.env.VITE_SEO_PRODUCTION_ORIGIN,
  import.meta.env.VITE_SEO_ORIGIN_VERIFIED,
);

export function seoUrl(path: string): string {
  return new URL(path, SEO_ORIGIN).href;
}