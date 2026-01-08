import Link from "next/link";
import { CheckCircle, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
           🚀 ROI Master
        </div>
        <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2.5 text-slate-600 hover:text-indigo-600 font-medium transition">Giriş Yap</Link>
            <Link href="/login" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Ücretsiz Dene</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Yapay Zeka Destekli Analiz
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
          Influencer Bütçenizi <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Şansa Bırakmayın.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Reklam bütçenizi en yüksek dönüşüm getirecek influencerlara otomatik dağıtın. 
          Şeffaf ROI, CPM ve RPM hesaplamalarıyla kârınızı maksimize edin.
        </p>
        <div className="flex justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 flex items-center gap-2">
                Hemen Hesapla <ArrowRight size={20}/>
            </Link>
        </div>
        
        {/* Social Proof */}
        <div className="mt-16 pt-10 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Sektör Liderleri Bize Güveniyor</p>
            <div className="flex justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                <span className="font-bold text-xl">TechMedia</span>
                <span className="font-bold text-xl">GlowCosmetics</span>
                <span className="font-bold text-xl">FitLife TR</span>
                <span className="font-bold text-xl">Chef's Table</span>
            </div>
        </div>
      </header>

      {/* Özellikler */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                {title: "Şeffaf Hesaplama", desc: "Gizli formüller yok. CPM, RPM ve ROI değerlerini açıkça görün."},
                {title: "Gerçek Veri Tabanı", desc: "Supabase altyapısı ile güncel influencer verilerine erişin."},
                {title: "Akıllı Dağıtım", desc: "Bütçenizi izlenme ve etkileşim oranlarına göre optimize edin."}
            ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                        <CheckCircle />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}