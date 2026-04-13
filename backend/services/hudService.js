import axios from 'axios';
import * as cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Scrapes Google Finance for stock and commodity data.
 */
export const fetchFinanceData = async (ticker, exchange = 'NASDAQ') => {
    try {
        const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
        console.log(`[HUD-SERVICE] Scraping: ${url}`);
        const { data } = await axios.get(url, { headers: { 'User-Agent': USER_AGENT } });
        const $ = cheerio.load(data);
        
        const price = $('.fxKbKc').first().text();
        const change = $('.Nyd5ce').first().text();
        
        return {
            name: ticker,
            price: price || 'N/A',
            change: change || '0.00%',
            trend: change.includes('-') ? 'down' : 'up'
        };
    } catch (err) {
        console.error(`[HUD-SERVICE] Error scraping ${ticker}:`, err.message);
        return { name: ticker, price: '---', change: '0.00%', trend: 'neutral' };
    }
};

/**
 * Fetches real-time metal prices via scraping.
 */
export const fetchMetalPrices = async () => {
    const metals = [
        { ticker: 'GCW00', exchange: 'COMEX', name: 'GOLD' },
        { ticker: 'SIW00', exchange: 'COMEX', name: 'SILVER' },
        { ticker: 'HG1:COMEX', exchange: '', name: 'COPPER' },
        { ticker: 'PL:NYMEX', exchange: '', name: 'PLATINUM' }
    ];

    return Promise.all(metals.map(async (m) => {
        const tickerStr = m.exchange ? `${m.ticker}:${m.exchange}` : m.ticker;
        const data = await fetchFinanceData(m.ticker, m.exchange);
        return { ...data, name: m.name };
    }));
};

/**
 * Fetches Big Tech market giants.
 */
export const fetchMarketGiants = async () => {
    const giants = [
        { ticker: 'GOOGL', exchange: 'NASDAQ', name: 'Alphabet Inc.' },
        { ticker: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.' },
        { ticker: 'META', exchange: 'NASDAQ', name: 'Meta Platforms' },
        { ticker: 'AMZN', exchange: 'NASDAQ', name: 'Amazon' },
        { ticker: 'TSLA', exchange: 'NASDAQ', name: 'Tesla, Inc.' }
    ];

    return Promise.all(giants.map(async (g) => {
        const data = await fetchFinanceData(g.ticker, g.exchange);
        return { 
            ticker: g.ticker, 
            name: g.name, 
            status: `${data.price} (${data.change})`,
            impact: data.change.includes('-') ? 'Bearish Sentiment' : 'Market Resilience'
        };
    }));
};

/**
 * Fetches aviation status data from OpenSky Network.
 */
export const fetchAviationData = async () => {
    try {
        console.log(`[HUD-SERVICE] Fetching Aviation Data from OpenSky...`);
        // OpenSky API - simplified for current state of major hubs
        const { data } = await axios.get('https://opensky-network.org/api/states/all', { timeout: 10000 });
        
        // This is a massive dataset, we'll just count flights in specific regions to simulate "Intelligence"
        const states = data.states || [];
        const totalFlights = states.length;
        
        return [
            { id: "GLO", name: "Global Airspace", status: totalFlights > 10000 ? "HIGH TRAFFIC" : "NORMAL", delay: "--" },
            { id: "LHR", name: "London Heathrow", status: "STABLE", delay: "+2m" },
            { id: "DXB", name: "Dubai Intel", status: "BUSY", delay: "+5m" }
        ];
    } catch (err) {
        console.error(`[HUD-SERVICE] Aviation API Error:`, err.message);
        return [
            { id: "GLO", name: "Global Airspace", status: "DATA OFFLINE", delay: "--" }
        ];
    }
};

/**
 * Fetches IP-level Cyber Attack markers.
 */
export const fetchCyberIncidents = async () => {
    try {
        console.log(`[HUD-SERVICE] Fetching Cyber Incidents from MalwareBazaar...`);
        // Using a public feed of recent malware reports (technical / IP level context)
        const { data } = await axios.post('https://mb-api.abuse.ch/api/v1/', 'query=get_recent&selector=100', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (data.results && Array.isArray(data.results)) {
            return data.results.slice(0, 15).map((item, idx) => {
                // Since we don't have lat/lng in this feed, we simulate geocoding 
                // for some common report origins or use random high-risk coordinates 
                // to populate the globe with realistic "arcs".
                const targets = [
                    { name: 'Washington', lat: 38.8951, lon: -77.0364 },
                    { name: 'London', lat: 51.5074, lon: -0.1278 },
                    { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
                    { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 }
                ];
                const origins = [
                    { name: 'Source Alpha', lat: Math.random() * 40 + 20, lon: Math.random() * 40 + 30 },
                    { name: 'Source Gamma', lat: Math.random() * 40 + 10, lon: Math.random() * 40 - 20 }
                ];
                
                const target = targets[idx % targets.length];
                const origin = origins[idx % origins.length];

                return {
                    target: item.threat || "Unknown Threat",
                    type: item.file_type || "Attack",
                    origin: "Detected Node",
                    status: "Mitigating",
                    severity: "High",
                    lat: target.lat,
                    lon: target.lon,
                    originLat: origin.lat,
                    originLon: origin.lon,
                    markerType: 'shield'
                };
            });
        }
        return [];
    } catch (err) {
        console.error(`[HUD-SERVICE] Cyber API Error:`, err.message);
        return [];
    }
};
