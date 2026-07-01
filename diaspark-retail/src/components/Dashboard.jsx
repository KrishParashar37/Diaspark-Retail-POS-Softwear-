import React from 'react'
import './Dashboard.css'
import {
  SalesIcon, WishlistIcon, ReturnExchangeIcon, TradeInIcon, VoidTransactionsIcon,
  SpecialOrderIcon, RepairIcon, CustomOrderIcon, QuickRepairIcon, CancelOrderIcon,
  LayawayOrderIcon, TrackingIcon,
  PaymentOpenIcon, PaymentOnAccountIcon, FinalizeSaleIcon,
  AppraisalIcon, TransferIcon, GiftCertificateIcon, MercurySettingIcon,
  GiftCardIcon, EndOfDayIcon, PriceAvailabilityIcon,
  ReprintTransactionIcon, InventoryInfoIcon, CustomerInfoIcon,
  ReportsIcon, EodReportIcon, PrintTagIcon
} from './icons'

/* 
  Layout from the screenshot (9 columns × 5 rows):

  Row 0 (category tabs): SALES(2col) | ORDER(2col) | PAYMENT(1col) | OTHER(2col) | REPORT/INFO(2col)

  Row 1: SALES | WISHLIST | SPECIAL ORDER | REPAIR    | PAYMENT(OPEN ORDERS) | Appraisal | TRANSFER | REPRINT TRANSACTION | INVENTORY INFO
  Row 2: RETURN/EXCHANGE | CUSTOM ORDER | QUICK REPAIR | PAYMENT ON ACCOUNT | GIFT CERTIFICATE | MERCURY SETTING | CUSTOMER INFO | REPORTS
  Row 3: TRADE IN | CANCEL ORDER | LAYAWAY ORDER | FINALIZE SALE | GIFT CARD | END OF DAY CLOSEOUT | EOD REPORT | PRINT TAG
  Row 4: VOID TRANSACTIONS | (empty) | TRACKING | (empty) | (empty) | PRICE AVAILABILITY | (empty) | (empty)
*/

const gridRows = [
  // Row 1
  [
    { icon: <SalesIcon />, label: 'SALES' },
    { icon: <WishlistIcon />, label: 'WISHLIST' },
    { icon: <SpecialOrderIcon />, label: 'SPECIAL\nORDER' },
    { icon: <RepairIcon />, label: 'REPAIR' },
    { icon: <PaymentOpenIcon />, label: 'PAYMENT(OPEN\nORDERS)' },
    { icon: <AppraisalIcon />, label: 'APPRAISAL' },
    { icon: <TransferIcon />, label: 'TRANSFER' },
    { icon: <ReprintTransactionIcon />, label: 'REPRINT\nTRANSACTION' },
    { icon: <InventoryInfoIcon />, label: 'INVENTORY\nINFO' },
  ],
  // Row 2
  [
    { icon: <ReturnExchangeIcon />, label: 'RETURN/\nEXCHANGE' },
    null,
    { icon: <CustomOrderIcon />, label: 'CUSTOM\nORDER' },
    { icon: <QuickRepairIcon />, label: 'QUICK\nREPAIR' },
    { icon: <PaymentOnAccountIcon />, label: 'PAYMENT ON\nACCOUNT' },
    { icon: <GiftCertificateIcon />, label: 'GIFT\nCERTIFICATE' },
    { icon: <MercurySettingIcon />, label: 'MERCURY\nSETTING' },
    { icon: <CustomerInfoIcon />, label: 'CUSTOMER\nINFO' },
    { icon: <ReportsIcon />, label: 'REPORTS' },
  ],
  // Row 3
  [
    { icon: <TradeInIcon />, label: 'TRADE IN' },
    null,
    { icon: <CancelOrderIcon />, label: 'CANCEL\nORDER' },
    { icon: <LayawayOrderIcon />, label: 'LAYAWAY\nORDER' },
    { icon: <FinalizeSaleIcon />, label: 'FINALIZE\nSALE' },
    { icon: <GiftCardIcon />, label: 'GIFT CARD' },
    { icon: <EndOfDayIcon />, label: 'END OF DAY\nCLOSEOUT' },
    { icon: <EodReportIcon />, label: 'EOD\nREPORT' },
    { icon: <PrintTagIcon />, label: 'PRINT TAG' },
  ],
  // Row 4
  [
    { icon: <VoidTransactionsIcon />, label: 'VOID\nTRANSACTIONS' },
    null,
    null,
    { icon: <TrackingIcon />, label: 'TRACKING' },
    null,
    null,
    { icon: <PriceAvailabilityIcon />, label: 'PRICE\nAVAILABILITY' },
    null,
    null,
  ],
]

function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard">
      {/* Category tab headers */}
      <div className="category-tabs">
        <div className="category-tab sales">SALES</div>
        <div className="category-tab order">ORDER</div>
        <div className="category-tab payment">PAYMENT</div>
        <div className="category-tab other">OTHER</div>
        <div className="category-tab report">REPORT/INFO</div>
      </div>

      {/* Flat button grid */}
      <div className="main-grid">
        {gridRows.map((row, rowIdx) =>
          row.map((item, colIdx) => {
            if (!item) {
              return <div key={`${rowIdx}-${colIdx}`} className="menu-btn-empty" />
            }
            
            const handleClick = () => {
              if (item.label === 'SALES' && onNavigate) {
                onNavigate('sales')
              } else if (item.label === 'WISHLIST' && onNavigate) {
                onNavigate('wishlist')
              } else if (item.label === 'RETURN/\nEXCHANGE' && onNavigate) {
                onNavigate('return_exchange')
              } else if (item.label === 'TRADE IN' && onNavigate) {
                onNavigate('trade_in')
              } else if (item.label === 'VOID\nTRANSACTIONS' && onNavigate) {
                onNavigate('void_transactions')
              } else if (item.label === 'SPECIAL\nORDER' && onNavigate) {
                onNavigate('special_order')
              } else if (item.label === 'REPAIR' && onNavigate) {
                onNavigate('repair')
              } else if (item.label === 'CUSTOM\nORDER' && onNavigate) {
                onNavigate('custom_order')
              } else if (item.label === 'QUICK\nREPAIR' && onNavigate) {
                onNavigate('quick_repair')
              } else if (item.label === 'CANCEL\nORDER' && onNavigate) {
                onNavigate('cancel_order')
              } else if (item.label === 'LAYAWAY\nORDER' && onNavigate) {
                onNavigate('layaway')
              } else if (item.label === 'TRACKING' && onNavigate) {
                onNavigate('tracking')
              } else if (item.label === 'PAYMENT(OPEN\nORDERS)' && onNavigate) {
                onNavigate('payment_open_orders')
              } else if (item.label === 'PAYMENT ON\nACCOUNT' && onNavigate) {
                onNavigate('payment_on_account')
              } else if (item.label === 'FINALIZE\nSALE' && onNavigate) {
                onNavigate('finalize_sale')
              } else if (item.label === 'APPRAISAL' && onNavigate) {
                onNavigate('appraisal')
              } else if (item.label === 'GIFT\nCERTIFICATE' && onNavigate) {
                onNavigate('gift_certificate')
              } else if (item.label === 'GIFT CARD' && onNavigate) {
                onNavigate('gift_card')
              } else if (item.label === 'TRANSFER' && onNavigate) {
                onNavigate('inventory_transfer')
              } else if (item.label === 'MERCURY\nSETTING' && onNavigate) {
                onNavigate('mercury_setting')
              } else if (item.label === 'END OF DAY\nCLOSEOUT' && onNavigate) {
                onNavigate('end_of_day_closeout')
              } else if (item.label === 'PRICE\nAVAILABILITY' && onNavigate) {
                onNavigate('price_availability')
              } else if (item.label === 'REPRINT\nTRANSACTION' && onNavigate) {
                onNavigate('reprint_transaction')
              } else if (item.label === 'INVENTORY\nINFO' && onNavigate) {
                onNavigate('inventory_info')
              } else if (item.label === 'CUSTOMER\nINFO' && onNavigate) {
                onNavigate('customer_info')
              } else if (item.label === 'REPORTS' && onNavigate) {
                onNavigate('reports')
              } else if (item.label === 'EOD\nREPORT' && onNavigate) {
                onNavigate('eod_report')
              } else if (item.label === 'PRINT TAG' && onNavigate) {
                onNavigate('print_tag')
              }
            }

            let categoryClass = '';
            if (colIdx === 0 || colIdx === 1) categoryClass = 'sales-btn';
            else if (colIdx === 2 || colIdx === 3) categoryClass = 'order-btn';
            else if (colIdx === 4) categoryClass = 'payment-btn';
            else if (colIdx === 5 || colIdx === 6) categoryClass = 'other-btn';
            else if (colIdx === 7 || colIdx === 8) categoryClass = 'report-btn';

            return (
              <button 
                key={`${rowIdx}-${colIdx}`} 
                className={`menu-btn ${categoryClass}`}
                onClick={handleClick}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-label">{item.label}</div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Dashboard
