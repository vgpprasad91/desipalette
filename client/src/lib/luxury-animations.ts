import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap-trial/ScrollTrigger";
import { TextPlugin } from "gsap-trial/TextPlugin";
import { CustomEase } from "gsap-trial/CustomEase";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import { SplitText } from "gsap-trial/SplitText";
import { Flip } from "gsap-trial/Flip";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase, DrawSVGPlugin, SplitText, Flip);

// Custom eases for luxury feel
CustomEase.create("luxuryEase", "0.22, 1, 0.36, 1");
CustomEase.create("silkEase", "0.45, 0, 0.55, 1");

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class LuxuryAnimations {
  private ctx: gsap.Context;
  
  constructor() {
    this.ctx = gsap.context(() => {});
  }

  // Hero Section Animations
  initHeroAnimations(heroRef: HTMLElement) {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();
    
    // 1. Velvet Parallax Layers
    gsap.to(heroRef.querySelector('.parallax'), {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1
      }
    });

    // Background textile layers with different parallax speeds
    gsap.utils.toArray('.textile-layer').forEach((layer: any, i) => {
      gsap.to(layer, {
        yPercent: -20 * (i + 1),
        ease: "none",
        scrollTrigger: {
          trigger: heroRef,
          start: "top top",
          end: "bottom top",
          scrub: 1 + (i * 0.5)
        }
      });
    });

    // 2. Royal Title Unfold
    const title = heroRef.querySelector('h2');
    if (title) {
      const splitTitle = new SplitText(title, { type: "chars" });
      
      tl.from(splitTitle.chars, {
        scale: 0.9,
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.02,
        ease: "luxuryEase"
      });
    }

    // 3. Gilded Underline Sweep
    const underline = heroRef.querySelector('.ornate-divider');
    if (underline) {
      tl.from(underline, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power2.out"
      }, "-=0.4");
    }

    // 4. Hero CTA Hover Crest
    const ctaButtons = heroRef.querySelectorAll('button');
    ctaButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
          letterSpacing: "0.05em",
          duration: 0.15,
          ease: "power2.out"
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          letterSpacing: "0em",
          duration: 0.15,
          ease: "power2.out"
        });
      });
    });

    return tl;
  }

  // Dynasty Capsules Animations
  initDynastyCapsules(section: HTMLElement) {
    if (prefersReducedMotion) return;

    // 5. Silk Reveal Mask
    const cards = section.querySelectorAll('.dynasty-capsule');
    
    gsap.set(cards, {
      clipPath: "inset(0 100% 0 0)"
    });

    ScrollTrigger.batch(cards, {
      onEnter: (elements) => {
        gsap.to(elements, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          stagger: 0.15,
          ease: "power2.out"
        });
      },
      start: "top 80%"
    });

    // 7. Edge-Glow Focus
    cards.forEach(card => {
      const glowTimeline = gsap.timeline({ paused: true });
      
      glowTimeline
        .to(card, {
          y: -6,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(card, {
          "--glow-intensity": 1,
          duration: 0.3,
          ease: "power2.out"
        }, 0);

      card.addEventListener('mouseenter', () => glowTimeline.play());
      card.addEventListener('mouseleave', () => glowTimeline.reverse());
    });
  }

  // House Collections Grid Animations
  initCollectionsGrid(section: HTMLElement) {
    if (prefersReducedMotion) return;

    // 8. Masonry Cascade
    const tiles = section.querySelectorAll('.group');
    
    gsap.set(tiles, {
      y: 50,
      opacity: 0,
      rotationZ: 0.2
    });

    ScrollTrigger.batch(tiles, {
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          rotationZ: 0,
          duration: 0.8,
          stagger: {
            each: 0.1,
            from: "bottom"
          },
          ease: "luxuryEase"
        });
      },
      start: "top 85%"
    });

    // 10. Jewelry Micro-sparkle
    this.addSparkleEffect(section);
  }

  // Royal Provenance Strip Animations
  initRoyalProvenance(section: HTMLElement) {
    if (prefersReducedMotion) return;

    // 11. Threaded Divider Draw
    const divider = section.querySelector('.divider-svg');
    if (divider) {
      gsap.from(divider, {
        drawSVG: "0%",
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 70%"
        }
      });
    }

    // 12. Caption Counter-Scroll
    const images = section.querySelectorAll('img');
    const captions = section.querySelectorAll('.caption');

    images.forEach((img, i) => {
      gsap.to(img, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    captions.forEach((caption, i) => {
      gsap.to(caption, {
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: caption,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });
  }

  // Journal Section Animations
  initJournalSection(section: HTMLElement) {
    if (prefersReducedMotion) return;

    const cards = section.querySelectorAll('article');

    // 13. Page-Turn Reveal
    gsap.set(cards, {
      transformOrigin: "left center",
      rotateY: -15
    });

    ScrollTrigger.batch(cards, {
      onEnter: (elements) => {
        gsap.to(elements, {
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      },
      start: "top 80%"
    });

    // 14. Reading Progress Dots
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-dots';
    section.appendChild(progressBar);

    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      progressBar.appendChild(dot);
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const dots = progressBar.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
          const threshold = (i + 1) / dots.length;
          gsap.to(dot, {
            opacity: self.progress >= threshold ? 1 : 0.3,
            scale: self.progress >= threshold ? 1.2 : 1,
            duration: 0.3
          });
        });
      }
    });
  }

  // Featured Products Animations
  initFeaturedProducts(section: HTMLElement) {
    if (prefersReducedMotion) return;

    const productCards = section.querySelectorAll('.product-card-wrapper');

    // 15. Price Tag Pulse on View
    productCards.forEach(card => {
      const priceTag = card.querySelector('[data-testid*="text-product-price"]');
      const badge = card.querySelector('[data-testid*="badge-"]');

      const pulseTimeline = gsap.timeline({ paused: true });
      
      if (priceTag) {
        pulseTimeline.to(priceTag, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        }).to(priceTag, {
          scale: 1,
          duration: 0.2,
          ease: "power2.in"
        });
      }

      if (badge) {
        pulseTimeline.to(badge, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        }, 0).to(badge, {
          scale: 1,
          duration: 0.2,
          ease: "power2.in"
        }, 0.2);
      }

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        once: true,
        onEnter: () => pulseTimeline.play()
      });
    });

    // 16. 360° Subtle Peek on hover
    this.init360Peek(productCards);
  }

  // Craftsmanship Section
  initCraftsmanship(section: HTMLElement) {
    if (prefersReducedMotion) return;

    // 17. Icon Etch-In
    const icons = section.querySelectorAll('svg');
    icons.forEach(icon => {
      const paths = icon.querySelectorAll('path, line, circle');
      gsap.from(paths, {
        drawSVG: "0%",
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: icon,
          start: "top 80%"
        }
      });
    });

    // 18. Number Count-Up
    const numbers = section.querySelectorAll('[data-count]');
    numbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-count') || '0');
      const obj = { value: 0 };

      ScrollTrigger.create({
        trigger: num,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              num.textContent = Math.floor(obj.value).toString();
            }
          });
        }
      });
    });
  }

  // Testimonials Section
  initTestimonials(section: HTMLElement) {
    if (prefersReducedMotion) return;

    const testimonials = section.querySelectorAll('.testimonial-card');

    // 19. Quill Quote Reveal
    testimonials.forEach(card => {
      const quote = card.querySelector('p[data-testid*="text-testimonial"]');
      if (quote) {
        const splitQuote = new SplitText(quote, { type: "words" });
        
        gsap.from(splitQuote.words, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%"
          }
        });
      }
    });
  }

  // Global Navigation Effects
  initGlobalEffects() {
    if (prefersReducedMotion) return;

    // 23. Silk Scrollbar Enhancement
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        document.documentElement.style.setProperty('--scroll-progress', progress.toString());
      }
    });

    // 26. Back-to-Top Kinetic
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      gsap.to(backToTop, {
        rotation: 8,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });

      backToTop.addEventListener('click', () => {
        gsap.to(window, {
          scrollTo: 0,
          duration: 1,
          ease: "power2.inOut"
        });
      });
    }
  }

  // Helper Functions
  private addSparkleEffect(container: HTMLElement) {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.className = 'sparkle-container';
    container.appendChild(sparkleContainer);

    for (let i = 0; i < 10; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkleContainer.appendChild(sparkle);

      gsap.to(sparkle, {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        scale: "random(0.5, 1.5)",
        opacity: "random(0.3, 1)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }

  private init360Peek(cards: NodeListOf<Element>) {
    cards.forEach(card => {
      const images = card.querySelectorAll('img');
      if (images.length > 1) {
        const tl = gsap.timeline({ paused: true });
        
        images.forEach((img, i) => {
          if (i > 0) {
            gsap.set(img, { autoAlpha: 0 });
            tl.to(images[i - 1], { autoAlpha: 0, duration: 0.3 })
              .to(img, { autoAlpha: 1, duration: 0.3 }, "-=0.15");
          }
        });

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
      }
    });
  }

  // Cleanup
  destroy() {
    this.ctx.revert();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

// Export singleton instance
export const luxuryAnimations = new LuxuryAnimations();