import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Truck, RotateCcw, Headphones, Wallet, BadgeCheck, Scissors, Gem, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { Product } from "@shared/schema";
import { Link as WLink } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ["/api/products"],
  });

  // Surface Shopify configuration status with a subtle banner (dev-only)
  const { data: shopifyStatus } = useQuery<{ shopifyEnabled: boolean } | null>({
    queryKey: ["/api/shopify/status"],
  });
  const isDev = import.meta.env.MODE === "development";

  const products = productsResponse?.products || [];
  // Curate out casual, non-royal items
  const curated = products.filter((p: Product) => !/t-?shirt|tee|headphone|earbud|dress/i.test(p.name) && !/headphone|electronics/i.test(p.category || ""));
  const featuredProducts = curated.slice(0, 4);
  const isUsingDemoProducts = productsResponse?.source === 'demo';

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroTextRef.current) {
        gsap.timeline()
          .from(heroTextRef.current.querySelector('.inline-flex'), {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
          })
          .from(heroTextRef.current.querySelector('h2'), {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out"
          }, "-=0.4")
          .from(heroTextRef.current.querySelector('.ornate-divider'), {
            opacity: 0,
            scaleX: 0,
            duration: 0.8,
            ease: "power3.inOut"
          }, "-=0.6")
          .from(heroTextRef.current.querySelector('p'), {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
          }, "-=0.4")
          .from(heroTextRef.current.querySelectorAll('.flex button'), {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out"
          }, "-=0.4");
      }

      // Parallax effect for hero background
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.parallax'), {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Categories animation
      if (categoriesRef.current) {
        gsap.from(categoriesRef.current.querySelectorAll('.group'), {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            once: true
          }
        });
      }

      // Dynasty Capsules animation
      gsap.utils.toArray('.dynasty-capsule').forEach((capsule: any, index) => {
        gsap.from(capsule, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: capsule,
            start: "top 85%",
            once: true
          }
        });
      });

      // Journal cards animation
      if (journalRef.current) {
        gsap.from(journalRef.current.querySelectorAll('article'), {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: journalRef.current,
            start: "top 80%",
            once: true
          }
        });
      }

      // Featured products animation
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelector('h3'), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
            once: true
          }
        });

        gsap.from(featuredRef.current.querySelector('.ornate-divider'), {
          opacity: 0,
          scaleX: 0,
          duration: 0.8,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
            once: true
          },
          delay: 0.3
        });
        
        // Animate product cards
        gsap.from(featuredRef.current.querySelectorAll('.product-card-wrapper'), {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 70%",
            once: true
          },
          delay: 0.5
        });
      }

      // Trust signals animation
      if (trustRef.current) {
        gsap.from(trustRef.current.querySelectorAll('.text-center'), {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trustRef.current,
            start: "top 85%",
            once: true
          }
        });
      }

      // Testimonials animation
      gsap.utils.toArray('.testimonial-card').forEach((card: any, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true
          }
        });
      });

      // Editorial banners hover animation
      gsap.utils.toArray('.editorial-banner').forEach((banner: any) => {
        const image = banner.querySelector('img');
        const text = banner.querySelector('.absolute');
        
        banner.addEventListener('mouseenter', () => {
          gsap.to(image, { scale: 1.08, duration: 0.6, ease: "power2.out" });
          gsap.to(text, { y: -5, duration: 0.4, ease: "power2.out" });
        });
        
        banner.addEventListener('mouseleave', () => {
          gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
          gsap.to(text, { y: 0, duration: 0.4, ease: "power2.out" });
        });
      });

      // Floating animation for ornamental elements
      gsap.to('.float-element', {
        y: -10,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.3,
          from: "random"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Handle error state
  if (error) {
    console.error('Failed to load products:', error);
    // Continue to render the page with categories even if products fail to load
  }

  const categories = [
    {
      name: "Sarees",
      description: "Silks, Banarasi, Kanjeevaram",
      image: "/category-sarees.png",
      href: "/products?category=Sarees"
    },
    {
      name: "Kurtas & Kurtis",
      description: "Everyday to Festive",
      image: "/category-kurtas.png",
      href: "/products?category=Kurtas"
    },
    {
      name: "Jewellery",
      description: "Oxidised & Temple",
      image: "/category-jewellery.png",
      href: "/products?category=Jewellery"
    },
    {
      name: "Home & Handicrafts",
      description: "Artisanal Decor",
      image: "/category-handicrafts.png",
      href: "/products?category=Handicrafts"
    }
  ];

  // Editorial carousel slides (subtle, luxe)
  const slides = [
    {
      label: "Royal Collection",
      image: "/hero-carousel-1.png",
      alt: "Luxury POD products with Indian palace motifs",
    },
    {
      label: "Fashion Edit",
      image: "/hero-carousel-2.png",
      alt: "Modern apparel with traditional Indian embroidery",
    },
    {
      label: "Temple Heritage",
      image: "/hero-carousel-3.png",
      alt: "Premium accessories with temple jewelry patterns",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  
  // Animate slide transitions
  useEffect(() => {
    if (slideTimelineRef.current) {
      slideTimelineRef.current.kill();
    }
    
    slideTimelineRef.current = gsap.timeline()
      .to('.parallax', {
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.inOut"
      })
      .to('.parallax', {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
  }, [currentSlide]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full width parallax */}
      <section ref={heroRef} className="relative overflow-hidden bg-background min-h-[75vh]">
        {/* Background with fallback gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F1ECE1] to-[#E8DFCE] parallax"
          style={{ 
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,162,83,0.12),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40 min-h-[75vh] flex items-center">
          <div ref={heroTextRef} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-xs tracking-wider uppercase mb-6 bg-black/40 backdrop-blur-sm border border-white/20">
              The Maharaja Edit
            </div>
            <h2 className="text-4xl lg:text-6xl font-semibold leading-tight text-white drop-shadow-lg mb-3 font-serif" data-testid="text-hero-title">
              <span className="gold-foil-enhanced">Courts of India</span>, Reimagined
            </h2>
            <div className="ornate-divider w-24 mb-6" />
            <p className="text-lg text-white/90 mb-10 leading-relaxed drop-cap" data-testid="text-hero-description">
              Silk folds under candlelight, brass carved by hand, and temple motifs cast in gold—crafted by Indian ateliers with modern precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="gold-metallic text-white px-8 py-3 royal-shadow" data-testid="button-shop-collection">
                  Shop New Arrivals
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm px-8 py-3 hover:bg-white hover:text-black transition-all duration-300" data-testid="button-explore-categories">
                  Explore The House
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`h-2.5 w-2.5 rounded-full border lux-transition ${i === currentSlide ? 'bg-accent border-accent' : 'bg-white/60 border-border'}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />)
          )}
        </div>
        {/* Slide label - hidden for cleaner look */}
        {/* <div className="absolute top-6 left-6">
          <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {slides[currentSlide].label}
          </span>
        </div> */}
      </section>
      <div className="mughal-arch-divider" />

      {/* House Codes strip */}
      <section className="py-6 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs tracking-wider uppercase text-muted-foreground">
            <span>Artisanal Silk</span>
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            <span>Handloom Heritage</span>
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            <span>Modern Tailoring</span>
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            <span>Responsible Materials</span>
          </div>
        </div>
      </section>

      <div className="arch-divider"></div>

      {/* Dynasty Capsules */}
      <section className="py-16 gradient-overlay mughal-pattern gold-border-top gold-border-bottom" style={{ backgroundColor: '#431B25' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-semibold font-serif gold-foil-enhanced">Dynasty Capsules</h3>
            <div className="ornate-divider mx-auto w-20 mt-2" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { slug: 'chola', title: 'The Chola Edit', img: '/rajput-collection.png' },
              { slug: 'rajput', title: 'The Rajput Edit', img: '/wall-art-collection.png' },
              { slug: 'mughal', title: 'The Mughal Edit', img: '/home-decor-collection.png' },
            ].map((c) => (
              <WLink key={c.slug} href={`/collections/${c.slug}`}>
                <div className="dynasty-capsule rounded-2xl overflow-hidden filigree-border gold-glow cursor-pointer royal-shadow">
                  <div className="h-48 w-full opulent-photo">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-serif text-xl">{c.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Limited releases — by invitation</p>
                  </div>
                </div>
              </WLink>
            ))}
          </div>
        </div>
      </section>

      <div className="arch-divider-small"></div>

      {/* Editorial Banners */}
      <section className="py-10 bg-background bg-sapphire-soft gradient-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/products?category=Sarees">
              <div className="editorial-banner relative group rounded-2xl overflow-hidden border border-border cursor-pointer gold-glow">
                <img src="/category-sarees.png" alt="Sarees" className="h-80 w-full object-cover group-hover:scale-[1.02] transition-transform lux-transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="uppercase tracking-widest text-xs mb-2 opacity-90">The Saree Edit</p>
                  <h3 className="font-serif text-3xl leading-tight">Kanjeevaram Silks</h3>
                </div>
              </div>
            </Link>
            <Link href="/products?category=Jewellery">
              <div className="editorial-banner relative group rounded-2xl overflow-hidden border border-border cursor-pointer gold-glow">
                <img src="/category-jewellery.png" alt="Jewellery" className="h-80 w-full object-cover group-hover:scale-[1.02] transition-transform lux-transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="uppercase tracking-widest text-xs mb-2 opacity-90">The Jewellery Edit</p>
                  <h3 className="font-serif text-3xl leading-tight">Temple Ornaments</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-background bg-emerald-soft">
        <div ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2 font-serif gold-text-light" data-testid="text-categories-title">
              The House Collections
            </h3>
            <div className="ornate-divider mx-auto w-24 mb-4" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Refined edits spanning sarees, tailoring, jewellery, and crafted living
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={category.href}>
                <div className="group cursor-pointer" data-testid={`category-card-${index}`}>
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform lux-transition"
                      data-testid={`img-category-${index}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-medium text-lg tracking-wide" data-testid={`text-category-name-${index}`}>
                        {category.name}
                      </h4>
                      <p className="text-sm opacity-90" data-testid={`text-category-description-${index}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Mosaic */}
      <section className="py-10 bg-background bg-ruby-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <img className="h-96 w-full object-cover rounded-2xl border border-border gold-glow" src="/home-decor-collection.png" alt="Home decor POD collection" />
            <div className="grid gap-6">
              <img className="h-44 w-full object-cover rounded-2xl border border-border gold-glow" src="/phone-case-peacock.png" alt="Phone case with peacock design" />
              <img className="h-44 w-full object-cover rounded-2xl border border-border gold-glow" src="/mug-mandala-lotus.png" alt="Coffee mug with mandala design" />
            </div>
            <img className="h-96 w-full object-cover rounded-2xl border border-border gold-glow" src="/pillow-palace-garden.png" alt="Decorative pillow with palace garden pattern" />
          </div>
        </div>
      </section>

      <div className="arch-divider"></div>

      {/* Royal Provenance — Cultural Storytelling */}
      <section className="py-16 velvet-maroon text-white mughal-pattern gold-border-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-semibold mb-2 font-serif gold-foil-enhanced">Royal Provenance</h3>
            <div className="ornate-divider mx-auto w-24 mb-4" />
            <p className="text-white/80 max-w-2xl mx-auto">Each capsule honors a lineage—palaces, looms, and ateliers that define Indian grandeur.</p>
          </div>
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          >
            <motion.article className="rounded-2xl overflow-hidden bg-white filigree-border royal-shadow" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <img className="h-48 w-full object-cover" src="/wall-art-taj-mahal.png" alt="Udaipur Palaces" />
              <div className="p-6 bg-white">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Palatial</p>
                <h4 className="font-serif text-2xl mb-2">Udaipur Palaces</h4>
                <p className="text-sm text-muted-foreground">Marble jaalis and mirrored courts meet modern tailoring in a study of light.</p>
              </div>
            </motion.article>
            <motion.article className="rounded-2xl overflow-hidden bg-white filigree-border royal-shadow" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <img className="h-48 w-full object-cover" src="/saree-pattern-1.png" alt="Kanjeevaram Weaves" />
              <div className="p-6 bg-white">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Weaves</p>
                <h4 className="font-serif text-2xl mb-2">Kanjeevaram Lineage</h4>
                <p className="text-sm text-muted-foreground">Zari borders, jewel-toned silks, and heirloom motifs refined for today.</p>
              </div>
            </motion.article>
            <motion.article className="rounded-2xl overflow-hidden bg-white filigree-border royal-shadow" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <img className="h-48 w-full object-cover" src="/jewelry-design-1.png" alt="Temple Jewellery" />
              <div className="p-6 bg-white">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Ornament</p>
                <h4 className="font-serif text-2xl mb-2">Temple Jewellery</h4>
                <p className="text-sm text-muted-foreground">Granulation, repoussé, and divine icons—crafted with enduring brilliance.</p>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* Journal Strip */}
      <section className="py-16 bg-background">
        <div ref={journalRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h3 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2 font-serif gold-text-light">Journal</h3>
              <div className="ornate-divider w-16" />
              <p className="text-muted-foreground">Stories from the House — craft, culture, and design.</p>
            </div>
            <Link href="/about">
              <Button variant="link" className="text-muted-foreground hover:text-foreground">View All →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="group rounded-2xl overflow-hidden border border-border bg-card">
              <img className="h-48 w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/category-sarees.png" alt="Banarasi Weaves" />
              <div className="p-6">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Craft</p>
                <h4 className="font-serif text-2xl mb-2">In Praise of Banarasi Weaves</h4>
                <p className="text-sm text-muted-foreground">Inside the ateliers reviving heirloom patterns with modern finesse.</p>
                <Button variant="link" className="mt-2 px-0">Read Story →</Button>
              </div>
            </article>
            <article className="group rounded-2xl overflow-hidden border border-border bg-card">
              <img className="h-48 w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/kurta-pattern-1.png" alt="Tailoring" />
              <div className="p-6">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Design</p>
                <h4 className="font-serif text-2xl mb-2">Lines, Proportions, Perfection</h4>
                <p className="text-sm text-muted-foreground">How our ateliers approach fit with exacting precision.</p>
                <Button variant="link" className="mt-2 px-0">Read Story →</Button>
              </div>
            </article>
            <article className="group rounded-2xl overflow-hidden border border-border bg-card">
              <img className="h-48 w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/category-jewellery.png" alt="Jewellery" />
              <div className="p-6">
                <p className="uppercase tracking-widest text-xs text-muted-foreground mb-2">Heritage</p>
                <h4 className="font-serif text-2xl mb-2">Temple Earrings, Reimagined</h4>
                <p className="text-sm text-muted-foreground">A closer look at the motifs and materials that endure.</p>
                <Button variant="link" className="mt-2 px-0">Read Story →</Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-16 jaali-pattern temple-pattern gold-border-top gold-border-bottom" style={{ backgroundColor: '#431B25' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl lg:text-4xl font-semibold text-white mb-1 font-serif gold-foil-enhanced embossed-title" data-testid="text-featured-title">
                Featured Pieces
              </h3>
              <div className="ornate-divider w-20" />
              <p className="text-white/70">Limited releases — by invitation</p>
              </div>
            <Link href="/products">
              <Button variant="link" className="hidden sm:block text-white/70 hover:text-white" data-testid="button-view-all">
                View All Products →
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard 
                    product={product} 
                    onQuickView={handleQuickView}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Check out our product categories above to start shopping!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-primary text-primary-foreground px-8 py-3 hover:opacity-90" data-testid="button-load-more">
                View More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2 font-serif">Craftsmanship</h3>
            <div className="ornate-divider mx-auto w-16" />
            <p className="text-muted-foreground max-w-2xl mx-auto">Celebrating Indian ateliers — techniques honed over generations meet modern silhouettes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border p-8 text-center">
              <Gem className="h-8 w-8 mx-auto text-accent mb-4" />
              <h4 className="font-medium mb-2">Hand-set Embellishments</h4>
              <p className="text-sm text-muted-foreground">Intricate zari and stones applied by master artisans for enduring brilliance.</p>
            </div>
            <div className="rounded-2xl border border-border p-8 text-center">
              <Scissors className="h-8 w-8 mx-auto text-accent mb-4" />
              <h4 className="font-medium mb-2">Precision Tailoring</h4>
              <p className="text-sm text-muted-foreground">Clean lines and perfected fits that flatter, season after season.</p>
            </div>
            <div className="rounded-2xl border border-border p-8 text-center">
              <Sparkles className="h-8 w-8 mx-auto text-accent mb-4" />
              <h4 className="font-medium mb-2">Heritage Weaves</h4>
              <p className="text-sm text-muted-foreground">Sourced from storied looms across India — reimagined for today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-background">
        <div ref={trustRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1" data-testid="text-trust-shipping-title">Pan‑India Shipping</h4>
              <p className="text-sm text-muted-foreground">Complimentary on select orders</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1" data-testid="text-trust-payment-title">Made in India</h4>
              <p className="text-sm text-muted-foreground">Authentic ateliers & artisans</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1" data-testid="text-trust-returns-title">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">Hassle‑free within 30 days</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1" data-testid="text-trust-support-title">UPI & Wallets</h4>
              <p className="text-sm text-muted-foreground">Cards, UPI and COD supported</p>
            </div>
          </div>

          {/* Payment strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16">
            <span className="text-gray-600">We accept</span>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded border border-border text-muted-foreground text-sm bg-white">UPI</div>
              <div className="px-3 py-1 rounded border border-border text-muted-foreground text-sm bg-white">Paytm</div>
              <div className="px-3 py-1 rounded border border-border text-muted-foreground text-sm bg-white">GPay</div>
              <div className="px-3 py-1 rounded border border-border text-muted-foreground text-sm bg-white">RuPay</div>
            </div>
          </div>

          {/* Customer testimonials */}
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2 font-serif" data-testid="text-testimonials-title">
              Patrons of the House
            </h3>
            <div className="ornate-divider mx-auto w-20" />
            <p className="text-muted-foreground">Hear from our discerning clientele across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card bg-neutral p-6 rounded-xl border border-border" data-testid="testimonial-card-0">
              <div className="flex items-center mb-4">
                <div className="flex text-accent mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-foreground/80 mb-4" data-testid="text-testimonial-0">
                "Amazing quality and fast delivery! The kurta I ordered exceeded my expectations. Will definitely shop again."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-foreground">Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-neutral p-6 rounded-xl border border-border" data-testid="testimonial-card-1">
              <div className="flex items-center mb-4">
                <div className="flex text-accent mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-foreground/80 mb-4" data-testid="text-testimonial-1">
                "Love the unique designs and excellent customer service. Desipalette has become my go-to for special occasions."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-foreground">Anjali Reddy</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-neutral p-6 rounded-xl border border-border" data-testid="testimonial-card-2">
              <div className="flex items-center mb-4">
                <div className="flex text-accent mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-foreground/80 mb-4" data-testid="text-testimonial-2">
                "Excellent quality products at great prices. The men's collection is particularly impressive with modern cuts and premium fabrics."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-foreground">Rajesh Patel</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
