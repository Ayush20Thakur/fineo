import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  PieChart, 
  Lightbulb, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/personal" },
  { icon: PieChart, label: "Portfolio", path: "/portfolio" },
  { icon: Lightbulb, label: "Insights", path: "/insights" },
  { icon: CreditCard, label: "Loans", path: "/loans" },
  { icon: Calculator, label: "Financial Analysis", path: "/financial-analysis" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const { profile } = useUser();

  // Listen for header toggle on mobile
  useEffect(() => {
    const handler = () => setIsOpen((v) => !v);
    window.addEventListener('toggle-sidebar' as any, handler as any);
    return () => window.removeEventListener('toggle-sidebar' as any, handler as any);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}
      <div className={`${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64 h-screen bg-card border-r border-border/50 transition-smooth flex flex-col fixed left-0 top-0 z-50 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-border/50`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2'}`}>
              <img src="/logo.jpg" alt="FINEO logo" className={`${isCollapsed ? 'h-7 w-7' : 'h-8 w-8'} rounded-lg object-cover mx-auto`} />
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text">FINEO</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.innerWidth < 768) {
                  // On mobile, the header arrow should close the drawer instead of collapsing
                  setIsOpen(false);
                } else {
                  const next = !isCollapsed;
                  setIsCollapsed(next);
                  // Notify layout to adjust margins when collapsed/expanded
                  window.dispatchEvent(new CustomEvent('sidebar-collapsed', { detail: { collapsed: next } }));
                }
              }}
              className="h-8 w-8 p-0"
              aria-label={isOpen ? 'Close sidebar' : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/20 text-primary shadow-glow' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`
              }
              onClick={handleNavClick}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-3">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center">
              <span className="text-xs font-semibold text-white">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Premium Plan</p>
              </div>
            )}
          </div>
          {/* Actions */}
          {!isCollapsed && (
            <div className="grid grid-cols-1 gap-2">
              <Link to="/" onClick={handleNavClick}>
                <Button variant="outline" className="w-full justify-center">
                  Back to Home
                </Button>
              </Link>
              <Link to="/login" onClick={handleNavClick}>
                <Button variant="ghost" className="w-full justify-center text-destructive hover:text-destructive">
                  Logout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}