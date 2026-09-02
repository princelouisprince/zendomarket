// Global Sourcing RFQ pipeline — single source of truth used by the
// SourcingPage, Admin/SuperAdmin milestone updater, and the public Track page.

import { SourcingStatus } from '../types';

export interface RfqMilestone {
  status: SourcingStatus;
  label: string;
  description: string;
  icon: 'document' | 'search' | 'quote' | 'approved' | 'quality' | 'shipping' | 'delivered';
}

export const RFQ_PIPELINE: RfqMilestone[] = [
  {
    status: 'requested',
    label: 'RFQ Submitted',
    description: 'Your sourcing request has been received and assigned a unique RFQ number.',
    icon: 'document'
  },
  {
    status: 'searching',
    label: 'Factory Search',
    description: 'Our Kigali logistics desk is sourcing verified factories in your target region.',
    icon: 'search'
  },
  {
    status: 'quoted',
    label: 'Quotation',
    description: 'An official quotation has been prepared and is awaiting your approval.',
    icon: 'quote'
  },
  {
    status: 'approved',
    label: 'Production',
    description: 'Production has been confirmed and the manufacturer is preparing your order.',
    icon: 'approved'
  },
  {
    status: 'in_transit',
    label: 'Shipping',
    description: 'Your cargo is in international air/sea transit to Rwanda.',
    icon: 'shipping'
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Delivered to the destination address. Welcome to ZENDO logistics.',
    icon: 'delivered'
  }
];

// Step order used to compute progress (active / completed) in the tracker.
export const RFQ_PIPELINE_ORDER: SourcingStatus[] = RFQ_PIPELINE.map((m) => m.status);

/**
 * Generate a unique RFQ number (ZND-RFQ-XXXXXX).
 * Used both client-side (for instant feedback) and server-side (the DB enforces uniqueness).
 */
export function generateRfqNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ZND-RFQ-${random}`;
}

/**
 * The customer-facing tracking code (SHK-XXXXXX). Distinct from the RFQ number
 * so the public Track page can accept either form.
 */
export function generateTrackingCode(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SHK-${random}`;
}

export function getMilestoneIndex(status: SourcingStatus | string): number {
  if (status === 'quality_check') return 3; // maps to "Production"
  if (status === 'paid') return 3; // paid sits inside "Production" phase
  const idx = RFQ_PIPELINE_ORDER.indexOf(status as SourcingStatus);
  return idx === -1 ? -1 : idx;
}
