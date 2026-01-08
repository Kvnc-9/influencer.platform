import Link from "next/link";
import { CheckCircle, ArrowRight, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    // bg-white ve text-gray-900 ile maksimum kontrast sağladık
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
           <TrendingUp className="text-indigo-600"/> ROI Master
        </div>
        <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2.5 text-gray-700 font-bold hover:text-indigo-600 transition">Giriş Yap</Link>
            <Link href="/login" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">Ücretsiz Dene</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-sm font-bold mb-6 border border-indigo-100">
            ✨ Yapay Zeka Destekli Bütçe Yönetimi
        </div>
        
        {/* Başlık Rengi Simsiyah (Gray-900) yapıldı */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Influencer Pazarlamasında <br/>
          <span className="text-indigo-600">Paranızı Çöpe Atmayın.</span>
        </h1>
        
        {/* Açıklama yazısı daha koyu gri yapıldı */}
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Reklam bütçenizi en yüksek dönüşüm getirecek influencerlara otomatik dağıtın. 
          ROI, CPM ve RPM değerlerini şeffaf bir şekilde görün.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition shadow-xl flex items-center justify-center gap-2">
                Hemen Başla <ArrowRight size={20}/>
            </Link>
        </div>

        {/* Güvenilirlik Logoları (Daha belirgin) */}
        <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Şu Markalar Tarafından Kullanılıyor</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition duration-300">
                <span className="font-bold text-xl text-gray-800">TechMedia</span>
                <span className="font-bold text-xl text-gray-800">GlowCosmetics</span>
                <span className="font-bold text-xl text-gray-800">FitLife</span>
                <span className="font-bold text-xl text-gray-800">FoodieApp</span>
            </div>
        </div>
      </header>

      {/* Özellikler - Arkaplan hafif gri yapıldı */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {title: "Şeffaf Hesaplama", desc: "Gizli formüller yok. Tüm CPM ve ROI hesaplarını açıkça görün."},
                {title: "Gerçek Veri Tabanı", desc: "Anlık güncellenen influencer verileriyle doğru analiz yapın."},
                {title: "Akıllı Dağıtım", desc: "Bütçenizi rastgele değil, performansa dayalı dağıtın."}
            ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                        <CheckCircle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}