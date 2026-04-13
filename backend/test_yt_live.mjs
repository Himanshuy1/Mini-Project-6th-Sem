import axios from 'axios';

const channels = [
    { title: "AL JAZEERA", id: "UCNye-wNBqNL5ZzHSJj3l8Bg" },
    { title: "SKY NEWS", id: "UCoMdktPbSTixAyNGwb-UYkQ" },
    { title: "ABC NEWS", id: "UCBi2V36O27u_4pE6-mPrC-w" },
    { title: "CBS NEWS", id: "UC8p1vwvWtl6T73JiExfWs1g" },
    { title: "NBC NEWS", id: "UCeY0bbntWzzVIaj2z3QigXg" },
    { title: "DW NEWS", id: "UCknLrEdhRCp3B9H2Y_sM6fA" },
    { title: "FRANCE 24", id: "UCQk1QE-Y-748H4d2sB-Vw7Q" },
    { title: "EURONEWS", id: "UCg2VtLTW9Q2HBwxNLDvCuMg" },
    { title: "CGTN", id: "UCgrNz-aDmcr2uuto8_DL2jg" },
    { title: "NDTV", id: "UCZ66Wz6U6Y_M9fM1Z0y4_5A" }
];

async function checkLive(id) {
    try {
        const url = `https://www.youtube.com/channel/${id}/live`;
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = res.data;
        
        // Look for videoId and isLive in the HTML
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        const isLive = html.includes('"isLive":true');
        
        if (isLive && videoIdMatch) {
            return { videoId: videoIdMatch[1], isLive: true };
        }
        return { isLive: false };
    } catch (err) {
        return { isLive: false, error: err.message };
    }
}

async function run() {
    for (const ch of channels) {
        const status = await checkLive(ch.id);
        console.log(`${ch.title}: ${JSON.stringify(status)}`);
    }
}

run();
