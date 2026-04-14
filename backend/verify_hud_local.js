import 'dotenv/config';
import { fetchMetalPrices, fetchMarketGiants, fetchCyberIncidents } from './services/hudService.js';

async function verify() {
    try {
        console.log("--- HUB SERVICE VERIFICATION ---");
        const metals = await fetchMetalPrices();
        console.log("METALS:", metals.map(m => `${m.name}: ${m.price}`).join(' | '));
        
        const giants = await fetchMarketGiants();
        console.log("GIANTS:", giants.map(g => `${g.ticker}: ${g.status}`).join(' | '));
        
        console.log("Fetching Cyber Incidents (including News)...");
        const cyber = await fetchCyberIncidents();
        console.log("CYBER SAMPLES:", cyber.slice(0, 3).map(c => `[${c.markerType}] ${c.target.substring(0, 30)}...`).join(' | '));

        console.log("--- VERIFICATION COMPLETE ---");
    } catch (e) {
        console.error("Verification error:", e.message);
    }
}

verify();
