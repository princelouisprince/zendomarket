import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { SUPPORT_PHONE, SUPPORT_WHATSAPP_LINK } from '../lib/constants';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const defaultMsg = "Hello ZENDO! I am shopping on the marketplace and would like assistance.";

  const handleSend = () => {
    const text = encodeURIComponent(customMsg.trim() || defaultMsg);
    window.open(`https://wa.me/250793032430?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-fade-in select-none">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-card border border-border shadow-2xl overflow-hidden p-5 text-foreground space-y-4 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm font-display text-foreground">Chat with ZENDO</h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Kigali Support Desk • Online</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-secondary hover:bg-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Need help finding a product, checking delivery across Rwanda, or becoming a verified vendor? Chat directly with our team on WhatsApp: <strong>+250 793 032 430</strong>.
          </p>

          {/* Quick options */}
          <div className="flex flex-wrap gap-1.5">
            {[
              'Track my delivery 📦',
              'Sourcing request 🔍',
              'Seller onboarding 🏪',
              'Payment help 💳'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setCustomMsg(tag)}
                className="px-2.5 py-1 rounded-xl bg-secondary hover:bg-brand/10 hover:text-brand text-[11px] font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              title="Start WhatsApp Chat"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
        title="Chat with ZENDO on WhatsApp (+250 793 032 430)"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 fill-white" />
        </div>
        <span className="font-display pr-1 hidden sm:inline">Chat with ZENDO</span>
      </button>
    </div>
  );
};
