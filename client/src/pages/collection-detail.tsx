import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

type CollectionMeta = {
  title: string;
  hero: string;
  intro: string;
  context: string;
  tag: string; // products should include this in tags
};

const COLLECTIONS: Record<string, CollectionMeta> = {
  chola: {
    title: "The Chola Edit",
    hero: "https://images.unsplash.com/photo-1593152228873-4600a1b46032?auto=format&fit=crop&w=1600&q=80",
    intro: "Bronze divinity, temple silk, and sanctum light — an ode to Tamil classicism.",
    context: "The Cholas (9th–13th c.) patronised bronze casting and temple arts. This capsule revisits those luminous forms with modern restraint.",
    tag: "chola",
  },
  pandya: {
    title: "The Pandya Edit",
    hero: "https://images.unsplash.com/photo-1549643276-fdf2caf68f37?auto=format&fit=crop&w=1600&q=80",
    intro: "Temple jewellery and dye-rich silks finished with heirloom borders.",
    context: "From Madurai’s sanctums to coastal looms, the Pandyan aesthetic is devotional yet opulent.",
    tag: "pandya",
  },
  rajput: {
    title: "The Rajput Edit",
    hero: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
    intro: "Miniature florals, meenakari hues, and carved woods in desert jewel tones.",
    context: "Rajput ateliers refined courtly motifs across painting, jewellery, and architecture.",
    tag: "rajput",
  },
  mughal: {
    title: "The Mughal Edit",
    hero: "https://images.unsplash.com/photo-1601202902206-5f6dca128187?auto=format&fit=crop&w=1600&q=80",
    intro: "Pietra dura blooms and garden geometries, rendered in marble hues.",
    context: "From Akbar to Shah Jahan, the imperial ateliers mastered inlay, carpets, and fine textiles.",
    tag: "mughal",
  },
  wodeyar: {
    title: "The Wodeyar Edit",
    hero: "https://images.unsplash.com/photo-1610882648335-cedf3f1f9b7b?auto=format&fit=crop&w=1600&q=80",
    intro: "Mysore rosewood, sandalwood friezes, and soft gold zari.",
    context: "A southern court known for refined woodwork and silks with gentle luster.",
    tag: "wodeyar",
  },
};

export default function CollectionDetail() {
  const [, params] = useRoute("/collections/:slug");
  const slug = (params?.slug || "").toLowerCase();
  const meta = COLLECTIONS[slug];

  const { data: productsResponse } = useQuery({ queryKey: ["/api/products"] });
  const products: Product[] = productsResponse?.products || [];
  const curated = products.filter((p) => (p.tags || []).some((t: string) => String(t).toLowerCase().includes(meta?.tag || slug)));

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif">Collection Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="parallax" style={{ backgroundImage: `url(${meta.hero})`, height: "46vh" }} />
        <div className="mughal-arch-divider" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl lg:text-5xl font-serif gold-foil embossed-title mb-2">{meta.title}</h1>
          <div className="ornate-divider w-24 mb-4" />
          <p className="text-muted-foreground max-w-2xl">{meta.intro}</p>
        </div>
      </section>

      {/* Context + CTA */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <p className="text-foreground/80 leading-relaxed">{meta.context}</p>
          </div>
          <div className="embossed p-6 rounded-xl border border-border">
            <h3 className="font-serif text-xl mb-2">By Invitation</h3>
            <p className="text-sm text-muted-foreground mb-4">Private previews and limited drops are available for members and patrons.</p>
            <Button className="w-full bg-primary text-primary-foreground">Request Private Viewing</Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-background jaali-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-serif gold-foil">Featured Pieces</h2>
              <div className="ornate-divider w-20" />
            </div>
          </div>
          {curated.length === 0 ? (
            <p className="text-muted-foreground">No pieces available yet. Check back soon.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
            >
              {curated.map((product) => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Editorial block for global education */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden border border-border opulent-photo">
            <img src={meta.hero} alt={meta.title} className="w-full h-80 object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-2xl mb-2">For Global Collectors</h3>
            <p className="text-muted-foreground leading-relaxed">
              New to Indian royal history? Explore the aesthetics, materials, and symbolism behind the {meta.title.replace('The ', '').replace(' Edit','')}.
              Each capsule includes provenance notes and care guidance to preserve these works for generations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

