import React from 'react';

const HUDHeader = ({ data, onItemClick, activeTab, setActiveTab }) => {
  const defcon = data?.globalDefcon || 4;

  return (
    <div style={{
      pointerEvents: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 24px',
      background: 'var(--bg-dark)',
      borderBottom: '1px solid var(--bg-panel-border)',
      height: '50px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
          {/* Tab 1: WORLD */}
          <div 
            onClick={() => setActiveTab('world')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: activeTab === 'world' ? 'rgba(0,255,136,0.15)' : 'transparent', 
              padding: '6px 16px', borderRadius: '4px',
              border: activeTab === 'world' ? '1px solid var(--accent-green)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
             <span style={{ fontSize: '14px' }}>🌍</span>
             <span className="hud-text" style={{ fontSize: '11px', fontWeight: 'bold', color: activeTab === 'world' ? 'var(--accent-green)' : 'var(--text-dim)' }}>WORLD</span>
          </div>

          <div style={{ padding: '0 8px', color: 'rgba(255,255,255,0.1)' }}>|</div>

          {/* Tab 2: TECH */}
          <div 
            onClick={() => setActiveTab('tech')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: activeTab === 'tech' ? 'rgba(0,255,136,0.15)' : 'transparent', 
              padding: '6px 16px', borderRadius: '4px',
              border: activeTab === 'tech' ? '1px solid var(--accent-green)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
             <span style={{ fontSize: '14px' }}>💻</span>
             <span className="hud-text" style={{ fontSize: '11px', fontWeight: 'bold', color: activeTab === 'tech' ? 'var(--accent-green)' : 'var(--text-dim)' }}>TECH</span>
          </div>

          <div style={{ padding: '0 8px', color: 'rgba(255,255,255,0.1)' }}>|</div>

          {/* Tab 3: FINANCE */}
          <div 
            onClick={() => setActiveTab('finance')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: activeTab === 'finance' ? 'rgba(0,255,136,0.15)' : 'transparent', 
              padding: '6px 16px', borderRadius: '4px',
              border: activeTab === 'finance' ? '1px solid var(--accent-green)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
             <span style={{ fontSize: '14px' }}>📈</span>
             <span className="hud-text" style={{ fontSize: '11px', fontWeight: 'bold', color: activeTab === 'finance' ? 'var(--accent-green)' : 'var(--text-dim)' }}>FINANCE</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <span className="hud-text text-main" style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>MONITOR</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontFamily: 'var(--font-hud)' }}>v2.9.2</span>
          <span style={{ color: 'var(--text-neon-green)', fontSize: '10px', fontFamily: 'var(--font-hud)' }}>● LIVE DATA</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      </div>

      <div className="hud-text text-dim" style={{ fontSize: '12px', letterSpacing: '1px' }}>
        {new Date().toUTCString().replace('GMT', 'UTC').toUpperCase()}
      </div>
    </div>
  );
};

export default HUDHeader;
