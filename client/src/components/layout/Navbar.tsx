import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, Rocket, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMenus();
  };
  
  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];
  
  const dashboardLinks = [
    { name: 'Dashboard', path: '/dashboard/home', icon: <BarChart2 size={20} /> },
    { name: 'Campaigns', path: '/dashboard/campaigns', icon: <Rocket size={20} /> },
    { name: 'Ad Creator', path: '/ad-creator', icon: <Settings size={20} /> },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMenus}>
              <Logo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center text-base font-medium ${
                      location.pathname === link.path
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                
                <div className="relative">
                  <button
                    className="flex items-center text-gray-700 hover:text-primary-600"
                    onClick={toggleProfileMenu}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={closeMenus}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className="text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="secondary">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign up</Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-2 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 mb-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center py-2 px-3 rounded-md ${
                      location.pathname === link.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={closeMenus}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                
                <Link
                  to="/profile"
                  className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={closeMenus}
                >
                  <User size={20} className="mr-3" />
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 px-3 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={closeMenus}
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="flex flex-col space-y-2 mt-4 px-3">
                  <Link to="/login" onClick={closeMenus}>
                    <Button variant="secondary" fullWidth>
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenus}>
                    <Button variant="primary" fullWidth>
                      Sign up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};