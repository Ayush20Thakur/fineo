import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp, Zap, Mail, Phone, MapPin, Github, Linkedin, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-premium rounded-full opacity-10 motion-safe:animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 gradient-growth rounded-full opacity-10 motion-safe:animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 gradient-risk rounded-full opacity-20 motion-safe:animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="glass rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-premium rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FINEO
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-smooth md:hover:scale-105 transform">Home</Link>
              <Link to="/login" className="text-foreground/80 hover:text-foreground transition-smooth md:hover:scale-105 transform">Personal</Link>
              <Link to="/login" className="text-foreground/80 hover:text-foreground transition-smooth md:hover:scale-105 transform">Business</Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground md:hover:scale-105 transform transition-all">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="premium" className="px-6 md:hover:scale-105 transform transition-all shadow-lg hover:shadow-glow">
                    Sign up
                  </Button>
                </Link>
              </div>
              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-secondary/60 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed z-30 top-4 left-4 right-4 rounded-2xl glass border border-border/50 transition-all duration-300 origin-top ${
          mobileOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-secondary/60 transition-smooth"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 py-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="nav-item">Home</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-item">Personal</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-item">Business</Link>
            <div className="h-px bg-border/60 my-2" />
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="premium" className="w-full">Sign up</Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* 3D Coins Animation */}
          <div className="relative mb-12 flex justify-center">
            <div className="relative">
              {/* Primary coin */}
              <div className="w-32 h-32 rounded-full gradient-premium shadow-glow motion-safe:animate-bounce flex items-center justify-center transform rotate-12">
                <span className="text-white text-2xl font-bold">₹</span>
              </div>
              
              {/* Secondary coins */}
              <div className="absolute -top-4 -left-8 w-24 h-24 rounded-full gradient-growth shadow-md motion-safe:animate-pulse flex items-center justify-center transform -rotate-12">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -bottom-2 -right-6 w-20 h-20 rounded-full gradient-risk shadow-md motion-safe:animate-pulse delay-500 flex items-center justify-center transform rotate-45">
                <Shield className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute top-8 right-12 w-16 h-16 rounded-full gradient-neutral shadow-sm motion-safe:animate-pulse delay-1000 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                A new era of
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent motion-safe:animate-pulse">
                wealth management
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              World's most advanced digital clinic to help you live longer, prevent disease, and feel your best
            </p>
          </div>

          <div className="flex justify-center">
            <Link to="/signup">
              <Button
                variant="premium"
                size="lg"
                className="px-12 py-6 text-lg font-semibold group md:hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-glow motion-safe:animate-pulse"
              >
                Go Financing
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Overview */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Feature Overview
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover powerful tools designed to revolutionize your financial experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-500 md:hover:scale-105 transform group border border-primary/20">

              <div className="w-16 h-16 gradient-growth rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Smart Investing</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                AI-powered portfolio management with real-time insights and automated rebalancing for optimal returns.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Real-time market analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Automated rebalancing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Risk assessment tools</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-500 md:hover:scale-105 transform group border border-primary/20">
              <div className="w-16 h-16 gradient-premium rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Secure Banking</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Bank-grade security with biometric authentication and blockchain verification for ultimate protection.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Biometric authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Blockchain verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>End-to-end encryption</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-500 md:hover:scale-105 transform group border border-primary/20">
              <div className="w-16 h-16 gradient-risk rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Instant Transfers</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Lightning-fast money transfers with zero fees and real-time notifications across all platforms.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Zero transaction fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Real-time notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Cross-platform sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & About Section */}
        <section id="contact" className="mt-32 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">Ready to transform your financial future?</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* About Us */}
            <div className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-500">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">About FINEO</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                FINEO is revolutionizing personal finance with AI-powered insights, blockchain security, and real-time market analysis. 
                Our platform empowers individuals to make smarter financial decisions and achieve their wealth management goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-success" />
                  <span>Bank-grade security with blockchain verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>AI-powered investment recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-success" />
                  <span>Real-time portfolio tracking and alerts</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-500">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Contact Us</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 md:hover:scale-105 transform transition-all">
                  <div className="w-10 h-10 gradient-premium rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@fineo.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 md:hover:scale-105 transform transition-all">
                  <div className="w-10 h-10 gradient-growth rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 md:hover:scale-105 transform transition-all">
                  <div className="w-10 h-10 gradient-risk rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">Mumbai, India</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/30">
                <Link to="/signup">
                  <Button variant="premium" className="w-full md:hover:scale-105 transform transition-all shadow-lg hover:shadow-glow">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-premium rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FINEO</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering financial freedom through intelligent technology and transparent blockchain solutions.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <Link to="/personal" className="block hover:text-foreground transition-smooth">Personal Dashboard</Link>
                <Link to="/portfolio" className="block hover:text-foreground transition-smooth">Portfolio Tracking</Link>
                <Link to="/insights" className="block hover:text-foreground transition-smooth">AI Insights</Link>
                <Link to="/loans" className="block hover:text-foreground transition-smooth">Loan Management</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <Link to="/about" className="block hover:text-foreground transition-smooth hover:scale-105 transform">About Us</Link>
                <Link to="/careers" className="block hover:text-foreground transition-smooth hover:scale-105 transform">Careers</Link>
                <Link to="/press" className="block hover:text-foreground transition-smooth hover:scale-105 transform">Press</Link>
                <Link to="/contact" className="block hover:text-foreground transition-smooth hover:scale-105 transform">Contact</Link>
              </div>
            </div>

            {/* Developer */}
            <div>
              <h4 className="font-semibold mb-4">Developer</h4>
              <div className="glass rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 gradient-premium rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">D</span>
                  </div>
                  <span className="text-sm font-medium">Dev Team</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:scale-110 transform transition-all">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:scale-110 transform transition-all">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:scale-110 transform transition-all">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Built with ❤️ in India</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 FINEO. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;