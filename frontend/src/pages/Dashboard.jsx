import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import HUDHeader from '../components/HUDHeader';
import HUDSidebarLeft from '../components/HUDSidebarLeft';
import HUDBottomPanel from '../components/HUDBottomPanel';
import GrokChatbot from '../components/GrokChatbot';
import MapLegend from '../components/MapLegend';
import HUDFooter from '../components/HUDFooter';
import ClimatePanel from '../components/ClimatePanel';
import MetalPricesPanel from '../components/MetalPricesPanel';
import AirlineIntelPanel from '../components/AirlineIntelPanel';
import DetailModal from '../components/DetailModal';
import MapToggle from '../components/MapToggle';
import GlobeView from '../components/GlobeView';

const Dashboard = () => {
  const [hudData, setHudData] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [viewMode, setViewMode] = useState('2D');

  useEffect(() => {
    // Fetch the live HUD data
    const fetchData = () => {
        fetch('http://localhost:5000/api/hud/data')
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              setHudData(json.data);
            }
          })
          .catch(err => console.error("Error fetching HUD data:", err));
    };

    fetchData();
    // Refresh every 2 minutes to keep "dynamic real news" requirement
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Tactical HUD Overlays - Fixed */}
      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="tactical-frame" />

      {/* Layer 0: The Map (Fixed in background) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
        {viewMode === '2D' ? (
            <MapView hudData={hudData} />
        ) : (
            <GlobeView hudData={hudData} />
        )}
      </div>

      <MapToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      <MapLegend />
      <HUDFooter />

      {/* Layer 1: UI Overlays */}
      <div style={{ position: 'relative', width: '100%', zIndex: 10, pointerEvents: 'none' }}>
        <HUDHeader data={hudData} onItemClick={setSelectedDetail} />
        
        {/* Fixed Left Sidebar */}
        <div style={{ position: 'fixed', top: '80px', left: 0, height: 'calc(100vh - 104px)', pointerEvents: 'auto', zIndex: 15 }}>
          <HUDSidebarLeft data={hudData} onItemClick={setSelectedDetail} />
        </div>

        {/* Scrollable Intelligence Area */}
        <div style={{ width: '100%', paddingLeft: '280px' }}>
          {/* Spacer to expose map/globe at the top */}
          <div style={{ height: '75vh' }} />

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - 80px)', paddingBottom: '24px' }}>
             {/* Primary Bottom HUD Section */}
             <div style={{ display: 'flex', paddingRight: '12px' }}>
                 <div style={{ flex: 1.5, pointerEvents: 'auto' }}>
                    <HUDBottomPanel data={hudData} onItemClick={setSelectedDetail} />
                 </div>
                 <div style={{ width: '320px', display: 'flex', flexDirection: 'column', pointerEvents: 'auto', gap: '4px' }}>
                    <ClimatePanel data={hudData} onItemClick={setSelectedDetail} />
                 </div>
             </div>

             {/* Secondary Intelligence Row */}
             <div style={{ display: 'flex', paddingRight: '12px', marginTop: '16px', gap: '16px' }}>
                <div style={{ flex: 1, pointerEvents: 'auto' }}>
                    <MetalPricesPanel data={hudData} onItemClick={setSelectedDetail} />
                </div>
                <div style={{ flex: 1, pointerEvents: 'auto' }}>
                    <AirlineIntelPanel data={hudData} onItemClick={setSelectedDetail} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Detail Modal Overlay */}
      <DetailModal data={selectedDetail} onClose={() => setSelectedDetail(null)} />

      {/* Layer 3: Grok Chatbot Slider */}
      <GrokChatbot />
    </div>
  );
};

export default Dashboard;

