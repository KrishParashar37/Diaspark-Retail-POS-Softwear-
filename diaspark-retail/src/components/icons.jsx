import React from 'react'

const s = { fill: 'none', stroke: '#333', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }

export const SalesIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M6 8h4l5 22h18l4-14H13"/>
    <circle cx="20" cy="36" r="2.5"/>
    <circle cx="33" cy="36" r="2.5"/>
  </svg>
)

export const WishlistIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M6 8h4l5 22h18l4-14H13"/>
    <circle cx="20" cy="36" r="2.5"/>
    <circle cx="33" cy="36" r="2.5"/>
    <path d="M28 14l2 2 4-4" strokeWidth="2"/>
  </svg>
)

export const ReturnExchangeIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <polyline points="10,20 6,14 12,14"/>
    <path d="M6 14a16 16 0 1 1 0 20"/>
    <polyline points="22,16 26,20 22,24"/>
  </svg>
)

export const TradeInIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <polyline points="8,28 14,22 20,28"/>
    <polyline points="40,20 34,26 28,20"/>
    <path d="M14 22v8a6 6 0 006 6h4"/>
    <path d="M34 26v-8a6 6 0 00-6-6h-4"/>
  </svg>
)

export const VoidTransactionsIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="24" cy="24" r="16"/>
    <line x1="14" y1="14" x2="34" y2="34"/>
    <path d="M18 30h8a4 4 0 000-8h-4a4 4 0 010-8h8"/>
  </svg>
)

export const SpecialOrderIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M14 6h20l6 8v28H8V14z"/>
    <polyline points="14,6 14,14 34,14 34,6"/>
    <line x1="16" y1="22" x2="32" y2="22"/>
    <line x1="16" y1="28" x2="32" y2="28"/>
    <line x1="16" y1="34" x2="24" y2="34"/>
  </svg>
)

export const RepairIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <polygon points="24,6 28,18 40,18 30,26 34,38 24,30 14,38 18,26 8,18 20,18"/>
  </svg>
)

export const CustomOrderIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M24 8 C16 8 10 14 10 22 C10 30 16 36 24 36 C32 36 38 30 38 22 C38 14 32 8 24 8Z"/>
    <path d="M24 14 C20 14 17 17 17 21 C17 25 20 28 24 28 C28 28 31 25 31 21 C31 17 28 14 24 14Z"/>
    <line x1="24" y1="36" x2="24" y2="42"/>
    <line x1="18" y1="42" x2="30" y2="42"/>
  </svg>
)

export const QuickRepairIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M24 8 C16 8 10 14 10 22 C10 30 16 36 24 36 C32 36 38 30 38 22 C38 14 32 8 24 8Z"/>
    <path d="M24 14 C20 14 17 17 17 21 C17 25 20 28 24 28 C28 28 31 25 31 21 C31 17 28 14 24 14Z"/>
    <line x1="24" y1="36" x2="24" y2="42"/>
    <line x1="18" y1="42" x2="30" y2="42"/>
    <polyline points="20,21 23,24 28,18" strokeWidth="2"/>
  </svg>
)

export const CancelOrderIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M14 6h20l6 8v28H8V14z"/>
    <polyline points="14,6 14,14 34,14 34,6"/>
    <line x1="18" y1="24" x2="30" y2="36"/>
    <line x1="30" y1="24" x2="18" y2="36"/>
  </svg>
)

export const LayawayOrderIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <g fill="white">
      <rect x="16" y="8" width="20" height="28" transform="rotate(-15 26 22)" stroke="#555" strokeWidth="2" />
      <rect x="12" y="8" width="20" height="28" transform="rotate(10 22 22)" stroke="#555" strokeWidth="2" />
      <rect x="14" y="12" width="22" height="28" stroke="#555" strokeWidth="2" />
    </g>
    <text x="25" y="20" fontSize="7" textAnchor="middle" fill="#555" stroke="none" fontWeight="bold" fontFamily="monospace">$$$$$</text>
    <polygon points="20,25 30,25 25,31" />
    <polygon points="20,25 22,22 28,22 30,25" />
    <line x1="18" y1="34" x2="24" y2="34" />
    <line x1="18" y1="36" x2="22" y2="36" />
  </svg>
)

export const TrackingIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <polyline points="10,26 18,22 30,26 38,22 38,34 30,38 18,34 10,38 10,26" strokeLinejoin="round" />
    <line x1="18" y1="22" x2="18" y2="34" />
    <line x1="30" y1="26" x2="30" y2="38" />
    <path d="M24,4 C18,4 14,8 14,14 C14,22 24,32 24,32 C24,32 34,22 34,14 C34,8 30,4 24,4 Z" fill="white" />
    <circle cx="24" cy="14" r="4" />
  </svg>
)

export const PaymentOpenIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="12" width="36" height="24" rx="3"/>
    <line x1="6" y1="20" x2="42" y2="20"/>
    <rect x="10" y="26" width="8" height="4" rx="1"/>
  </svg>
)

export const PaymentOnAccountIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="12" width="36" height="24" rx="3"/>
    <line x1="6" y1="20" x2="42" y2="20"/>
    <line x1="10" y1="28" x2="22" y2="28"/>
    <line x1="10" y1="32" x2="18" y2="32"/>
  </svg>
)

export const FinalizeSaleIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="24" cy="24" r="18"/>
    <polyline points="14,24 21,31 34,17" strokeWidth="2.5"/>
  </svg>
)

export const AppraisalIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="22" cy="22" r="12"/>
    <line x1="31" y1="31" x2="42" y2="42"/>
    <line x1="18" y1="22" x2="26" y2="22"/>
    <line x1="22" y1="18" x2="22" y2="26"/>
  </svg>
)

export const TransferIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="12" width="36" height="24" rx="3"/>
    <line x1="6" y1="20" x2="42" y2="20"/>
    <polyline points="18,28 24,24 30,28"/>
  </svg>
)

export const GiftCertificateIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="16" width="36" height="26" rx="2"/>
    <line x1="6" y1="26" x2="42" y2="26"/>
    <line x1="24" y1="16" x2="24" y2="42"/>
    <path d="M24 16 C24 16 18 10 14 14 C10 18 16 20 24 16Z"/>
    <path d="M24 16 C24 16 30 10 34 14 C38 18 32 20 24 16Z"/>
  </svg>
)

export const MercurySettingIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="24" cy="24" r="4"/>
    <path d="M24 8v4M24 36v4M8 24h4M36 24h4M12.7 12.7l2.8 2.8M32.5 32.5l2.8 2.8M12.7 35.3l2.8-2.8M32.5 15.5l2.8-2.8"/>
    <circle cx="24" cy="24" r="10"/>
  </svg>
)

export const GiftCardIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="14" width="36" height="24" rx="3"/>
    <line x1="6" y1="22" x2="42" y2="22"/>
    <line x1="14" y1="30" x2="22" y2="30"/>
    <circle cx="32" cy="30" r="3"/>
  </svg>
)

export const EndOfDayIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="12" width="36" height="24" rx="3"/>
    <line x1="6" y1="20" x2="42" y2="20"/>
    <line x1="14" y1="28" x2="34" y2="28"/>
    <line x1="14" y1="33" x2="26" y2="33"/>
  </svg>
)

export const PriceAvailabilityIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="12" width="36" height="24" rx="3"/>
    <line x1="6" y1="20" x2="42" y2="20"/>
    <line x1="14" y1="28" x2="20" y2="28"/>
    <line x1="14" y1="33" x2="20" y2="33"/>
    <line x1="26" y1="28" x2="34" y2="28"/>
    <line x1="26" y1="33" x2="34" y2="33"/>
  </svg>
)

export const ReprintTransactionIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="10" y="6" width="28" height="18" rx="1"/>
    <rect x="6" y="18" width="36" height="18" rx="2"/>
    <rect x="14" y="30" width="20" height="10" rx="1"/>
    <circle cx="34" cy="25" r="2" fill="#333" stroke="none"/>
  </svg>
)

export const InventoryInfoIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="6" y="30" width="10" height="12"/>
    <rect x="19" y="20" width="10" height="22"/>
    <rect x="32" y="10" width="10" height="32"/>
  </svg>
)

export const CustomerInfoIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="24" cy="16" r="8"/>
    <path d="M8 42v-2a14 14 0 0128 0v2"/>
    <line x1="30" y1="10" x2="38" y2="6"/>
    <line x1="38" y1="6" x2="38" y2="14"/>
  </svg>
)

export const ReportsIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <rect x="8" y="6" width="32" height="36" rx="2"/>
    <line x1="14" y1="16" x2="34" y2="16"/>
    <line x1="14" y1="22" x2="34" y2="22"/>
    <line x1="14" y1="28" x2="26" y2="28"/>
    <polyline points="26,32 30,26 34,30 38,22"/>
  </svg>
)

export const EodReportIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <circle cx="22" cy="22" r="12"/>
    <line x1="31" y1="31" x2="42" y2="42"/>
    <line x1="18" y1="22" x2="26" y2="22"/>
    <line x1="22" y1="18" x2="22" y2="26"/>
  </svg>
)

export const PrintTagIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" {...s}>
    <path d="M28 6H16a2 2 0 00-2 2v8H10a2 2 0 00-2 2v16a2 2 0 002 2h4v4a2 2 0 002 2h16a2 2 0 002-2v-4h4a2 2 0 002-2V18a2 2 0 00-2-2h-4V8a2 2 0 00-2-2z"/>
    <line x1="18" y1="34" x2="30" y2="34"/>
    <line x1="18" y1="38" x2="26" y2="38"/>
    <circle cx="36" cy="22" r="2" fill="#333" stroke="none"/>
  </svg>
)
