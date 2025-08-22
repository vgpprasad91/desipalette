import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Crown, Sparkles, Clock, Users, Gem, Filter, Grid3X3, List, ChevronDown, X, CheckCircle2, Info, Map, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DYNASTIES = [
  {
    slug: "chola",
    title: "The Chola Edit",
    blurb: "Bronze divinity and temple silk — luminous forms from the Tamil heartland.",
    image: "https://images.unsplash.com/photo-1593152228873-4600a1b46032?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/chola.png",
    state: "Tamil Nadu",
    period: "9th - 13th Century",
    highlights: ["Temple Architecture", "Bronze Sculptures", "Silk Weaving"],
    color: "#B8860B",
    stats: { items: 45, artisans: 12, exclusive: 8 },
    featured: ["Thanjavur Paintings", "Bronze Nataraja", "Kanchipuram Silk"],
    coordinates: { lat: 10.7867, lng: 79.1378 },
    reign: "850 - 1279 CE",
    capital: "Thanjavur",
  },
  {
    slug: "pandya",
    title: "The Pandya Edit",
    blurb: "Temple jewellery, dye-rich silks, and sanctum motifs refined for today.",
    image: "https://images.unsplash.com/photo-1549643276-fdf2caf68f37?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/pandya.png",
    state: "Tamil Nadu",
    period: "6th - 14th Century",
    highlights: ["Temple Jewelry", "Pearl Trading", "Sacred Textiles"],
    color: "#DC143C",
    stats: { items: 38, artisans: 10, exclusive: 6 },
    featured: ["Pearl Necklaces", "Madurai Sungudi", "Temple Jewelry"],
    coordinates: { lat: 9.9252, lng: 78.1198 },
    reign: "600 - 1345 CE",
    capital: "Madurai",
  },
  {
    slug: "rajput",
    title: "The Rajput Edit",
    blurb: "Miniature paintings, meenakari accents, and carved woods in desert jewel tones.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/rajput.svg",
    state: "Rajasthan",
    period: "6th - 20th Century",
    highlights: ["Miniature Art", "Meenakari", "Fortified Palaces"],
    color: "#FF6347",
    stats: { items: 52, artisans: 15, exclusive: 10 },
    featured: ["Meenakari Jewelry", "Miniature Paintings", "Bandhani"],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    reign: "550 - 1949 CE",
    capital: "Jaipur, Jodhpur, Udaipur",
  },
  {
    slug: "mughal",
    title: "The Mughal Edit",
    blurb: "Pietra dura florals, garden courts, and fine inlay in marble hues.",
    image: "https://images.unsplash.com/photo-1601202902206-5f6dca128187?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/mughal.png",
    state: "Delhi & Agra",
    period: "16th - 18th Century",
    highlights: ["Marble Inlay", "Persian Gardens", "Court Fashion"],
    color: "#4682B4",
    stats: { items: 64, artisans: 18, exclusive: 12 },
    featured: ["Pietra Dura", "Mughal Miniatures", "Chikankari"],
    coordinates: { lat: 27.1767, lng: 78.0081 },
    reign: "1526 - 1857 CE",
    capital: "Delhi, Agra, Lahore",
  },
  {
    slug: "maratha",
    title: "The Maratha Edit",
    blurb: "Paithani borders, warrior traditions, and bold Deccan motifs.",
    image: "https://images.unsplash.com/photo-1567474847003-36e93d862f73?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/maratha.png",
    state: "Maharashtra",
    period: "17th - 19th Century",
    highlights: ["Paithani Sarees", "Fort Architecture", "War Regalia"],
    color: "#FF8C00",
    stats: { items: 47, artisans: 13, exclusive: 9 },
    featured: ["Paithani Weaves", "Kolhapuri Jewelry", "Warli Art"],
    coordinates: { lat: 18.5204, lng: 73.8567 },
    reign: "1674 - 1818 CE",
    capital: "Pune, Raigad",
  },
  {
    slug: "nizam",
    title: "The Nizam Edit",
    blurb: "Golconda diamonds, pearls, and opulent Hyderabadi court fashion.",
    image: "https://images.unsplash.com/photo-1535726917010-e9c528bf9f47?auto=format&fit=crop&w=1400&q=80",
    emblem: "/dynasty-emblems/nizam.png",
    state: "Telangana",
    period: "18th - 20th Century",
    highlights: ["Diamond Trading", "Pearl Jewelry", "Bidri Craft"],
    color: "#9370DB",
    stats: { items: 56, artisans: 16, exclusive: 11 },
    featured: ["Golconda Diamonds", "Hyderabadi Pearls", "Bidriware"],
    coordinates: { lat: 17.3850, lng: 78.4867 },
    reign: "1724 - 1948 CE",
    capital: "Hyderabad",
  },
];

const STATES = ["All States", ...Array.from(new Set(DYNASTIES.map(d => d.state)))].sort();

export default function Collections() {
  const [, navigate] = useLocation();
  const [selectedState, setSelectedState] = useState("All States");
  const [viewMode, setViewMode] = useState<"grid" | "timeline" | "map">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [selectedDynasties, setSelectedDynasties] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [hoveredDynasty, setHoveredDynasty] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [minItems, setMinItems] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    state: true,
    period: true,
    size: true,
    sort: true
  });
  
  let filteredDynasties = selectedState === "All States" 
    ? DYNASTIES 
    : DYNASTIES.filter(d => d.state === selectedState);
    
  // Apply period filter
  if (periodFilter !== "all") {
    filteredDynasties = filteredDynasties.filter(d => {
      const startYear = parseInt(d.reign.split(" ")[0]);
      switch (periodFilter) {
        case "ancient": return startYear < 1000;
        case "medieval": return startYear >= 1000 && startYear < 1500;
        case "modern": return startYear >= 1500;
        default: return true;
      }
    });
  }
  
  // Apply minimum items filter
  if (minItems > 0) {
    filteredDynasties = filteredDynasties.filter(d => d.stats.items >= minItems);
  }
    
  const sortedDynasties = [...filteredDynasties].sort((a, b) => {
    switch (sortBy) {
      case "period":
        return parseInt(a.reign.split(" ")[0]) - parseInt(b.reign.split(" ")[0]);
      case "items":
        return b.stats.items - a.stats.items;
      case "state":
        return a.state.localeCompare(b.state);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const toggleDynastySelection = (slug: string) => {
    setSelectedDynasties(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const totalStats = {
    items: DYNASTIES.reduce((sum, d) => sum + d.stats.items, 0),
    artisans: DYNASTIES.reduce((sum, d) => sum + d.stats.artisans, 0),
    exclusive: DYNASTIES.reduce((sum, d) => sum + d.stats.exclusive, 0),
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#FAF8F5] jaali-pattern bg-ruby-soft">
      {/* Majestic Hero Section */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, #2D0F15 0%, #431B25 50%, #5A2832 100%)'
      }}>
        {/* Royal Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating Gold Particles */}
        <div className="absolute inset-0 gold-particles"></div>
        
        {/* Main Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              {/* Royal Crest */}
              <motion.div 
                className="inline-flex items-center justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F4E5C2] blur-2xl opacity-50"></div>
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F4E5C2] to-[#B8860B] p-1">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2D0F15] to-[#431B25] flex items-center justify-center">
                      <Crown className="h-12 w-12 text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Royal Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-[#D4AF37] text-sm uppercase tracking-[0.4em] mb-4 font-semibold">
                  ✦ Royal Heritage of India ✦
                </p>
                <h1 className="text-6xl lg:text-8xl font-serif font-bold mb-6 gold-foil-enhanced">
                  Dynasty Collections
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  <Sparkles className="h-6 w-6 text-[#D4AF37] animate-pulse" />
                  <div className="w-32 h-[3px] bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent"></div>
                </div>
                <p className="max-w-3xl mx-auto text-[#F4E5C2] text-xl leading-relaxed drop-cap">
                  Step into the opulent world of India's greatest royal dynasties. Each collection is a testament to centuries of artistic patronage, 
                  where museum-worthy heritage meets contemporary luxury.
                </p>
              </motion.div>
              
              {/* Royal Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  { icon: Crown, label: "Royal Dynasties", value: 6 },
                  { icon: Gem, label: "Curated Items", value: totalStats.items },
                  { icon: Users, label: "Master Artisans", value: totalStats.artisans },
                  { icon: Sparkles, label: "Exclusive Pieces", value: totalStats.exclusive }
                ].map((stat, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl p-6 hover:border-[#D4AF37]/60 transition-all duration-300">
                      <stat.icon className="h-8 w-8 text-[#D4AF37] mx-auto mb-3" />
                      <h3 className="text-3xl font-bold text-[#F4E5C2] mb-1">{stat.value}</h3>
                      <p className="text-sm text-[#D4AF37]/80">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom Ornamental Border */}
          <div className="relative h-24">
            <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,120 L0,60 Q300,0 600,60 T1200,60 L1200,120 Z" fill="#FAF8F5" />
              <path d="M0,120 L0,70 Q300,20 600,70 T1200,70 L1200,120 Z" fill="#FAF8F5" opacity="0.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Selected Dynasties Action Bar */}
      <AnimatePresence>
        {selectedDynasties.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-[#4A1F2A] text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-4">
              <span className="text-sm font-medium">{selectedDynasties.length} selected</span>
              <div className="h-4 w-px bg-white/30"></div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setShowComparison(true)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setSelectedDynasties([])}
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynasty Display Section with Sidebar */}
      <section className="py-16 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='100' y1='0' y2='100' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23D4AF37'/%3E%3Cstop offset='1' stop-color='%23B8860B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23a)' d='M50 5l12.5 37.5L100 50l-37.5 12.5L50 100 37.5 62.5 0 50l37.5-12.5z' opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32 space-y-6">
                {/* Filter Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#C5A572]/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-[#C5A572]" />
                      <h3 className="text-lg font-semibold text-[#4A1F2A]">Filters</h3>
                    </div>
                    {(selectedState !== "All States" || periodFilter !== "all" || minItems > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedState("All States");
                          setPeriodFilter("all");
                          setMinItems(0);
                        }}
                        className="text-xs text-[#C5A572] hover:text-[#B8975F]"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* State Filter */}
                  <div className="space-y-4">
                    <div>
                      <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, state: !prev.state }))}
                        className="w-full text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3 flex items-center justify-between group hover:text-[#4A1F2A] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#C5A572]" />
                          State
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.state ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFilters.state && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {STATES.map((state) => (
                              <button
                                key={state}
                                onClick={() => setSelectedState(state)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                                  selectedState === state
                                    ? 'bg-[#C5A572] text-white'
                                    : 'hover:bg-[#F1ECE1] text-[#6B4C3A]'
                                }`}
                              >
                                {state}
                                <span className="float-right text-xs opacity-70">
                                  ({state === "All States" ? DYNASTIES.length : DYNASTIES.filter(d => d.state === state).length})
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Period Filter */}
                    <div className="pt-4 border-t border-[#C5A572]/20">
                      <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, period: !prev.period }))}
                        className="w-full text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3 flex items-center justify-between group hover:text-[#4A1F2A] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#C5A572]" />
                          Historical Period
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.period ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFilters.period && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Select value={periodFilter} onValueChange={setPeriodFilter}>
                              <SelectTrigger className="w-full border-[#C5A572]/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                <SelectItem value="ancient">Ancient (Before 1000 CE)</SelectItem>
                                <SelectItem value="medieval">Medieval (1000-1500 CE)</SelectItem>
                                <SelectItem value="modern">Modern (After 1500 CE)</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Collection Size Filter */}
                    <div className="pt-4 border-t border-[#C5A572]/20">
                      <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, size: !prev.size }))}
                        className="w-full text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3 flex items-center justify-between group hover:text-[#4A1F2A] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Gem className="h-4 w-4 text-[#C5A572]" />
                          Collection Size
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.size ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFilters.size && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2">
                              <label className="text-xs text-[#6B4C3A]">
                                Minimum Items: <span className="font-semibold">{minItems > 0 ? minItems : 'Any'}</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="60"
                                step="5"
                                value={minItems}
                                onChange={(e) => setMinItems(parseInt(e.target.value))}
                                className="w-full h-2 bg-[#C5A572]/20 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, #C5A572 0%, #C5A572 ${(minItems / 60) * 100}%, #C5A572/20 ${(minItems / 60) * 100}%, #C5A572/20 100%)`
                                }}
                              />
                              <div className="flex justify-between text-xs text-[#6B4C3A]/60">
                                <span>0</span>
                                <span>30</span>
                                <span>60</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sort Options */}
                    <div className="pt-4 border-t border-[#C5A572]/20">
                      <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, sort: !prev.sort }))}
                        className="w-full text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3 flex items-center justify-between group hover:text-[#4A1F2A] transition-colors"
                      >
                        <span>Sort By</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.sort ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFilters.sort && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger className="w-full border-[#C5A572]/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="period">Historical Period</SelectItem>
                                <SelectItem value="items">Collection Size</SelectItem>
                                <SelectItem value="state">State</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-[#F1ECE1] to-[#FAF8F5] rounded-2xl p-6 border border-[#C5A572]/20">
                  <h4 className="text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-4">
                    Current Selection
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B4C3A]">Dynasties</span>
                      <span className="text-lg font-bold text-[#C5A572]">{filteredDynasties.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B4C3A]">Total Items</span>
                      <span className="text-lg font-bold text-[#C5A572]">
                        {filteredDynasties.reduce((sum, d) => sum + d.stats.items, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B4C3A]">Artisans</span>
                      <span className="text-lg font-bold text-[#C5A572]">
                        {filteredDynasties.reduce((sum, d) => sum + d.stats.artisans, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-4 right-4 z-40">
              <Button
                onClick={() => setShowMobileFilters(true)}
                className="bg-[#C5A572] hover:bg-[#B8975F] text-white rounded-full shadow-lg p-4"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Filter Sheet */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="absolute left-0 top-0 h-full w-80 bg-[#FAF8F5] shadow-2xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#4A1F2A]">Filters</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowMobileFilters(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Copy the same filter content from desktop */}
                      <div className="space-y-6">
                        {/* State Filter */}
                        <div>
                          <button
                            onClick={() => setExpandedFilters(prev => ({ ...prev, state: !prev.state }))}
                            className="w-full text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3 flex items-center justify-between group hover:text-[#4A1F2A] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#C5A572]" />
                              State
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedFilters.state ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {expandedFilters.state && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 overflow-hidden"
                              >
                                {STATES.map((state) => (
                                  <button
                                    key={state}
                                    onClick={() => setSelectedState(state)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                                      selectedState === state
                                        ? 'bg-[#C5A572] text-white'
                                        : 'hover:bg-[#F1ECE1] text-[#6B4C3A]'
                                    }`}
                                  >
                                    {state}
                                    <span className="float-right text-xs opacity-70">
                                      ({state === "All States" ? DYNASTIES.length : DYNASTIES.filter(d => d.state === state).length})
                                    </span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Period Filter */}
                        <div className="pt-4 border-t border-[#C5A572]/20">
                          <h4 className="text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3">
                            Historical Period
                          </h4>
                          <Select value={periodFilter} onValueChange={setPeriodFilter}>
                            <SelectTrigger className="w-full border-[#C5A572]/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Periods</SelectItem>
                              <SelectItem value="ancient">Ancient (Before 1000 CE)</SelectItem>
                              <SelectItem value="medieval">Medieval (1000-1500 CE)</SelectItem>
                              <SelectItem value="modern">Modern (After 1500 CE)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Collection Size Filter */}
                        <div className="pt-4 border-t border-[#C5A572]/20">
                          <h4 className="text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3">
                            Collection Size
                          </h4>
                          <div className="space-y-2">
                            <label className="text-xs text-[#6B4C3A]">
                              Minimum Items: <span className="font-semibold">{minItems > 0 ? minItems : 'Any'}</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="60"
                              step="5"
                              value={minItems}
                              onChange={(e) => setMinItems(parseInt(e.target.value))}
                              className="w-full h-2 bg-[#C5A572]/20 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #C5A572 0%, #C5A572 ${(minItems / 60) * 100}%, #C5A572/20 ${(minItems / 60) * 100}%, #C5A572/20 100%)`
                              }}
                            />
                            <div className="flex justify-between text-xs text-[#6B4C3A]/60">
                              <span>0</span>
                              <span>30</span>
                              <span>60</span>
                            </div>
                          </div>
                        </div>

                        {/* Sort Options */}
                        <div className="pt-4 border-t border-[#C5A572]/20">
                          <h4 className="text-sm font-semibold text-[#6B4C3A] uppercase tracking-wider mb-3">
                            Sort By
                          </h4>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full border-[#C5A572]/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="period">Historical Period</SelectItem>
                              <SelectItem value="items">Collection Size</SelectItem>
                              <SelectItem value="state">State</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1">
              {/* View Mode Toggle and Section Title */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-3xl font-serif font-bold text-[#4A1F2A]">
                      Explore Royal Legacies
                    </h2>
                  </motion.div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`
                        ${viewMode === "grid" 
                          ? 'bg-[#C5A572] text-white' 
                          : 'border-[#C5A572]/30 text-[#6B4C3A]'
                        } transition-all duration-300
                      `}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "timeline" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("timeline")}
                      className={`
                        ${viewMode === "timeline" 
                          ? 'bg-[#C5A572] text-white' 
                          : 'border-[#C5A572]/30 text-[#6B4C3A]'
                        } transition-all duration-300
                      `}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                      className={`
                        ${viewMode === "map" 
                          ? 'bg-[#C5A572] text-white' 
                          : 'border-[#C5A572]/30 text-[#6B4C3A]'
                        } transition-all duration-300
                      `}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-[#6B4C3A] text-center">
                  Each dynasty tells a story of grandeur, artistry, and timeless elegance
                </p>
              </div>
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                className="grid md:grid-cols-2 gap-8"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                variants={{ 
                  hidden: { opacity: 0 }, 
                  show: { 
                    opacity: 1, 
                    transition: { staggerChildren: 0.1 } 
                  } 
                }}
              >
                {sortedDynasties.map((dynasty) => (
                  <motion.article
                    key={dynasty.slug}
                    className="group relative"
                    variants={{ 
                      hidden: { opacity: 0, y: 30 }, 
                      show: { opacity: 1, y: 0 } 
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 right-4 z-20">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDynastySelection(dynasty.slug);
                          }}
                          className={`
                            w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                            ${selectedDynasties.includes(dynasty.slug)
                              ? 'bg-[#C5A572] border-[#C5A572]'
                              : 'bg-white/20 border-white/50 backdrop-blur-sm hover:bg-white/30'
                            }
                          `}
                        >
                          {selectedDynasties.includes(dynasty.slug) && (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </div>

                      <Link href={`/collections/${dynasty.slug}`}>
                        <motion.div 
                          className="cursor-pointer h-full"
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative h-full overflow-hidden rounded-3xl group" style={{
                            background: `linear-gradient(135deg, ${dynasty.color}15 0%, transparent 50%)`,
                            backdropFilter: 'blur(10px)'
                          }}>
                            {/* Royal Border Frame */}
                            <div className="absolute inset-0 p-[2px] bg-gradient-to-br from-[#D4AF37] via-transparent to-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
                              <div className="absolute inset-[2px] bg-[#FAF8F5] rounded-3xl"></div>
                            </div>
                            
                            {/* Main Container */}
                            <div className="relative h-full bg-gradient-to-b from-white via-[#FAF8F5] to-[#F1ECE1] rounded-3xl overflow-hidden">
                              {/* Dynasty Pattern Background */}
                              <div className="absolute inset-0 opacity-5" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${dynasty.color.replace('#', '%23')}' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px'
                              }}></div>
                              
                              {/* Top Section with Image */}
                              <div className="relative h-64 overflow-hidden">
                                <img 
                                  src={dynasty.image} 
                                  alt={dynasty.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                                
                                {/* Dynasty Emblem Badge */}
                                <div className="absolute top-4 left-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] blur-xl opacity-70"></div>
                                    <div className="relative bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-[3px] rounded-2xl shadow-lg">
                                      <div className="bg-white rounded-2xl p-2 w-20 h-20 flex items-center justify-center">
                                        <img 
                                          src={dynasty.emblem} 
                                          alt={`${dynasty.title} emblem`}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Stats in Top Right */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                    <Gem className="h-3 w-3 text-[#B8860B]" />
                                    <span className="text-xs font-semibold text-[#4A1F2A]">{dynasty.stats.items}</span>
                                  </div>
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                    <Users className="h-3 w-3 text-[#B8860B]" />
                                    <span className="text-xs font-semibold text-[#4A1F2A]">{dynasty.stats.artisans}</span>
                                  </div>
                                </div>
                                
                                {/* Dynasty Title Overlay */}
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-serif text-3xl text-white font-bold mb-1 drop-shadow-lg">
                                    {dynasty.title}
                                  </h3>
                                  <p className="text-white/90 text-sm">
                                    {dynasty.capital} • {dynasty.state}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Bottom Section */}
                              <div className="p-6">
                                {/* Period Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 border border-[#D4AF37]/30 mb-4">
                                  <Calendar className="h-3 w-3 text-[#B8860B]" />
                                  <span className="text-xs font-semibold text-[#6B4C3A]">{dynasty.reign}</span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-[#6B4C3A] text-sm mb-4 line-clamp-2">
                                  {dynasty.blurb}
                                </p>
                                
                                {/* Featured Items */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {dynasty.featured.slice(0, 2).map((item, i) => (
                                    <span 
                                      key={i}
                                      className="text-xs px-2 py-1 rounded-full bg-[#F1ECE1] text-[#6B4C3A] border border-[#C5A572]/20"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                  {dynasty.featured.length > 2 && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#F1ECE1] text-[#6B4C3A] border border-[#C5A572]/20">
                                      +{dynasty.featured.length - 2} more
                                    </span>
                                  )}
                                </div>
                                
                                {/* CTA Button */}
                                <div className="flex items-center justify-between">
                                  <motion.button 
                                    className="flex items-center gap-2 text-sm font-semibold text-[#B8860B] group-hover:text-[#D4AF37] transition-colors"
                                    whileHover={{ x: 5 }}
                                  >
                                    <span>Explore Collection</span>
                                    <span className="text-lg">→</span>
                                  </motion.button>
                                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0">
                                    {dynasty.stats.exclusive} Exclusive
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Dynasty Color Accent Line */}
                              <div 
                                className="absolute bottom-0 left-0 w-full h-1 group-hover:h-2 transition-all duration-300"
                                style={{ backgroundColor: dynasty.color }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : viewMode === "timeline" ? (
              /* Timeline View */
              <motion.div
                key="timeline"
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Timeline Header */}
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-serif text-[#4A1F2A] mb-2">Historical Timeline</h3>
                  <p className="text-[#6B4C3A]">Journey through centuries of royal patronage</p>
                </div>
                
                {/* Century Markers */}
                <div className="absolute left-0 top-20 bottom-0 w-full">
                  {[600, 800, 1000, 1200, 1400, 1600, 1800, 2000].map((year) => (
                    <div
                      key={year}
                      className="absolute left-12 flex items-center gap-4"
                      style={{ top: `${((year - 600) / 1400) * 100}%` }}
                    >
                      <div className="w-2 h-2 bg-[#C5A572]/50 rounded-full -translate-x-1/2"></div>
                      <span className="text-xs text-[#C5A572] font-medium">{year} CE</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute left-12 top-20 bottom-0 w-0.5 bg-gradient-to-b from-[#C5A572]/20 via-[#C5A572]/40 to-[#C5A572]/20"></div>
                <div className="space-y-8 pt-8">
                  {sortedDynasties.map((dynasty, index) => (
                    <motion.div
                      key={dynasty.slug}
                      className="relative flex items-start gap-8"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Timeline Marker */}
                      <div className="absolute left-12 w-4 h-4 bg-[#C5A572] rounded-full -translate-x-1/2 ring-4 ring-[#F1ECE1]">
                        <div className="absolute inset-0 bg-[#C5A572] rounded-full animate-ping opacity-30"></div>
                      </div>
                      
                      {/* Period Label */}
                      <div className="w-40 text-right pr-4">
                        <p className="text-sm font-bold text-[#4A1F2A]">{dynasty.reign}</p>
                        <p className="text-xs text-[#6B4C3A]">{dynasty.capital}</p>
                        <div className="mt-1 h-1 w-full bg-gradient-to-l from-[#C5A572]/30 to-transparent rounded"></div>
                      </div>
                      
                      {/* Dynasty Card */}
                      <div className="flex-1 ml-8">
                        <Link href={`/collections/${dynasty.slug}`}>
                          <div className="group royal-card rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#C5A572]/20">
                            <div className="flex relative">
                              <div className="w-48 h-48 relative">
                                <img 
                                  src={dynasty.image} 
                                  alt={dynasty.title}
                                  className="w-full h-full object-cover"
                                />
                                {/* Dynasty Emblem Overlay */}
                                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-xl p-2 w-14 h-14 shadow-lg border border-[#D4AF37]/20">
                                  <img 
                                    src={dynasty.emblem} 
                                    alt={`${dynasty.title} emblem`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-serif text-2xl text-[#4A1F2A] group-hover:text-[#C5A572] transition-colors">
                                      {dynasty.title}
                                    </h3>
                                    <p className="text-sm text-[#6B4C3A] mt-1">
                                      <MapPin className="inline h-3 w-3 mr-1" />
                                      {dynasty.state}
                                    </p>
                                  </div>
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: dynasty.color }}
                                  ></div>
                                </div>
                                <p className="text-sm text-[#6B4C3A] mb-3 line-clamp-2">
                                  {dynasty.blurb}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="text-[#6B4C3A]">
                                    <Gem className="inline h-3 w-3 mr-1 text-[#C5A572]" />
                                    {dynasty.stats.items} Items
                                  </span>
                                  <span className="text-[#6B4C3A]">
                                    <Users className="inline h-3 w-3 mr-1 text-[#C5A572]" />
                                    {dynasty.stats.artisans} Artisans
                                  </span>
                                  <span className="text-[#6B4C3A]">
                                    <Sparkles className="inline h-3 w-3 mr-1 text-[#C5A572]" />
                                    {dynasty.stats.exclusive} Exclusive
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : viewMode === "map" ? (
              /* Map View */
              <motion.div
                key="map"
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="royal-card rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-serif text-[#4A1F2A]">Dynasty Locations Across India</h3>
                    <Badge variant="outline" className="border-[#C5A572] text-[#6B4C3A]">
                      {sortedDynasties.length} Dynasties
                    </Badge>
                  </div>
                  
                  {/* SVG Map of India */}
                  <div className="relative w-full max-w-4xl mx-auto">
                    <svg viewBox="0 0 800 900" className="w-full h-auto">
                      {/* India Map Outline - Simplified */}
                      <path
                        d="M350 100 L450 80 L520 100 L580 140 L620 180 L640 240 L660 300 L680 360 L700 420 L720 480 L700 540 L680 600 L640 660 L600 700 L540 740 L480 760 L420 780 L360 800 L300 780 L240 740 L180 680 L140 620 L120 560 L100 500 L80 440 L100 380 L120 320 L160 260 L200 200 L260 140 L320 120 L350 100 Z"
                        fill="#FAF8F5"
                        stroke="#C5A572"
                        strokeWidth="2"
                      />
                      
                      {/* State Boundaries - Simplified */}
                      <g stroke="#C5A572" strokeWidth="1" opacity="0.3">
                        {/* Tamil Nadu */}
                        <path d="M380 600 L420 620 L440 680 L420 740 L380 760 L340 740 L320 680 L340 620 L380 600 Z" />
                        {/* Rajasthan */}
                        <path d="M200 200 L300 180 L380 200 L400 280 L380 360 L300 380 L220 360 L180 280 L200 200 Z" />
                        {/* Delhi */}
                        <circle cx="350" cy="250" r="30" />
                        {/* Karnataka */}
                        <path d="M320 500 L380 480 L420 500 L440 560 L420 620 L380 640 L340 620 L320 560 L320 500 Z" />
                        {/* Maharashtra */}
                        <path d="M280 400 L360 380 L420 400 L440 460 L420 520 L360 540 L300 520 L280 460 L280 400 Z" />
                        {/* Telangana */}
                        <path d="M380 440 L440 420 L480 440 L500 500 L480 560 L440 580 L400 560 L380 500 L380 440 Z" />
                        {/* Kerala */}
                        <path d="M340 680 L380 700 L400 760 L380 820 L340 800 L320 740 L340 680 Z" />
                      </g>
                      
                      {/* Dynasty Markers */}
                      {sortedDynasties.map((dynasty) => {
                        // Map coordinates based on dynasty locations
                        const coords = {
                          "chola": { x: 400, y: 680 },
                          "pandya": { x: 360, y: 720 },
                          "rajput": { x: 280, y: 280 },
                          "mughal": { x: 350, y: 250 },
                          "maratha": { x: 340, y: 460 },
                          "nizam": { x: 420, y: 480 }
                        }[dynasty.slug] || { x: 400, y: 400 };
                        
                        const isSelected = selectedState === "All States" || selectedState === dynasty.state;
                        const isHovered = hoveredDynasty === dynasty.slug;
                        
                        return (
                          <g key={dynasty.slug}>
                            <motion.circle
                              cx={coords.x}
                              cy={coords.y}
                              r={isHovered ? 20 : 16}
                              fill={dynasty.color}
                              fillOpacity={isSelected ? 0.8 : 0.3}
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all duration-300"
                              onMouseEnter={() => setHoveredDynasty(dynasty.slug)}
                              onMouseLeave={() => setHoveredDynasty(null)}
                              onClick={() => navigate(`/collections/${dynasty.slug}`)}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                            />
                            {/* Dynasty Icon */}
                            <Crown
                              x={coords.x - 8}
                              y={coords.y - 8}
                              width="16"
                              height="16"
                              fill="white"
                              className="pointer-events-none"
                            />
                            {/* Label on hover */}
                            {isHovered && (
                              <g>
                                <rect
                                  x={coords.x - 80}
                                  y={coords.y - 55}
                                  width="160"
                                  height="40"
                                  fill="white"
                                  stroke={dynasty.color}
                                  strokeWidth="2"
                                  rx="4"
                                />
                                <image
                                  href={dynasty.emblem}
                                  x={coords.x - 75}
                                  y={coords.y - 50}
                                  width="30"
                                  height="30"
                                />
                                <text
                                  x={coords.x + 10}
                                  y={coords.y - 25}
                                  textAnchor="middle"
                                  className="text-sm font-semibold fill-[#4A1F2A]"
                                >
                                  {dynasty.title.replace("The ", "").replace(" Edit", "")}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {sortedDynasties.map((dynasty) => (
                      <div
                        key={dynasty.slug}
                        className="flex items-center gap-2 cursor-pointer"
                        onMouseEnter={() => setHoveredDynasty(dynasty.slug)}
                        onMouseLeave={() => setHoveredDynasty(null)}
                        onClick={() => navigate(`/collections/${dynasty.slug}`)}
                      >
                        <div
                          className="w-4 h-4 rounded-full transition-transform duration-300"
                          style={{ 
                            backgroundColor: dynasty.color,
                            transform: hoveredDynasty === dynasty.slug ? 'scale(1.5)' : 'scale(1)'
                          }}
                        />
                        <span className="text-sm text-[#6B4C3A] hover:text-[#4A1F2A] transition-colors">
                          {dynasty.title.replace("The ", "").replace(" Edit", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          {/* Dynasty Comparison Modal */}
          <AnimatePresence>
            {showComparison && selectedDynasties.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowComparison(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8 border-b border-[#C5A572]/20">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-serif text-[#4A1F2A]">Dynasty Comparison</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowComparison(false)}
                        className="text-[#6B4C3A] hover:text-[#4A1F2A]"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {DYNASTIES.filter(d => selectedDynasties.includes(d.slug)).map((dynasty) => (
                        <div key={dynasty.slug} className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#C5A572]/20">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl text-[#4A1F2A]">{dynasty.title}</h3>
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: dynasty.color }}
                            />
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B4C3A]">Period:</span>
                              <span className="font-medium text-[#4A1F2A]">{dynasty.reign}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B4C3A]">Capital:</span>
                              <span className="font-medium text-[#4A1F2A]">{dynasty.capital}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B4C3A]">State:</span>
                              <span className="font-medium text-[#4A1F2A]">{dynasty.state}</span>
                            </div>
                            <div className="border-t border-[#C5A572]/20 pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[#6B4C3A]">Collection Items:</span>
                                <span className="font-bold text-[#C5A572]">{dynasty.stats.items}</span>
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[#6B4C3A]">Master Artisans:</span>
                                <span className="font-bold text-[#C5A572]">{dynasty.stats.artisans}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#6B4C3A]">Exclusive Pieces:</span>
                                <span className="font-bold text-[#C5A572]">{dynasty.stats.exclusive}</span>
                              </div>
                            </div>
                            <div className="border-t border-[#C5A572]/20 pt-3">
                              <p className="text-[#6B4C3A] font-medium mb-2">Highlights:</p>
                              <div className="flex flex-wrap gap-1">
                                {dynasty.highlights.map((highlight, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 bg-[#C5A572]/10 text-[#6B4C3A] rounded-full"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Comparison Summary */}
                    <div className="mt-8 bg-gradient-to-r from-[#F1ECE1] to-[#FAF8F5] rounded-2xl p-6">
                      <h4 className="font-serif text-xl text-[#4A1F2A] mb-4">Quick Comparison</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-[#6B4C3A] text-sm">Total Items</p>
                          <p className="text-2xl font-bold text-[#C5A572]">
                            {DYNASTIES.filter(d => selectedDynasties.includes(d.slug))
                              .reduce((sum, d) => sum + d.stats.items, 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B4C3A] text-sm">Total Artisans</p>
                          <p className="text-2xl font-bold text-[#C5A572]">
                            {DYNASTIES.filter(d => selectedDynasties.includes(d.slug))
                              .reduce((sum, d) => sum + d.stats.artisans, 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B4C3A] text-sm">Exclusive Pieces</p>
                          <p className="text-2xl font-bold text-[#C5A572]">
                            {DYNASTIES.filter(d => selectedDynasties.includes(d.slug))
                              .reduce((sum, d) => sum + d.stats.exclusive, 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B4C3A] text-sm">Time Span</p>
                          <p className="text-2xl font-bold text-[#C5A572]">
                            {Math.max(...DYNASTIES.filter(d => selectedDynasties.includes(d.slug))
                              .map(d => parseInt(d.reign.split(" - ")[1].split(" ")[0]))) - 
                             Math.min(...DYNASTIES.filter(d => selectedDynasties.includes(d.slug))
                              .map(d => parseInt(d.reign.split(" - ")[0])))}
                            <span className="text-sm font-normal"> years</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Empty State */}
          {sortedDynasties.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Crown className="h-16 w-16 text-[#C5A572]/30 mx-auto mb-4" />
              <p className="text-[#6B4C3A] text-lg">No dynasty collections found for the selected filters.</p>
            </motion.div>
          )}
            </div>
          </div>
        </div>
      </section>

      {/* Royal Newsletter Section */}
      <section className="relative py-20 overflow-hidden" style={{
        background: 'linear-gradient(180deg, #FAF8F5 0%, #2D0F15 100%)'
      }}>
        {/* Royal Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.3'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 40h2l-2 2V40zm40 0h2l-2 2V40zm0-40h2l-2 2V0z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Crown Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] mb-6">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4 gold-foil-enhanced">
              Join The Royal Court
            </h2>
            <p className="text-[#F4E5C2] text-lg mb-8 max-w-2xl mx-auto">
              Be the first to receive exclusive invitations to our palace soirées, private collection previews, and royal announcements.
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Royal Email"
                  className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-[#D4AF37]/50 text-white placeholder:text-white/60 focus:outline-none focus:border-[#D4AF37] focus:bg-white/20 transition-all pr-32"
                />
                <Button className="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0 hover:from-[#B8860B] hover:to-[#D4AF37] transition-all">
                  Subscribe
                </Button>
              </div>
            </form>
            
            <p className="text-sm text-[#F4E5C2]/70 mt-4">
              Your privacy is sacred. Unsubscribe with grace anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
    </TooltipProvider>
  );
}
