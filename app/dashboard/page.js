"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Legend 
} from "recharts"; // Legend eklendi
import { Instagram, Info, TrendingUp, ArrowUpRight, ArrowDownRight, PlusCircle, Send, Users } from "lucide-react";

// Supabase Bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Para Formatı
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Dashboard() {
  const [niche, setNiche] = useState("Spor");
  const [budget, setBudget] = useState(10000); 
  const [productPrice, setProductPrice] = useState(50); 
  const [results, setResults] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  
  // Influencer Ekleme State'i
  const [newInfluencerName, setNewInfluencerName] = useState("");

  // WEBHOOK FONKSİYONU
  const triggerWebhook = async () => {
    if (!newInfluencerName.trim()) {
      alert("Lütfen bir influencer ismi yazın!");
      return;
    }

    try {
      // SENİN VERDİĞİN LİNK:
      const WEBHOOK_URL = "https://hook.eu1.make.com/ixxd5cuuqkhhkpd8sqn5soiyol0a952x"; 

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          influencer_name: newInfluencerName,
          niche: niche,
          request_date: new Date().toISOString()
        })
      });
      
      alert(`✅ Başarılı: ${newInfluencerName} sisteme gönderildi!`);
      setNewInfluencerName(""); // Kutuyu temizle
    } catch (error) {
      console.error("Webhook Hatası:", error);
      alert("Bir hata oluştu, konsolu kontrol edin.");
    }
  };

  const fetchInfluencers = async () => {
    setLoading(true);
    const { data } = await supabase.from("influencers").select("*").eq("niche", niche);
    
    if (data && data.length > 0) {
      calculateMetrics(data);
    } else {
      setResults([]);
      setTotalProfit(0);
    }
    setLoading(false);
  };

  const calculateMetrics = (data) => {
    const totalNicheViews = data.reduce((sum, inf) => sum + Number(inf.avg_views || 0), 0);
    let calculatedTotalProfit = 0;

    const calculatedData = data.map((inf) => {
      const avgViews = Number(inf.avg_views || 0);
      const negotiationFactor = 0.8 + Math.random() * 0.4;
      const shareOfVoice = totalNicheViews > 0 ? avgViews / totalNicheViews : 0;
      const cost = Math.floor((budget * shareOfVoice) * negotiationFactor);
      
      const randomConversionRate = 0.015 + (Math.random() * 0.020); 
      const estimatedSales = Math.floor(avgViews * randomConversionRate);
      const earnings = estimatedSales * productPrice;
      const cpm = avgViews > 0 ? (cost / avgViews) * 1000 : 0;
      const rpm = avgViews > 0 ? (earnings / avgViews) * 1000 : 0;
      const profit = earnings - cost;
      
      calculatedTotalProfit += profit;

      let roiMultiplier = 0;
      if (cost > 0) roiMultiplier = (earnings / cost).toFixed(1);

      return {
        username: inf.username, // Grafik için gerekli
        name: inf.username,     // Legend için gerekli
        avg_views: avgViews,
        cost: cost,
        earnings: earnings,
        profit: profit,
        roiMultiplier: roiMultiplier + "x", 
        isPositive: profit > 0,
        cpm: cpm.toFixed(2),
        rpm: rpm.toFixed(2),
        sales: estimatedSales
      };
    });

    setTotalProfit(calculatedTotalProfit);
    setResults(calculatedData.sort((a, b) => b.profit - a.profit));
  };

  useEffect(() => {
    fetchInfluencers();
  }, [niche, budget, productPrice]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: BAŞLIK + WEBHOOK ALANI */}
        <header className="flex flex-col xl:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <TrendingUp className="text-indigo-600"/> Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kampanya Simülasyonu ve ROI Analizi</p>
          </div>
          
          {/* --- BURASI SENİN İSTEDİĞİN GİRİŞ ALANI --- */}
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">
             
             {/* Influencer Ekleme Kutusu */}
             <div className="flex items-center bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 w-full sm:w-auto">
                <div className="bg-white flex items-center rounded-lg border border-slate-200 px-3 py-2 mr-2 shadow-sm w-full">
                    <span className="text-slate-400 mr-2">@</span>
                    <input 
                      type="text" 
                      placeholder="kullanici_adi" 
                      value={newInfluencerName}
                      onChange={(e) => setNewInfluencerName(e.target.value)}
                      className="bg-transparent outline-none text-slate-700 text-sm w-32 placeholder-slate-300 font-medium"
                    />
                </div>
                <button 
                  onClick={triggerWebhook}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-md whitespace-nowrap"
                >
                  <Send size={14} /> Ekle
                </button>
             </div>

              {/* Mantık Butonu */}
              <button 
                onClick={() => setShowFormula(!showFormula)}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition h-full border border-slate-200"
              >
                <Info size={18} /> Mantık
              </button>
          </div>
        </header>

        {/* Formül Popup */}
        {showFormula && (
          <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg animate-in slide-in-from-top-2">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">Hesaplama Mantığı</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div><code>CPM = (Maliyet / İzlenme) * 1000</code></div>
                <div><code>ROI = (Gelir / Maliyet)</code></div>
                <div><code>Kar = Gelir - Maliyet</code></div>
            </div>
          </div>
        )}

        {/* GİRDİLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
                <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">
                    <option value="Spor">Spor & Fitness</option>
                    <option value="Güzellik">Güzellik & Bakım</option>
                    <option value="Teknoloji">Teknoloji</option>
                    <option value="Yemek">Yemek & Gurme</option>
                </select>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Bütçe</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-slate-800" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase">Ürün Fiyatı</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-green-700" />
                </div>
            </div>
        </div>

        {/* --- GRAFİKLER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* 1. Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[500px]">
                <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <ArrowUpRight className="text-green-500" size={20}/> Net Kâr Analizi
                </h4>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="username" hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Net Kâr">
                            <LabelList dataKey="profit" position="top" formatter={(val) => `$${val.toLocaleString()}`} style={{ fill: '#059669', fontSize: '12px', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Pie Chart (GÜNCELLENDİ) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[500px]">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <ArrowDownRight className="text-indigo-500" size={20}/> Bütçe Dağılımı
                </h4>
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie 
                            data={results} 
                            dataKey="cost" 
                            nameKey="username" 
                            cx="50%" cy="50%" 
                            innerRadius={70} 
                            outerRadius={100} 
                            fill="#8884d8"
                            paddingAngle={5}
                            // LABEL AYARI: İsim ve Bütçeyi dışarıya yazar
                            label={({ name, value }) => `${name}: $${value}`}
                        >
                            {results.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#f59e0b'][index % 5]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        {/* LEGEND EKLENDİ: Renkleri ve isimleri aşağıda gösterir */}
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* DETAYLI TABLO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="p-5 font-bold">Influencer</th>
                        <th className="p-5 font-bold">Maliyet</th>
                        <th className="p-5 font-bold">CPM</th>
                        <th className="p-5 font-bold">Gelir</th>
                        <th className="p-5 font-bold">Net Kâr</th>
                        <th className="p-5 font-bold">ROI</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {results.map((row) => (
                        <tr key={row.username} className="hover:bg-indigo-50/30 transition duration-200">
                            <td className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] rounded-full">
                                        <div className="bg-white p-1 rounded-full">
                                            <Instagram size={16} className="text-slate-800"/> 
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-700 text-sm">@{row.username}</span>
                                        <span className="text-xs text-slate-400">{row.avg_views.toLocaleString()} izlenme</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5 text-sm font-semibold text-slate-600">{formatCurrency(row.cost)}</td>
                            <td className="p-5 text-sm font-medium text-slate-500">${row.cpm}</td>
                            <td className="p-5 text-sm font-semibold text-slate-600">{formatCurrency(row.earnings)}</td>
                            <td className="p-5">
                                <span className={`text-sm font-bold ${row.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {row.isPositive ? '+' : ''}{formatCurrency(row.profit)}
                                </span>
                            </td>
                            <td className="p-5">
                                <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${row.isPositive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {row.roiMultiplier}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* TOPLAM KAR KARTI */}
        <div className={`p-8 rounded-2xl text-center border-l-8 shadow-sm transition-all ${totalProfit >= 0 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <h2 className="text-xl font-semibold text-slate-600 mb-2">Kampanya Sonu Toplam Tahmini Net Kâr</h2>
            <p className={`text-5xl font-extrabold ${totalProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatCurrency(totalProfit)}
            </p>
        </div>

      </div>
    </div>
  );
}