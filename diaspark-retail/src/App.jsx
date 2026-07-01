import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import SalesPage from './components/SalesPage'
import WishListPage from './components/WishListPage'
import OrderTrackingPage from './components/OrderTrackingPage'
import InventoryTransferPage from './components/InventoryTransferPage'
import MercurySettingPage from './components/MercurySettingPage'
import EndOfDayCloseoutPage from './components/EndOfDayCloseoutPage'
import PriceAvailabilityPage from './components/PriceAvailabilityPage'
import ReprintTransactionPage from './components/ReprintTransactionPage'
import InventoryInfoPage from './components/InventoryInfoPage'
import SettingPage from './components/SettingPage'
import ReportsPage from './components/ReportsPage'
import EodReportPage from './components/EodReportPage'
import PrintTagPage from './components/PrintTagPage'
import LoginPage from './components/LoginPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [salesOption, setSalesOption] = useState('Sales')

  const navigate = (page) => {
    // Map page keys to SalesPage dropdown options
    const salesPageOptions = {
      'sales':              'Sales',
      'return_exchange':    'Return/Exchange',
      'special_order':      'Special Order',
      'repair':             'Repair',
      'quick_repair':       'Quick Repair',
      'layaway':            'Layaway',
      'appraisal':          'Appraisal',
      'gift_certificate':   'Gift Certficate',
      'gift_card':          'Gift Card',
      'cancel_order':       'Cancel Order',
      'payment_open_orders':'Payment(Open Orders)',
      'payment_on_account': 'Payment On Account',
      'finalize_sale':      'Finalize Sale',
      'trade_in':           'Trade In',
      'void_transactions':  'Void Transactions',
      'customer_info':      'Customer Info',
      'custom_order':       'Custom Order',
      'wishlist':           'Wish List',
    }

    if (salesPageOptions[page]) {
      setSalesOption(salesPageOptions[page])
      setCurrentPage('sales')
    } else {
      setCurrentPage(page)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />
      case 'sales':
        return <SalesPage onNavigate={navigate} initialOption={salesOption} />
      case 'wishlist':
        return <WishListPage onNavigate={navigate} />
      case 'inventory_transfer':
        return <InventoryTransferPage onNavigate={navigate} />
      case 'tracking':
        return <OrderTrackingPage onNavigate={navigate} />
      case 'mercury_setting':
        return <MercurySettingPage onNavigate={navigate} />
      case 'end_of_day_closeout':
        return <EndOfDayCloseoutPage onNavigate={navigate} />
      case 'price_availability':
        return <PriceAvailabilityPage onNavigate={navigate} />
      case 'reprint_transaction':
        return <ReprintTransactionPage onNavigate={navigate} />
      case 'inventory_info':
        return <InventoryInfoPage onNavigate={navigate} />
      case 'reports':
        return <ReportsPage onNavigate={navigate} />
      case 'eod_report':
        return <EodReportPage onNavigate={navigate} />
      case 'print_tag':
        return <PrintTagPage onNavigate={navigate} />
      case 'setting':
        return <SettingPage onNavigate={navigate} />
      default:
        return <Dashboard onNavigate={navigate} />
    }
  }
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="app-container">
      {currentPage === 'dashboard' && <Header onNavigate={navigate} onLogout={() => setIsAuthenticated(false)} />}
      {renderPage()}
      <Footer />
    </div>
  )
}

export default App
