"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Instagram, Info, TrendingUp, ArrowUpRight, ArrowDownRight, PlusCircle, DollarSign } from "lucide-react";

// Supabase Bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Para Formatı Fonksiyonu
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

  // Webhook Tetikleme Fonksiyonu
  const triggerWebhook = () => {
    alert("Webhook tetiklendi: Yeni influencer veritabanına ekleniyor...");
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

      // --- GERÇEKÇİLİK KATMANI ---
      // Pazarlık Çarpanı (0.8 - 1.2 arası)
      const negotiationFactor = 0.8 + Math.random() * 0.4;
      
      const shareOfVoice = totalNicheViews > 0 ? avgViews / totalNicheViews : 0;
      
      // Maliyet Hesabı
      const cost = (budget * shareOfVoice) * negotiationFactor;

      // Dönüşüm Oranı (Rastgelelik: %1.5 - %3.5)
      const randomConversionRate = 0.015 + (Math.random() * 0.020); 

      // Tahmini Kazanç
      const estimatedSales = Math.floor(avgViews * randomConversionRate);
      const earnings = estimatedSales * productPrice;

      // CPM (Cost Per Mille)
      const cpm = avgViews > 0 ? (cost / avgViews) * 1000 : 0;

      // RPM (Revenue Per Mille)
      const rpm = avgViews > 0 ? (earnings / avgViews) * 1000 : 0;

      // Net Kar
      const profit = earnings - cost;
      calculatedTotalProfit += profit;

      // ROI ÇARPANI (x1.5 formatı)
      let roiMultiplier = 0;
      if (cost > 0) {
        roiMultiplier = (earnings / cost).toFixed(1);
      }

      return {
        username: inf.username,
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
        
        {/* Üst Başlık */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <TrendingUp className="text-indigo-600"/> Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kampanya Simülasyonu ve ROI Analizi</p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
             {/* WEBHOOK BUTONU */}
             <button 
                onClick={triggerWebhook}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-500 px-4 py-2 rounded-lg hover:bg-slate-600 transition shadow-md"
              >
                <PlusCircle size={18} /> Influencer Ekle
              </button>

              {/* Formül Butonu */}
              <button 
                onClick={() => setShowFormula(!showFormula)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
              >
                <Info size={18} /> Mantık
              </button>
          </div>
        </header>

        {/* Formül Açıklaması (Popup) */}
        {showFormula && (
          <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg animate-in slide-in-from-top-2">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">Kullanılan Formüller</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">CPM (Cost Per Mille)</span>
                    <code>(Maliyet / İzlenme) * 1000</code>
                </div>
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">ROI Çarpanı</span>
                    <code>(Toplam Gelir / Toplam Maliyet)</code>
                </div>
                <div>
                    <span className="text-indigo-400 font-bold block mb-1">Net Kâr</span>
                    <code>Gelir - Maliyet</code>
                </div>
            </div>
          </div>
        )}

        {/* GİRDİ ALANLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Niche)</label>
                <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700">
                    <option value="Spor">Spor & Fitness</option>
                    <option value="Güzellik">Güzellik & Bakım</option>
                    <option value="Teknoloji">Teknoloji</option>
                    <option value="Yemek">Yemek & Gurme</option>
                </select>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kampanya Bütçesi</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-slate-800" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ürün Satış Fiyatı</label>
                <div className="flex items-center mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500">
                    <span className="text-slate-400 font-bold mr-2">$</span>
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} className="bg-transparent w-full outline-none font-bold text-green-700" />
                </div>
            </div>
        </div>

        {/* GRAFİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <ArrowUpRight className="text-green-500" size={20}/> Net Kâr Dağılımı
                </h4>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="username" hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Net Kâr" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <ArrowDownRight className="text-indigo-500" size={20}/> Bütçe Harcaması
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
                            paddingAngle={5}
                            fill="#8884d8"
                        >
                            {results.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899', '#3b82f6'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
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
                            <td className="p-5 text-sm font-semibold text-slate-600">
                                {formatCurrency(row.cost)}
                            </td>
                            <td className="p-5 text-sm font-medium text-slate-500">
                                ${row.cpm}
                            </td>
                            <td className="p-5 text-sm font-semibold text-slate-600">
                                {formatCurrency(row.earnings)}
                            </td>
                            <td className="p-5">
                                <span className={`text-sm font-bold ${row.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {row.isPositive ? '+' : ''}{formatCurrency(row.profit)}
                                </span>
                            </td>
                            <td className="p-5">
                                {/* DÜZELTİLEN KISIM BURASI (Tek satıra indirildi) */}
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