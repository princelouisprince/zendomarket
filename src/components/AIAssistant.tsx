import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Bot,
  User,
  Send,
  X,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Package,
  Store,
  Tag
} from 'lucide-react';
import { formatFRW } from '../lib/constants';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  matchedProducts?: any[];
  matchedCategories?: any[];
  matchedSellers?: any[];
  timestamp: Date;
}

interface AIAssistantProps {
  onNavigate: (route: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onNavigate }) => {
  const { products, categories, sellers, orders, addToCart, formatPrice } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Muraho! I am ZENDO's AI Shopping Assistant. Ask me anything about products in Kigali, prices, vendor stores, order tracking, or sourcing across Rwanda.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processAIQuery(query);
      setIsTyping(false);
    }, 600);
  };

  const processAIQuery = (query: string) => {
    const q = query.toLowerCase();

    // 1. Seller application question
    if (q.includes('become a seller') || q.includes('sell on zendo') || q.includes('merchant') || q.includes('register store')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "🏪 You can become a verified seller on ZENDO in just a few steps! We provide automated payouts (MTN MoMo/Airtel/Card), inventory tools, and courier delivery across all 30 districts of Rwanda. Click below to submit your seller application:",
          timestamp: new Date()
        }
      ]);
      return;
    }

    // 2. Order Tracking query
    if (q.includes('where is my order') || q.includes('track') || q.includes('order status') || q.includes('znd-')) {
      const foundOrder = orders.find((o) => q.includes(o.tracking_code.toLowerCase()) || q.includes(o.id.toLowerCase()));
      if (foundOrder) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `📦 Found Order #${foundOrder.tracking_code}! Current status: ${foundOrder.status.toUpperCase()}. Total: ${formatPrice(foundOrder.total)} destined for ${foundOrder.customer_name} in ${foundOrder.district}.`,
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🔍 To track an order, you can provide your tracking code (e.g. ZND-RW-78921) or visit our live tracking page below:",
            timestamp: new Date()
          }
        ]);
      }
      return;
    }

    // 3. Price filter extraction (e.g., "under 300000", "below 50000")
    const priceMatch = q.match(/(?:under|below|less than|max)\s*(\d+[\d,]*)/i);
    let maxPrice = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : Infinity;

    // 4. Match products from live database
    const matched = products.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(q.replace(/(?:under|below|show me|find|give me)\s*\d+/g, '').trim()) ||
        p.description.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q);

      const effectivePrice = p.discount_price || p.price;
      const matchesPrice = effectivePrice <= maxPrice;

      return matchesText && matchesPrice;
    }).slice(0, 4);

    // 5. Match categories
    const matchedCats = categories.filter((c) => q.includes(c.name.toLowerCase()));

    // 6. Match sellers
    const matchedSellers = sellers.filter((s) => q.includes(s.store_name.toLowerCase()) || q.includes(s.business_name.toLowerCase()));

    if (matched.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `✨ I found ${matched.length} product(s) matching your request from our live Supabase catalog:`,
          matchedProducts: matched,
          timestamp: new Date()
        }
      ]);
    } else if (matchedCats.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `📂 Found matching product category "${matchedCats[0].name}". Click below to explore all items in this section:`,
          matchedCategories: matchedCats,
          timestamp: new Date()
        }
      ]);
    } else if (matchedSellers.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🏪 Found verified store "${matchedSellers[0].store_name}" in ${matchedSellers[0].address || 'Kigali'}.`,
          matchedSellers,
          timestamp: new Date()
        }
      ]);
    } else {
      // General response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `I searched our live database of ${products.length} products and couldn't find an exact match for "${query}". Try searching by category (e.g. "Furniture", "Electronics", "Phones") or submit a Custom Sourcing request!`,
          timestamp: new Date()
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none animate-fade-in">
      {/* Drawer Card */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-[420px] h-[520px] rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col text-foreground animate-scale-up">
          {/* Header */}
          <div className="p-4 bg-secondary/50 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl brand-gradient text-white flex items-center justify-center shadow-md shadow-brand/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm font-display text-foreground flex items-center gap-1.5">
                  <span>ZENDO AI Shopping Guide</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand">LIVE DB</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">Connected to Supabase PostgreSQL</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-secondary hover:bg-border text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl brand-gradient text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed space-y-3 ${
                    m.sender === 'user'
                      ? 'brand-gradient text-white rounded-br-none shadow-sm'
                      : 'bg-secondary/70 border border-border text-foreground rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Matched Product Cards */}
                  {m.matchedProducts && m.matchedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {m.matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between gap-3 text-foreground"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-secondary shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs truncate">{p.name}</h5>
                            <span className="font-extrabold text-brand font-display block">
                              {formatPrice(p.discount_price || p.price)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => {
                                onNavigate(`/product/${p.id}`);
                                setIsOpen(false);
                              }}
                              className="px-2 py-1 rounded-lg bg-secondary hover:bg-border text-[10px] font-bold text-foreground"
                            >
                              View
                            </button>
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="p-1 rounded-lg brand-gradient text-white flex items-center justify-center"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Categories */}
                  {m.matchedCategories && (
                    <div className="pt-1">
                      {m.matchedCategories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onNavigate(`/products?category=${c.id}`);
                            setIsOpen(false);
                          }}
                          className="w-full p-2.5 rounded-xl bg-card border border-border text-left font-bold text-xs text-brand hover:bg-secondary flex items-center justify-between"
                        >
                          <span>Browse {c.name} Catalog</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sourcing action shortcut */}
                  {m.text.includes('seller application') && (
                    <button
                      onClick={() => {
                        onNavigate('/become-seller');
                        setIsOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl brand-gradient text-white font-bold text-xs text-center shadow-sm"
                    >
                      Open Seller Application Page →
                    </button>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
                <span>Searching live database...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-secondary/30 border-t border-border flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              'MacBook M3',
              'Phones in Kigali',
              'Sofas under 300,000 FRW',
              'How to sell on Zendo'
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground shrink-0 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-card border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about products, prices..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-muted-foreground"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl brand-gradient text-white disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full brand-gradient text-white font-bold text-xs shadow-xl shadow-brand/30 hover:scale-105 active:scale-95 transition-all"
        title="AI Shopping Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </div>
        <span className="font-display pr-1 hidden sm:inline">AI Shopping Assistant</span>
      </button>
    </div>
  );
};
