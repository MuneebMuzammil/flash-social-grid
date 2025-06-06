
import React from 'react';
import { Home, Search, User, MessageSquare, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-instagram-gradient rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <Link to="/">
              <h1 className="text-xl font-bold bg-instagram-gradient bg-clip-text text-transparent">
                SocialApp
              </h1>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-instagram-purple transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={() => navigate('/camera')}
              >
                <Camera className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={() => navigate('/profile')}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:scale-105 transition-transform"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around py-2 px-4">
          {[
            { icon: Home, label: 'Home', path: '/' },
            { icon: Search, label: 'Search', path: '/search' },
            { icon: Camera, label: 'Create', path: '/camera' },
            { icon: MessageSquare, label: 'Messages', path: '/messages' },
            { icon: User, label: 'Profile', path: '/profile' }
          ].map(({ icon: Icon, label, path }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-all ${
                location.pathname === path
                  ? 'text-instagram-purple scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-instagram-purple hover:scale-105'
              }`}
              onClick={() => handleNavigation(path)}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
