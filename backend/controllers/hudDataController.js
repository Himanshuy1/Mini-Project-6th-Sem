import axios from 'axios';
import * as cheerio from 'cheerio';
import News from '../models/News.js';
import { fetchMarketGiants, fetchMetalPrices, fetchAviationData, fetchCyberIncidents, fetchShippingStocks } from '../services/hudService.js';

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
    
    liveVideosCache.lastUpdated = now;
    return result;
}

// --- Global Cache for HUD Data ---
let lastNewsRefresh = 0;
const NEWS_REFRESH_INTERVAL = 2 * 60 * 1000;

let hudCache = {
    data: null,
    lastUpdated: 0,
    ttl: 3 * 60 * 1000 // 3 minutes as requested
};

export const getHudData = async (req, res) => {
    try {
        const now = Date.now();
        
        // Return cached data if valid
        if (hudCache.data && (now - hudCache.lastUpdated < hudCache.ttl)) {
            console.log("[HUD-CONTROLLER] Serving data from cache.");
            return res.json({ success: true, data: hudCache.data });
        }

        console.log("[HUD-CONTROLLER] Cache expired or empty. Fetching fresh data...");

        // --- 0. Background News Refresh (Multi-Category) ---
        if (now - lastNewsRefresh > NEWS_REFRESH_INTERVAL) {
            import('../services/newsFetcher.js').then(async ({ fetchCombinedNews }) => {
                const categories = [
                    'general', 'tech', 'finance', 
                    'tech_breakthroughs', 'tech_startups', 'tech_unicorns',
                    'finance_global_econ', 'finance_shipping', 'finance_insurance'
                ];
                for (const cat of categories) {
                    fetchCombinedNews(cat).then(async (articles) => {
                        for (let a of articles) {
                            const exists = await News.findOne({ url: a.url });
                            if (!exists) await News.create({ ...a, prediction: 'Real', confidenceScore: 100, category: cat });
                        }
                    }).catch(e => console.error(`[SYNC-ERROR] ${cat}:`, e.message));
                }
                lastNewsRefresh = Date.now();
            }).catch(e => console.error("News Provider Sync Error"));
        }

        // --- 1. Fetch Real-time Data via Service ---

        const [
            marketGiants,
            metalPrices,
            airlineIntel,
            cyberAttacks,
            shippingStocks,
            liveVideos
        ] = await Promise.all([
            fetchMarketGiants(),
            fetchMetalPrices(),
            fetchAviationData(),
            fetchCyberIncidents(),
            fetchShippingStocks(),
            getLiveVideos()
        ]);

        // --- 2. Live Weather (Already dynamic) ---
        let climateAnomalies = [];
        let weatherStates = [];
        try {
            const weatherResponses = await Promise.all([
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=38.90&longitude=-77.03&current_weather=true'),
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=51.38&current_weather=true'),
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=32.08&longitude=34.78&current_weather=true'),
                axios.get('https://api.open-meteo.com/v1/forecast?latitude=25.20&longitude=55.27&current_weather=true')
            ]);
            
            weatherStates = weatherResponses.map((r, i) => {
                const regions = ["Wash DC, US", "Tehran, IR", "Tel Aviv, IL", "Dubai, UAE"];
                const t = r.data.current_weather.temperature;
                return { region: regions[i], temp: `${t}°C`, condition: t > 35 ? "Heat Alert" : t < 0 ? "Freeze" : "Clear", impact: "High" };
            });
            climateAnomalies = weatherStates.filter(w => w.condition !== "Clear").map(w => `${w.condition} Alert: ${w.region}`);
            if (climateAnomalies.length === 0) climateAnomalies.push("Atmospheric Global Systems Stable");
        } catch(e) { console.error("Weather Service Offline"); }

        // --- 3. Persistent HUD Elements ---
        const warZones = [
            { id: 1, name: "Ukraine (Donetsk Front)", lat: 48.0022, lon: 37.8045, severity: "Critical Alert", status: "High Intensity Kinetic Ops", defcon: 2, markerType: 'nuclear' },
            { id: 2, name: "Gaza Line", lat: 31.3547, lon: 34.3088, severity: "High Alert", status: "Active Siege/Urban Warfare", defcon: 3, markerType: 'nuclear' },
            { id: 3, name: "Israel-Lebanon Border", lat: 33.1054, lon: 35.5042, severity: "Critical Alert", status: "Missile Exchange / Cross-border", defcon: 2, markerType: 'nuclear' },
            { id: 4, name: "Red Sea Corridor", lat: 20.0000, lon: 39.0000, severity: "High Alert", status: "Naval Surveillance Required", defcon: 3, markerType: 'fleet' },
            { id: 5, name: "Sudan (Khartoum)", lat: 15.5007, lon: 32.5599, severity: "Critical Alert", status: "Civil War / Rapid Support Forces", defcon: 3, markerType: 'base' },
            { id: 6, name: "Taiwan Strait / Kinmen", lat: 24.4486, lon: 118.3719, severity: "Observation", status: "Grey Zone Tensions / Force Drills", defcon: 3, markerType: 'fleet' },
            { id: 7, name: "Myanmar (Rakhine)", lat: 20.3000, lon: 93.6000, severity: "High Alert", status: "Civil Conflict / Anti-Junta Offensive", defcon: 4, markerType: 'base' },
            { id: 8, name: "DR Congo (Goma)", lat: -1.6585, lon: 29.2230, severity: "Moderate Alert", status: "Rebel Offensive / UN Stabilization", defcon: 4, markerType: 'base' },
            { id: 9, name: "Idlib, Syria", lat: 35.9333, lon: 36.6333, severity: "Monitoring", status: "Ongoing Civil proxy war", defcon: 4, markerType: 'base' },
            { id: 10, name: "Korean DMZ", lat: 37.9561, lon: 126.6700, severity: "Precautionary", status: "Strategic Standalone / SIGINT Patrols", defcon: 3, markerType: 'shield' }
        ];

        let tickerNews = [];
        const recent = await News.find().sort({ publishedAt: -1 }).limit(100);
        tickerNews = recent.map(r => ({ 
            title: r.title.toUpperCase(), 
            source: r.source.toUpperCase(), 
            url: r.url,
            category: r.category || 'general'
        }));

        const responseData = {
            warZones,
            marketGiants,
            metalPrices,
            weatherStates,
            climateAnomalies,
            airlineIntel,
            cyberAttacks,
            globalDefcon: 3,
            tickerNews,
            liveVideos,
            shippingStocks
        };

        // Save to cache
        hudCache.data = responseData;
        hudCache.lastUpdated = now;

        res.json({ success: true, data: responseData });
    } catch(error) {
        console.error("HUD Data Error:", error);
        res.status(500).json({ success: false, message: "Error fetching HUD data" });
    }
};

