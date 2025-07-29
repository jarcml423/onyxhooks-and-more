import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import onyxLogo from "@assets/ChatGPT Image Jul 1, 2025, 11_01_09 PM_1751431893117.png";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, LogOut, Settings, Users } from "lucide-react";

interface NavigationProps {
  onMenuClick?: () => void;
}

export default function Navigation({ onMenuClick }: NavigationProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <span className="text-xl font-bold" style={{
                    background: 'linear-gradient(90deg, #ffffff, #808080, #ffffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 15px rgba(128, 128, 128, 0.3)'
                  }}>
                    OnyxHooks & More™
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <Link href="/#features" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Features
                </Link>
                <a 
                  href="/#pricing" 
                  className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (location === '/') {
                      // If already on landing page, scroll to pricing
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // If on another page, navigate to landing with pricing anchor
                      window.location.href = '/#pricing';
                    }
                  }}
                >
                  Pricing
                </a>
                <Link href="/before-after" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Examples
                </Link>
                <Link href="/vault" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Vault
                </Link>
                <Link href="/email-templates" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Email Templates
                </Link>
                <Link href="/coaching-demo" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Live Coaching
                </Link>
                <Link href="/navigation" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    Navigation
                </Link>
                <Link href="/council" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Council
                </Link>
                <Link href="/faq" className="text-gray-300 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-purple">
                    FAQ
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-300 hover:bg-purple-900/20">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="shine-button text-white font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
