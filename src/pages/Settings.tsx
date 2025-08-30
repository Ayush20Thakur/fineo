import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Database, 
  Smartphone,
  Mail,
  Globe,
  Lock,
  Download,
  Upload,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { profile, updateProfile, password, updatePassword } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail && typeof e.detail.collapsed === 'boolean') {
        setSidebarCollapsed(e.detail.collapsed);
      }
    };
    window.addEventListener('sidebar-collapsed' as any, handler as any);
    return () => window.removeEventListener('sidebar-collapsed' as any, handler as any);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-[margin] duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="glass rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">Manage your account preferences and security settings</p>
            </div>
            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
              <Button variant="outline" className="px-6">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="premium" className="px-6">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Card className="glass border-0">
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 glass border-0">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Data</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 gradient-premium rounded-full flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supported formats: SVG, JPG, PNG (5MB each)
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+91 9876543210" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio Description</Label>
                        <textarea 
                          id="bio"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tell us about yourself..."
                          defaultValue="Financial enthusiast focused on long-term wealth building and smart investment strategies."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Finance Street" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="Mumbai" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="Maharashtra" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input id="pincode" defaultValue="400001" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue="India" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" defaultValue="ABCDE1234F" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aadhar">Aadhar Number</Label>
                        <Input id="aadhar" defaultValue="**** **** 1234" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lock className="w-5 h-5 mr-2" />
                        Password & Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="••••••••" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                      </div>

                      <Button className="w-full">Update Password</Button>

                      <div className="border-t pt-4 space-y-4">
                        <h4 className="font-semibold">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Authentication</p>
                            <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">App Authenticator</p>
                            <p className="text-sm text-muted-foreground">Use authenticator app</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Security Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { action: "Login", location: "Mumbai, India", time: "2 hours ago", device: "Chrome on macOS" },
                        { action: "Password Changed", location: "Mumbai, India", time: "2 days ago", device: "Mobile App" },
                        { action: "Login", location: "Delhi, India", time: "1 week ago", device: "Safari on iPhone" }
                      ].map((activity, index) => (
                        <div key={index} className="glass rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.device}</p>
                          <p className="text-sm text-muted-foreground">{activity.location}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Email Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: "Portfolio Updates", description: "Daily portfolio performance summary", enabled: true },
                        { title: "Market News", description: "Important market alerts and news", enabled: true },
                        { title: "EMI Reminders", description: "Upcoming EMI payment reminders", enabled: true },
                        { title: "Goal Milestones", description: "When you reach savings goals", enabled: false },
                        { title: "Security Alerts", description: "Login and security notifications", enabled: true }
                      ].map((notification, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          <Switch defaultChecked={notification.enabled} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Push Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: "Transaction Alerts", description: "Instant payment notifications", enabled: true },
                        { title: "Price Alerts", description: "Stock and crypto price changes", enabled: false },
                        { title: "Budget Alerts", description: "When you exceed budget limits", enabled: true },
                        { title: "Bill Reminders", description: "Upcoming bill payment alerts", enabled: true },
                        { title: "Investment Tips", description: "Weekly investment suggestions", enabled: false }
                      ].map((notification, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          <Switch defaultChecked={notification.enabled} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="glass rounded-xl p-6 bg-gradient-to-r from-premium/10 to-premium/5">
                        <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                        <p className="text-3xl font-bold mb-4">₹999<span className="text-base font-normal">/month</span></p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Unlimited portfolio tracking</li>
                          <li>✓ Advanced AI insights</li>
                          <li>✓ Real-time market data</li>
                          <li>✓ Premium customer support</li>
                          <li>✓ Tax optimization tools</li>
                        </ul>
                        <Button variant="outline" className="w-full mt-4">
                          Change Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-6 gradient-premium rounded"></div>
                            <div>
                              <p className="font-medium">•••• •••• •••• 1234</p>
                              <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">Primary</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        + Add Payment Method
                      </Button>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Billing History</h4>
                        <div className="space-y-2">
                          {[
                            { date: "Jan 15, 2025", amount: "₹999", status: "Paid" },
                            { date: "Dec 15, 2024", amount: "₹999", status: "Paid" },
                            { date: "Nov 15, 2024", amount: "₹999", status: "Paid" }
                          ].map((bill, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{bill.date}</span>
                              <div className="flex items-center space-x-2">
                                <span>{bill.amount}</span>
                                <span className="text-success">{bill.status}</span>
                                <Button variant="ghost" size="sm">Download</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Data Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="glass rounded-xl p-4">
                          <h4 className="font-semibold mb-2">Export Data</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Download all your financial data in CSV format
                          </p>
                          <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Export Portfolio Data
                          </Button>
                        </div>

                        <div className="glass rounded-xl p-4">
                          <h4 className="font-semibold mb-2">Import Data</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Import transactions from bank statements
                          </p>
                          <Button variant="outline" className="w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Transactions
                          </Button>
                        </div>

                        <div className="glass rounded-xl p-4 bg-gradient-to-r from-destructive/10 to-destructive/5">
                          <h4 className="font-semibold mb-2 text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Permanently delete your account and all data
                          </p>
                          <Button variant="destructive" className="w-full">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Analytics</p>
                          <p className="text-sm text-muted-foreground">Help improve our services</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Communications</p>
                          <p className="text-sm text-muted-foreground">Receive product updates</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Third-party Integrations</p>
                          <p className="text-sm text-muted-foreground">Allow data sharing with partners</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Connected Services</h4>
                        <div className="space-y-3">
                          {[
                            { name: "Bank of India", status: "Connected", lastSync: "2 hours ago" },
                            { name: "Zerodha", status: "Connected", lastSync: "1 day ago" },
                            { name: "Paytm", status: "Disconnected", lastSync: "Never" }
                          ].map((service, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-muted-foreground">Last sync: {service.lastSync}</p>
                              </div>
                              <Button 
                                variant={service.status === 'Connected' ? 'destructive' : 'outline'} 
                                size="sm"
                              >
                                {service.status === 'Connected' ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Appearance & Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-semibold">Theme</Label>
                          <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                          <div className="flex items-center justify-between">
                            <span>Dark/Light Mode</span>
                            <ThemeToggle />
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-semibold">Currency</Label>
                          <p className="text-sm text-muted-foreground mb-3">Select your primary currency</p>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-base font-semibold">Language</Label>
                          <p className="text-sm text-muted-foreground mb-3">Choose your preferred language</p>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="bn">Bengali</option>
                            <option value="ta">Tamil</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-semibold">Dashboard Layout</Label>
                          <p className="text-sm text-muted-foreground mb-3">Customize your dashboard view</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="glass rounded-xl p-3 border-2 border-primary cursor-pointer">
                              <div className="space-y-1">
                                <div className="h-2 bg-primary rounded"></div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="h-4 bg-muted rounded"></div>
                                  <div className="h-4 bg-muted rounded"></div>
                                </div>
                              </div>
                              <p className="text-xs text-center mt-2">Compact</p>
                            </div>
                            <div className="glass rounded-xl p-3 cursor-pointer">
                              <div className="space-y-1">
                                <div className="h-2 bg-muted rounded"></div>
                                <div className="h-6 bg-muted rounded"></div>
                                <div className="h-6 bg-muted rounded"></div>
                              </div>
                              <p className="text-xs text-center mt-2">Spacious</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-semibold">Number Format</Label>
                          <p className="text-sm text-muted-foreground mb-3">How numbers are displayed</p>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="indian" name="numberFormat" defaultChecked />
                              <Label htmlFor="indian">Indian (1,23,45,678)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="international" name="numberFormat" />
                              <Label htmlFor="international">International (1,234,567)</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;