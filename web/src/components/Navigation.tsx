import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              💰 UangQu
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/transactions')}`}
              >
                Transactions
              </Link>
              <Link
                to="/categories"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/categories')}`}
              >
                Categories
              </Link>
              <Link
                to="/limits"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/limits')}`}
              >
                Limits
              </Link>
              <Link
                to="/targets"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/targets')}`}
              >
                Targets
              </Link>
              <Link
                to="/export"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/export')}`}
              >
                Export
              </Link>
              <Link
                to="/import"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/import')}`}
              >
                Import
              </Link>
              <Link
                to="/receipt-scan"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/receipt-scan')}`}
              >
                📸 Scan Receipt
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/settings')}`}
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

