import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FooterFrame from "@/components/FooterFrame";
import ProductPage from "@/components/ProductPage";
import SiteHeader from "@/components/SiteHeader";
import TrustStrips from "@/components/TrustStrips";
import { PRODUCTS, productBySlug, productLine } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

// One page per product, so each has its own address for search and ads (Petar, artifact 6: proizvod).
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} · ${p.type} · Evielle Skin Care`,
    description: `${p.name} ${p.variant}: ${productLine(p).toLowerCase()}. Evielle Skin Care.`,
    alternates: { canonical: `/${p.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  return (
    <>
      <SiteHeader always />
      <main>
        <ProductPage id={p.id} />
        <TrustStrips />
      </main>
      <FooterFrame plain />
    </>
  );
}
