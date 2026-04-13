import axios from 'axios';
import * as cheerio from 'cheerio';
import News from '../models/News.js';

// --- Global Cache for Live News Streams ---
let liveVideosCache = {
    data: [],
    lastUpdated: 0,
    ttl: 10 * 60 * 1000 // 10 minutes cache
};

const NEWS_CHANNELS = [
    { title: "AL JAZEERA", id: "UCNye-wNBqNL5ZzHSJj3l8Bg", color: "#f39c12", icon: "📡" },
    { title: "SKY NEWS", id: "UCoMdktPbSTixAyNGwb-UYkQ", color: "#27ae60", icon: "🛰️" },
    { title: "NBC NEWS", id: "UCeY0bbntWzzVIaj2z3QigXg", color: "#2980b9", icon: "🌐" },
    { title: "CGTN", id: "UCgrNz-aDmcr2uuto8_DL2jg", color: "#c0392b", icon: "🏮" },
    { title: "DW NEWS", id: "UCknLrEdhRCp3B9H2Y_sM6fA", color: "#2980b9", icon: "🌐" },
    { title: "FRANCE 24", id: "UCQk1QE-Y-748H4d2sB-Vw7Q", color: "#e74c3c", icon: "🇫🇷" },
    { title: "ABC NEWS", id: "UCBi2V36O27u_4pE6-mPrC-w", color: "#e74c3c", icon: "🇺🇸" },
    { title: "EURO NEWS", id: "UCg2VtLTW9Q2HBwxNLDvCuMg", color: "#8e44ad", icon: "🇪🇺" }
];

async function fetchLiveVideoId(channelId) {
    try {
        const url = `https://www.youtube.com/channel/${channelId}/live`;
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });
        const html = res.data;
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        const isLive = html.includes('"isLive":true');
        
        if (isLive && videoIdMatch) {
            return { videoId: videoIdMatch[1], isLive: true };
        }
        return { isLive: false };
    } catch (err) {
        return { isLive: false };
    }
}

async function getLiveVideos() {
    const now = Date.now();
    if (now - liveVideosCache.lastUpdated < liveVideosCache.ttl && liveVideosCache.data.length > 0) {
        return liveVideosCache.data;
    }

    const liveDiscovery = await Promise.all(NEWS_CHANNELS.map(async (ch) => {
        const status = await fetchLiveVideoId(ch.id);
        if (status.isLive) {
            return {
                ...ch,
                videoId: status.videoId,
                thumbUrl: `https://i.ytimg.com/vi/${status.videoId}/maxresdefault.jpg`
            };
        }
        return null;
    }));

    const result = liveDiscovery.filter(v => v !== null);
    
    // Update cache
    liveVideosCache.data = result;
    liveVideosCache.lastUpdated = now;
    
    return result;
}

// --- Global Cache for HUD Data ---
let lastNewsRefresh = 0;
const NEWS_REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

export const getHudData = async (req, res) => {
    try {
        // --- 0. Dynamic News Refresh Logic ---
        const now = Date.now();
        if (now - lastNewsRefresh > NEWS_REFRESH_INTERVAL) {
            console.log("Triggering dynamic news refresh...");
            // Run refresh in the background to not block the response too long
            // but for the "every refresh" requirement, we might want to wait once or use what we have
            const { fetchCombinedNews } = await import('../services/newsFetcher.js');
            fetchCombinedNews('general').then(async (fetchedArticles) => {
                for (let articleData of fetchedArticles) {
                    const exists = await News.findOne({ url: articleData.url });
                    if (!exists) {
                        await News.create({
                            ...articleData,
                            prediction: 'Real',
                            confidenceScore: 100,
                            reason: 'Auto-verified from Trusted GNews',
                            category: 'general',
                        });
                    }
                }
                lastNewsRefresh = Date.now();
            }).catch(err => console.error("Background News Refresh Error:", err));
        }

        // --- 1. Finance Scrape & Big Tech Giants Simulation ---
        let indianMarket = {
            index: "NIFTY 50", value: "OFFLINE", change: "0.00%", status: "Monitoring... (Live)", lossEst: "Evaluating Alert..."
        };
        try {
            const response = await axios.get('https://www.google.com/finance/quote/NIFTY_50:INDEXNSE', { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $ = cheerio.load(response.data);
            const valueText = $('.fxKbKc').first().text();
            let changeText = $('.Nyd5ce').first().text(); 
            if(valueText) {
                indianMarket.value = valueText;
                if (changeText) indianMarket.change = changeText.trim();
            }
        } catch(err) { console.error("Finance Scrape Error"); }

        const marketGiants = [
            { ticker: "GOOG", name: "Alphabet Inc.", status: "Volatile -1.2%", impact: "Data Center Risks" },
            { ticker: "AAPL", name: "Apple Inc.", status: "Stable +0.4%", impact: "Supply Chain Shift" },
            { ticker: "META", name: "Meta Platforms", status: "Critical -2.1%", impact: "Ad Rev Disruption" },
            { ticker: "AMZN", name: "Amazon", status: "Elevated +1.1%", impact: "Logistics Reroute" },
            { ticker: "PLTR", name: "Palantir Tech", status: "Surging +4.5%", impact: "Gov IT Contracts" }
        ];

        // --- NEW: Metals & Materials Data ---
        const metalPrices = [
            { name: "GOLD", price: "$4,787", change: "-0.64%", trend: "down" },
            { name: "SILVER", price: "$76.48", change: "+0.05%", trend: "up" },
            { name: "COPPER", price: "$5.89", change: "+2.11%", trend: "up" },
            { name: "PLATINUM", price: "$2,065", change: "-2.22%", trend: "down" },
            { name: "PALLADIUM", price: "$1,540", change: "-1.71%", trend: "down" },
            { name: "ALUMINUM", price: "$3,415", change: "+1.66%", trend: "up" }
        ];

        // --- 2. Live Weather Core & Climate Anomalies ---
        let climateAnomalies = [];
        let weatherStates = [];
        try {
            const reqs = [
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=38.90&longitude=-77.03&current_weather=true'), // USA
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=51.38&current_weather=true'), // IRAN
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=32.08&longitude=34.78&current_weather=true'), // ISRAEL
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=25.20&longitude=55.27&current_weather=true')  // DUBAI
            ];
            const responses = await Promise.all(reqs);
            
            const usaTemp = responses[0].data.current_weather.temperature;
            const iranTemp = responses[1].data.current_weather.temperature;
            const isrTemp = responses[2].data.current_weather.temperature;
            const dubaiTemp = responses[3].data.current_weather.temperature;

            weatherStates = [
                { region: "Wash DC, US", temp: `${usaTemp}°C`, condition: usaTemp < 0 ? "Freezing" : "Clear", impact: "High" },
                { region: "Tehran, IR", temp: `${iranTemp}°C`, condition: iranTemp > 35 ? "Heat Alert" : "Clear", impact: "Critical" },
                { region: "Tel Aviv, IL", temp: `${isrTemp}°C`, condition: isrTemp > 35 ? "Heat Alert" : "Clear", impact: "High" },
                { region: "Dubai, UAE", temp: `${dubaiTemp}°C`, condition: dubaiTemp > 38 ? "Extreme Heat" : "Clear", impact: "Medium" }
            ];

            if (usaTemp < 0) climateAnomalies.push("Severe Freeze Alert: Wash DC Federal Zone");
            if (iranTemp > 35) climateAnomalies.push("Extreme Heat Warning: Tehran Operations Limited");
            if (isrTemp > 35) climateAnomalies.push("Extreme Heat Warning: Israel Coastline");
            if (dubaiTemp > 38) climateAnomalies.push("Critical Thermal Event: Dubai Hub Impacted");
            if (climateAnomalies.length === 0) climateAnomalies.push("Atmospheric Global Systems Stable");

        } catch(err) { console.error("Open-Meteo Error"); }

        const climateAnomaliesList = [
            { zone: "Ukraine", icon: "❄️", temp: "-4.1°C", precip: "-0.7mm", severity: "MODERATE", trend: "stable" },
            { zone: "Middle East", icon: "❄️", temp: "-4.8°C", precip: "0.0mm", severity: "MODERATE", trend: "stable" },
            { zone: "South Asia", icon: "❄️", temp: "-3.9°C", precip: "+0.5mm", severity: "MODERATE", trend: "stable" },
            { zone: "California", icon: "🌧️", temp: "+2.7°C", precip: "+7.6mm", severity: "MODERATE", trend: "up" },
            { zone: "Greenland", icon: "❄️", temp: "-3.5°C", precip: "-0.5mm", severity: "MODERATE", trend: "stable" }
        ];

        // --- 3. Airline Intelligence ---
        const airlineIntel = [
            { id: "LHR", name: "London Heathrow", status: "NORMAL", delay: "--" },
            { id: "CDG", name: "Paris Charles de Gaul...", status: "NORMAL", delay: "--" },
            { id: "FRA", name: "Frankfurt Airport", status: "NORMAL", delay: "--" },
            { id: "IST", name: "Istanbul Airport", status: "MODERATE", delay: "+9m" },
            { id: "DXB", name: "Dubai International", status: "NORMAL", delay: "--" }
        ];

        const airlineMapIntel = [
            { region: "Baltic Airspace", status: "GPS Jamming detected above FL250.", lat: 56.0000, lon: 20.0000, markerType: 'plane' },
            { region: "Russian-Ukraine Border", status: "Airspace strictly CLOSED to civil aviation.", lat: 50.0000, lon: 35.0000, markerType: 'plane' },
            { region: "Red Sea Corridor", status: "Rerouting highly recommended due to missile threat.", lat: 20.0000, lon: 39.0000, markerType: 'plane' }
        ];

        // --- 4. Live News Feeds ---
        let tickerNews = [];
        try {
            const recent = await News.find().sort({ publishedAt: -1 }).limit(100);
            if (recent && recent.length > 0) {
                tickerNews = recent.map(r => ({
                    title: r.title.toUpperCase(),
                    source: r.source.toUpperCase(),
                    content: r.description || r.title,
                    fullContent: r.content,
                    url: r.url,
                    publishedAt: r.publishedAt
                }));
            } else {
                tickerNews = [{ title: "AWAITING LIVE DATA SYNC...", source: "SYSTEM" }];
            }
        } catch (err) { 
            console.error("News DB Error:", err); 
            tickerNews = [{ title: "NEWS DATABASE OFFLINE", source: "SYSTEM" }];
        }

        // --- 5. War Zones (Real-World 2026 Context) ---
        const warZones = [
            { id: 1, name: "Ukraine (Donetsk Front)", lat: 48.0022, lon: 37.8045, severity: "Critical Alert", status: "High Intensity Kinetic Ops", defcon: 2, markerType: 'nuclear' },
            { id: 2, name: "Gaza Line", lat: 31.3547, lon: 34.3088, severity: "High Alert", status: "Active Siege/Urban Warfare", defcon: 3, markerType: 'nuclear' },
            { id: 3, name: "Israel-Lebanon Border", lat: 33.1054, lon: 35.5042, severity: "Critical Alert", status: "Missile Exchange / Cross-border", defcon: 2, markerType: 'nuclear' },
            { id: 4, name: "Red Sea (Bab al-Mandab)", lat: 12.5833, lon: 43.3333, severity: "High Alert", status: "Shipping Interdiction / Naval Ops", defcon: 3, markerType: 'fleet' },
            { id: 5, name: "Sudan (Khartoum/Darfur)", lat: 15.5007, lon: 32.5599, severity: "Conflict Zone", status: "Civil War / Rapid Support Forces", defcon: 3, markerType: 'base' },
            { id: 6, name: "Myanmar (Rakhine/Shan)", lat: 20.3000, lon: 93.6000, severity: "Conflict Zone", status: "Anti-Junta Offensive", defcon: 4, markerType: 'base' },
            { id: 7, name: "DR Congo (North Kivu/Goma)", lat: -1.6585, lon: 29.2230, severity: "Stability Alert", status: "M23 Rebellion / UN Intervention", defcon: 4, markerType: 'base' },
            { id: 8, name: "Taiwan Strait / Kinmen", lat: 24.4486, lon: 118.3719, severity: "Monitoring", status: "Grey Zone Tensions / Force Drills", defcon: 3, markerType: 'fleet' },
            { id: 9, name: "Sahel Region (Burkina Faso)", lat: 14.5000, lon: -1.0000, severity: "High Alert", status: "Insurgent Offensive", defcon: 3, markerType: 'base' },
            { id: 10, name: "Idlib, Syria", lat: 35.9333, lon: 36.6333, severity: "Monitoring", status: "Ongoing Civil Proxy War", defcon: 4, markerType: 'base' },
        ];

        // --- 6. Cyber Attacks ---
        const cyberAttacks = [
            { target: "US Federal Reserve", type: "DDoS", origin: "Unknown/Proxy", status: "Mitigating", severity: "High", lat: 38.8895, lon: -77.0353, originLat: 55.7558, originLon: 37.6173, markerType: 'shield' }, // Origin: Moscow
            { target: "EU Energy Grid", type: "Ransomware", origin: "Eastern Europe", status: "Critical", severity: "Critical", lat: 50.8503, lon: 4.3517, originLat: 48.8566, originLon: 2.3522, markerType: 'shield' }, // Origin: Paris (proxy)
            { target: "JP Morgan Chase", type: "Data Breach", origin: "Unknown", status: "Investigating", severity: "Medium", lat: 40.7128, lon: -74.0060, originLat: 39.9042, originLon: 116.4074, markerType: 'shield' } // Origin: Beijing
        ];

        // --- 7. Live Video Streams ---
        const liveVideos = await getLiveVideos();

        res.json({
            success: true,
            data: {
                warZones,
                indianMarket,
                marketGiants,
                metalPrices,
                weatherStates,
                climateAnomalies,
                climateAnomaliesList,
                airlineIntel,
                airlineMapIntel,
                cyberAttacks,
                globalDefcon: 3,
                tickerNews,
                liveVideos
            }
        });
    } catch(error) {
        console.error("HUD Data Error:", error);
        res.status(500).json({ success: false, message: "Error fetching HUD data" });
    }
};

