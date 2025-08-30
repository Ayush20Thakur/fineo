import { Calendar, Search, Home, ArrowLeft, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../ThemeToggle";
import { NotificationCenter } from "./NotificationCenter";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export function Header() {
  const location = useLocation();
  const isSubPage = !['/personal', '/dashboard'].includes(location.pathname);
  const [dateRange, setDateRange] = useState("Last 30 days");
  const { profile } = useUser();
  
  const handleDateRangeChange = () => {
    const ranges = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 6 months", "Last year"];
    const currentIndex = ranges.indexOf(dateRange);
    const nextIndex = (currentIndex + 1) % ranges.length;
    setDateRange(ranges[nextIndex]);
  };
  
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm mb-4 md:mb-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile hamburger for sidebar */}
          <button
            type="button"
            aria-label="Open sidebar"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted/60 transition-smooth"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          >
            <Menu className="h-5 w-5" />
          </button>
          {isSubPage && (
            <Link to="/personal">
              <Button variant="ghost" size="sm" className="hover:scale-110 transform transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/" className="hover:scale-105 transform transition-all hidden sm:inline-flex">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="hidden sm:block text-sm text-muted-foreground">Welcome back, {profile.firstName || 'User'}</p>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions, investments..."
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:inline-flex">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm hover-scale transition-smooth" 
              onClick={handleDateRangeChange}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange}
              <ChevronDown className="h-3 w-3 ml-2" />
            </Button>
          </div>
          <ThemeToggle />
          <div className="hidden sm:inline-flex">
            <NotificationCenter />
          </div>
          
          {/* Quick stats */}
          <div className="hidden lg:flex space-x-6 pl-6 border-l border-border/50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p className="text-lg font-semibold">₹12.4L</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Credit Score</p>
              <p className="text-lg font-semibold text-success">785</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tools row: search, filters, notifications, quick stats */}
      <div className="md:hidden px-4 pt-3 pb-4 space-y-3 border-t border-border/40">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, investments..."
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>

        {/* Filters + actions */}
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs hover-scale transition-smooth"
            onClick={handleDateRangeChange}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Use real NotificationCenter so it's clickable on mobile */}
            <NotificationCenter />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/50 p-2">
            <p className="text-[11px] text-muted-foreground">Net Worth</p>
            <p className="text-base font-semibold">₹12.4L</p>
          </div>
          <div className="rounded-lg border border-border/50 p-2">
            <p className="text-[11px] text-muted-foreground">Credit Score</p>
            <p className="text-base font-semibold text-success">785</p>
          </div>
        </div>
      </div>
    </header>
  );
}