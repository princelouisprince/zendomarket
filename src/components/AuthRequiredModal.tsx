import React from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, LogIn, UserPlus, X, ShieldCheck } from 'lucide-react';

interface AuthRequiredModalProps {
  onNavigate: (route: string) => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ onNavigate }) => {
  const { authRequiredModalOpen, setAuthRequiredModalOpen } = useStore();

  if (!authRequiredModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-foreground text-center">
        <button
          onClick={() => setAuthRequiredModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl brand-gradient text-white flex items-center justify-center mx-auto shadow-lg shadow-brand/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-foreground">
            Account Sign In Required
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Please sign in to your Zendo account or create a new profile to add items to your cart and complete orders.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-left space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Secure account saves your cart items across devices</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Real-time SMS & WhatsApp tracking on all Rwanda deliveries</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              setAuthRequiredModalOpen(false);
              onNavigate('/login');
            }}
            className="w-full py-3.5 rounded-2xl brand-gradient text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand/20 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthRequiredModalOpen(false);
              onNavigate('/register');
            }}
            className="w-full py-3 rounded-2xl bg-secondary hover:bg-border text-foreground font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Customer Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
