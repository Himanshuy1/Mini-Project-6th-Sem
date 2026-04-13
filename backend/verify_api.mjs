import axios from 'axios';

async function verify() {
    try {
        console.log("Fetching HUD data from http://localhost:5000/api/hud/data...");
        const res = await axios.get('http://localhost:5000/api/hud/data');
        if (res.data.success) {
            console.log("Success: Received HUD data.");
            console.log(`Live Videos Found: ${res.data.data.liveVideos.length}`);
            res.data.data.liveVideos.forEach(v => {
                console.log(`- ${v.title}: ${v.videoId}`);
            });
        } else {
            console.log("Error: API returned success: false");
        }
    } catch (err) {
        console.log(`Error calling API: ${err.message}`);
    }
}

verify();
