import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, TrendingUp, Calculator, Shield, Brain, BarChart3, PieChart, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface Transaction {
  date: string;
  description: string;
  credit: number;
  debit: number;
  balance: number;
  category: string;
  ref?: string;
}

interface Summary {
  balance: number;
  inflow: number;
  outflow: number;
  savings_rate: number;
  cashflow: Array<{ date: string; amount: number }>;
  allocation: Array<{ category: string; amount: number; pct: number }>;
}

interface FairScoreFeatures {
  pay_hist: number;
  utilization: number;
  savings_rate: number;
  cashflow_var: number;
  history_len: number;
  sip_regularity: number;
  mandate_punctual: number;
  threshold_k: number;
}

interface FairScoreResult {
  score: number;
  contributions: Array<{ name: string; weight: number; value: number }>;
  version: string;
}

interface ForecastData {
  dates: string[];
  mean: number[];
  lower: number[];
  upper: number[];
}

interface AuditResult {
  spd: number;
  eo: number;
  threshold: number;
  tolerance: number;
  recommended_threshold: number;
  passed: boolean;
}

interface AdvisorResponse {
  answer: string;
  actions: string[];
  route: string;
}

const API_BASE = 'http://localhost:8000';
const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ff8042', '#00c49f'];

const FinancialAnalysis: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [fairScoreResult, setFairScoreResult] = useState<FairScoreResult | null>(null);
  const [features, setFeatures] = useState<FairScoreFeatures>({
    pay_hist: 0.7,
    utilization: 0.4,
    savings_rate: 0.2,
    cashflow_var: 0.3,
    history_len: 0.3,
    sip_regularity: 0.5,
    mandate_punctual: 0.7,
    threshold_k: 650
  });
  const [auditScores, setAuditScores] = useState({
    femaleScores: "[720, 680, 690, 710, 700]",
    maleScores: "[680, 720, 690, 700, 710]",
    threshold: 650,
    tolerance: 0.05
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [advisorQuestion, setAdvisorQuestion] = useState("How can I raise my savings rate to 20%?");
  const [advisorResponse, setAdvisorResponse] = useState<AdvisorResponse | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ healthy: boolean; granite_ready: boolean } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      setApiStatus({ healthy: data.status === 'healthy', granite_ready: !!data.granite_ready });
    } catch {
      setApiStatus({ healthy: false, granite_ready: false });
    }
  };

  const applyAnalysis = async (txns: Transaction[]) => {
    const resp = await fetch(`${API_BASE}/analyze-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: txns }),
    });
    if (!resp.ok) throw new Error('Failed to analyze transactions');
    const data = await resp.json();
    setSummary(data.summary);
    setFeatures((prev) => ({ ...prev, ...data.features }));
    if (data.summary?.cashflow?.length) await generateForecast(data.summary.cashflow);
  };

  const handleUseSample = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/sample-transactions`);
      if (!resp.ok) throw new Error('Failed to load sample data');
      const data = await resp.json();
      setTransactions(data.transactions);
      await applyAnalysis(data.transactions);
      toast({ title: 'Sample data loaded', description: `Parsed ${data.count} transactions` });
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
  };

  const processFile = async (file: File) => {
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'Invalid file type', description: 'Please select a PDF file', variant: 'destructive' });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select a file smaller than 10MB', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE}/upload-pdf`, { 
        method: 'POST', 
        body: formData 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.transactions || data.transactions.length === 0) {
        throw new Error('No transactions found in the PDF. Please check if the file contains valid passbook data.');
      }
      
      setTransactions(data.transactions);
      await applyAnalysis(data.transactions);
      toast({ 
        title: 'File uploaded successfully', 
        description: `Successfully parsed ${data.count} transactions from ${file.name}` 
      });
      
      // Clear the file input for future uploads
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Upload failed', 
        description: error instanceof Error ? error.message : 'Unknown error occurred', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const generateForecast = async (cashflow: Array<{ date: string; amount: number }>) => {
    const response = await fetch(`${API_BASE}/forecast-cashflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashflow_data: cashflow, days: 60 }),
    });
    if (!response.ok) throw new Error('Failed to generate forecast');
    const data = await response.json();
    setForecastData(data.forecast);
  };

  const handleCalculateFairScore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/calculate-fairscore`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(features),
      });
      if (!response.ok) throw new Error('Failed to calculate FairScore');
      const data = await response.json();
      setFairScoreResult(data);
      toast({ title: 'FairScore calculated', description: `Score: ${data.score} (v${data.version})` });
    } catch (e) {
      toast({ title: 'FairScore calculation failed', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const femaleScores = JSON.parse(auditScores.femaleScores);
      const maleScores = JSON.parse(auditScores.maleScores);
      const response = await fetch(`${API_BASE}/fairness-audit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          female_scores: femaleScores, male_scores: maleScores, threshold: auditScores.threshold, tolerance: auditScores.tolerance
        })
      });
      if (!response.ok) throw new Error('Failed to run audit');
      const data = await response.json();
      setAuditResult(data);
      toast({ title: 'Audit completed', description: `SPD: ${data.spd.toFixed(3)}, EO: ${data.eo.toFixed(3)}` });
    } catch (e) {
      toast({ title: 'Audit failed', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAudit = async () => {
    if (!auditResult) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/publish-audit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(auditResult)
      });
      if (!response.ok) throw new Error('Failed to publish audit');
      const data = await response.json();
      toast({ title: 'Audit published', description: `Block hash: ${String(data.block_hash).substring(0, 16)}...` });
    } catch (e) {
      toast({ title: 'Publish failed', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAskAdvisor = async () => {
    setLoading(true);
    try {
      const context = { kpis: { savings_rate: summary?.savings_rate || 0.2 }, hints: ["focus on EMI, SIP regularity, utilization"] };
      const response = await fetch(`${API_BASE}/ask-advisor`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: advisorQuestion, context })
      });
      if (!response.ok) throw new Error('Failed to get advisor response');
      const data = await response.json();
      setAdvisorResponse(data);
      toast({ title: 'Advisor response received', description: 'AI-powered financial advice generated' });
    } catch (e) {
      toast({ title: 'Advisor request failed', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Financial Analysis</h1>
          <p className="text-muted-foreground">Upload passbook → Insights → Forecast → FairScore → Audit → AI Advisor</p>
        </div>
      </div>

      {apiStatus && (
        <Alert className={apiStatus.healthy ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {apiStatus.healthy ? (<CheckCircle className="h-4 w-4 text-green-600" />) : (<XCircle className="h-4 w-4 text-red-600" />)}
          <AlertDescription>
            API Server: {apiStatus.healthy ? "Connected" : "Disconnected"} | IBM Granite: {apiStatus.granite_ready ? "Ready" : "Not Available"}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="fairscore">FairScore</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="advisor">Advisor</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Upload Passbook (PDF)</CardTitle>
              <CardDescription>Upload your bank passbook PDF or use sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileText className={`h-12 w-12 mx-auto mb-4 ${
                    dragActive ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <Input 
                        id="file-upload" 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        disabled={loading} 
                      />
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        disabled={loading}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {loading ? "Processing..." : "Choose PDF file"}
                      </Button>
                    </div>
                    <Button onClick={handleUseSample} variant="secondary" disabled={loading}>Use Sample Data</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {loading 
                      ? "Processing your PDF file..." 
                      : dragActive 
                        ? "Drop your PDF file here" 
                        : "Drag and drop a PDF file here, or click to browse"
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Supported format: PDF passbook files (max 10MB)</p>
                  {loading && (
                    <div className="mt-4">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                  )}
                </div>
                {transactions.length > 0 && (
                  <Alert><FileText className="h-4 w-4" /><AlertDescription>Successfully parsed {transactions.length} transactions</AlertDescription></Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          {summary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Balance</span></div><p className="text-2xl font-bold">₹{summary.balance.toLocaleString()}</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Inflow</span></div><p className="text-2xl font-bold">₹{summary.inflow.toLocaleString()}</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-red-600" /><span className="text-sm font-medium">Outflow</span></div><p className="text-2xl font-bold">₹{summary.outflow.toLocaleString()}</p></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium">Savings Rate</span></div><p className="text-2xl font-bold">{(summary.savings_rate * 100).toFixed(1)}%</p></CardContent></Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" />Category Allocation</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie data={summary.allocation} cx="50%" cy="50%" labelLine={false} label={({ category, pct }) => `${category} ${pct}%`} outerRadius={80} fill="#8884d8" dataKey="amount">
                          {summary.allocation.map((_, idx) => (<Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Daily Cashflow</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={summary.cashflow}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Recent Transactions</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {transactions.slice(0, 10).map((txn, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded border">
                        <div className="flex-1"><p className="text-sm font-medium">{txn.description}</p><div className="flex items-center gap-2 mt-1"><p className="text-xs text-muted-foreground">{txn.date}</p><Badge variant="secondary">{txn.category}</Badge></div></div>
                        <div className="text-right">{txn.credit > 0 && <p className="text-sm text-green-600 font-medium">+₹{txn.credit.toLocaleString()}</p>}{txn.debit > 0 && <p className="text-sm text-red-600 font-medium">-₹{txn.debit.toLocaleString()}</p>}<p className="text-xs text-muted-foreground">₹{txn.balance.toLocaleString()}</p></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert><FileText className="h-4 w-4" /><AlertDescription>Upload a passbook PDF or use sample data to view dashboard</AlertDescription></Alert>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Cashflow Forecast (60 days)</CardTitle><CardDescription>AI-powered cashflow prediction</CardDescription></CardHeader>
            <CardContent>
              {forecastData ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={forecastData.dates.map((date, i) => ({ date, mean: forecastData.mean[i], lower: forecastData.lower[i], upper: forecastData.upper[i] }))}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
                      <Area type="monotone" dataKey="upper" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="lower" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Line type="monotone" dataKey="mean" stroke="#82ca9d" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Alert><TrendingUp className="h-4 w-4" /><AlertDescription>Need cashflow history to generate forecast</AlertDescription></Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fairscore" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />FairScore Calculator</CardTitle><CardDescription>Explainable, gender-agnostic credit scoring</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div><Label>Payment History</Label><Slider value={[features.pay_hist]} onValueChange={([v]) => setFeatures(p => ({ ...p, pay_hist: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.pay_hist}</p></div>
                    <div><Label>Utilization / DTI</Label><Slider value={[features.utilization]} onValueChange={([v]) => setFeatures(p => ({ ...p, utilization: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.utilization}</p></div>
                    <div><Label>Savings Rate</Label><Slider value={[features.savings_rate]} onValueChange={([v]) => setFeatures(p => ({ ...p, savings_rate: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.savings_rate}</p></div>
                    <div><Label>Cashflow Variability</Label><Slider value={[features.cashflow_var]} onValueChange={([v]) => setFeatures(p => ({ ...p, cashflow_var: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.cashflow_var}</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><Label>History Length</Label><Slider value={[features.history_len]} onValueChange={([v]) => setFeatures(p => ({ ...p, history_len: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.history_len}</p></div>
                    <div><Label>SIP Regularity</Label><Slider value={[features.sip_regularity]} onValueChange={([v]) => setFeatures(p => ({ ...p, sip_regularity: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.sip_regularity}</p></div>
                    <div><Label>Mandate Punctuality</Label><Slider value={[features.mandate_punctual]} onValueChange={([v]) => setFeatures(p => ({ ...p, mandate_punctual: v }))} max={1} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{features.mandate_punctual}</p></div>
                    <div><Label>Decision Threshold</Label><Slider value={[features.threshold_k]} onValueChange={([v]) => setFeatures(p => ({ ...p, threshold_k: v }))} min={580} max={720} step={1} className="mt-2" /><p className="text-sm text-muted-foreground">{features.threshold_k}</p></div>
                  </div>
                </div>
                <Button onClick={handleCalculateFairScore} className="w-full" disabled={loading}>{loading ? 'Calculating...' : 'Compute FairScore'}</Button>
                {fairScoreResult && (
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50"><Shield className="h-4 w-4 text-green-600" /><AlertDescription><strong>FairScore = {fairScoreResult.score} (v{fairScoreResult.version})</strong></AlertDescription></Alert>
                    <div className="space-y-3">
                      <h4 className="font-medium">Score Breakdown:</h4>
                      {fairScoreResult.contributions.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded border"><span className="text-sm font-medium capitalize">{item.name.replace('_', ' ')}</span><div className="flex items-center gap-3"><Progress value={item.value * 100} className="w-24" /><span className="text-sm font-medium">{(item.weight * 100).toFixed(1)}%</span><span className="text-sm text-muted-foreground">({item.value.toFixed(2)})</span></div></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Fairness Audit</CardTitle><CardDescription>SPD and EO analysis</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Female Scores (JSON array)</Label><Textarea value={auditScores.femaleScores} onChange={(e) => setAuditScores(p => ({ ...p, femaleScores: e.target.value }))} placeholder="[720, 680, 690, 710, 700]" className="mt-2" rows={4} /></div>
                  <div><Label>Male Scores (JSON array)</Label><Textarea value={auditScores.maleScores} onChange={(e) => setAuditScores(p => ({ ...p, maleScores: e.target.value }))} placeholder="[680, 720, 690, 700, 710]" className="mt-2" rows={4} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Threshold k for approval</Label><Slider value={[auditScores.threshold]} onValueChange={([v]) => setAuditScores(p => ({ ...p, threshold: v }))} min={580} max={720} step={1} className="mt-2" /><p className="text-sm text-muted-foreground">{auditScores.threshold}</p></div>
                  <div><Label>Tolerance δ</Label><Slider value={[auditScores.tolerance]} onValueChange={([v]) => setAuditScores(p => ({ ...p, tolerance: v }))} max={0.2} step={0.01} className="mt-2" /><p className="text-sm text-muted-foreground">{auditScores.tolerance}</p></div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRunAudit} disabled={loading} className="flex-1">{loading ? 'Running...' : 'Run Audit'}</Button>
                  {auditResult && (<Button onClick={handlePublishAudit} disabled={loading} variant="outline">{loading ? 'Publishing...' : 'Publish to Ledger'}</Button>)}
                </div>
                {auditResult && (
                  <div className="space-y-4">
                    <Alert className={auditResult.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      {auditResult.passed ? (<CheckCircle className="h-4 w-4 text-green-600" />) : (<AlertTriangle className="h-4 w-4 text-red-600" />)}
                      <AlertDescription><strong>Audit {auditResult.passed ? 'PASSED' : 'FAILED'}</strong><br />SPD: {auditResult.spd.toFixed(4)} | EO: {auditResult.eo.toFixed(4)} | Recommended Threshold: {auditResult.recommended_threshold}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisor" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" />AI Financial Advisor</CardTitle><CardDescription>Powered by IBM Granite</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><Label>Ask a question</Label><Input value={advisorQuestion} onChange={(e) => setAdvisorQuestion(e.target.value)} placeholder="How can I raise my savings rate to 20%?" className="mt-2" /></div>
                <Button onClick={handleAskAdvisor} className="w-full" disabled={loading}>{loading ? 'Asking Granite...' : 'Ask Granite'}</Button>
                {advisorResponse && (
                  <div className="space-y-4">
                    <Alert><Brain className="h-4 w-4" /><AlertDescription><strong>AI Response:</strong></AlertDescription></Alert>
                    <div className="p-4 bg-gray-50 rounded-lg"><div className="prose prose-sm max-w-none"><p className="whitespace-pre-wrap">{advisorResponse.answer}</p></div></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialAnalysis;
