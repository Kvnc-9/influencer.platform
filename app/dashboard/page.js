// Global grafik değişkenleri (Tekrar çizim hatasını önlemek için dışarıda tanımladık)
let barChartInstance = null;
let pieChartInstance = null;

// Yardımcı Fonksiyon: Rastgele sayı üretici
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gri Buton Fonksiyonu (Webhook Tetikleme)
function triggerWebhook() {
    // Buraya Make.com veya backend webhook URL'ine fetch isteği atabilirsin
    console.log("Webhook tetiklendi...");
    alert("Webhook tetiklendi: Yeni influencer veritabanına ekleniyor...");
}

// Ana Analiz Fonksiyonu
function analyzeCampaign() {
    // HTML'den verileri çekiyoruz
    const nicheSelect = document.getElementById('niche');
    const budgetInput = document.getElementById('budget');
    const productPriceInput = document.getElementById('productPrice');

    // Hata önlemek için element kontrolü
    if (!nicheSelect || !budgetInput || !productPriceInput) {
        console.error("Gerekli HTML elementleri bulunamadı (ID'leri kontrol et).");
        return;
    }

    const niche = nicheSelect.value;
    const budget = parseFloat(budgetInput.value) || 0;
    const productPrice = parseFloat(productPriceInput.value) || 0;

    // Mock Data: Influencer Listesi
    const influencers = [
        { name: "@" + niche + "_master", followers: 500000, engagement: 0.04 },
        { name: "@daily_" + niche, followers: 250000, engagement: 0.06 },
        { name: "@" + niche + "_guru", followers: 100000, engagement: 0.08 },
        { name: "@micro_" + niche, followers: 50000, engagement: 0.12 }
    ];

    let tableHTML = "";
    let totalCost = 0;
    let totalRevenue = 0;
    
    // Grafik Verileri için diziler
    let labels = [];
    let viewsData = [];
    let costData = [];

    influencers.forEach(inf => {
        // 1. Maliyet Hesaplama: Bütçenin rastgele bir kısmı (%10-%30 arası)
        const cost = Math.floor(budget * (Math.random() * 0.20 + 0.10));
        
        // 2. İzlenme Hesaplama (Views): 
        // CPM'in farklı çıkması için her influencer'ın dolar başına getirdiği izlenmeyi değiştiriyoruz.
        // Örn: Birinde 1$'a 30 izlenme, diğerinde 1$'a 50 izlenme gelir.
        const viewsPerDollar = getRandomInt(25, 65); 
        const estViews = cost * viewsPerDollar;

        // 3. Satış ve Ciro Hesaplama
        const conversionRate = (inf.engagement * 0.15); // Basit dönüşüm oranı mantığı
        const estSales = Math.floor(estViews * conversionRate);
        const revenue = estSales * productPrice;

        // 4. CPM HESAPLAMA: (Maliyet / İzlenme) * 1000
        // Sonuç her influencer için farklı çıkacak.
        const cpm = ((cost / estViews) * 1000).toFixed(2);

        // 5. ROI ÇARPANI HESAPLAMA: (Gelir / Maliyet)
        // Yüzde yerine "x1.5" gibi çarpan formatı.
        let roiVal = 0;
        if (cost > 0) {
            roiVal = (revenue / cost).toFixed(1);
        }
        const roiMultiplier = roiVal + "x";

        // Toplamları güncelle
        totalCost += cost;
        totalRevenue += revenue;

        // Grafik dizilerine veri ekle
        labels.push(inf.name);
        viewsData.push(estViews);
        costData.push(cost);

        // Tablo satırını oluştur
        tableHTML += `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-3 font-medium">${inf.name}</td>
                <td class="p-3">${estViews.toLocaleString()}</td>
                <td class="p-3">$${cost}</td>
                <td class="p-3">$${cpm}</td>
                <td class="p-3">${estSales}</td>
                <td class="p-3">$${revenue.toLocaleString()}</td>
                <td class="p-3 font-bold text-green-600 bg-green-50 rounded">${roiMultiplier}</td>
            </tr>
        `;
    });

    // Tabloyu HTML içine bas
    const tableBody = document.getElementById('influencerTableBody');
    if (tableBody) tableBody.innerHTML = tableHTML;

    // Toplam Kar Hesapla ve Yazdır (Gelir - Maliyet)
    const totalProfit = totalRevenue - totalCost;
    const profitDisplay = document.getElementById('totalProfitDisplay');
    
    if (profitDisplay) {
        profitDisplay.innerText = "$" + totalProfit.toLocaleString();
        // Kar negatifse rengi kırmızı yap, pozitifse yeşil
        if(totalProfit < 0) {
            profitDisplay.classList.remove('text-green-700');
            profitDisplay.classList.add('text-red-600');
        } else {
            profitDisplay.classList.remove('text-red-600');
            profitDisplay.classList.add('text-green-700');
        }
    }

    // Sonuç alanını görünür yap
    const resultsArea = document.getElementById('resultsArea');
    if (resultsArea) resultsArea.classList.remove('hidden');

    // Grafikleri oluştur
    renderCharts(labels, viewsData, costData);
}

// Grafikleri Çizen Fonksiyon
function renderCharts(labels, viewsData, costData) {
    // 1. Bar Chart (İzlenme ve Maliyet)
    const ctxBar = document.getElementById('barChart');
    
    if (ctxBar) {
        // Varsa eski grafiği temizle
        if (barChartInstance) barChartInstance.destroy();

        barChartInstance = new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'İzlenme (Views)',
                        data: viewsData,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Mavi
                        yAxisID: 'y',
                    },
                    {
                        label: 'Maliyet ($)',
                        data: costData,
                        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Kırmızı
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // CSS ile yönetmek için false
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'İzlenme Sayısı' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Maliyet ($)' }
                    }
                }
            }
        });
    }

    // 2. Pie Chart (Bütçe Dağılımı)
    const ctxPie = document.getElementById('pieChart');

    if (ctxPie) {
        // Varsa eski grafiği temizle
        if (pieChartInstance) pieChartInstance.destroy();

        pieChartInstance = new Chart(ctxPie.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: costData,
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Harcama Dağılımı' }
                }
            }
        });
    }
}