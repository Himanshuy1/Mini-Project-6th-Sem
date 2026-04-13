import React from 'react';

const HUDHeader = ({ data, onItemClick }) => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,255,136,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
             <div className="blink" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div>
             <span className="hud-text text-green" style={{ fontSize: '11px', fontWeight: 'bold' }}>WORLD</span>
          </div>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span className="hud-text text-main" style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>MONITOR</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontFamily: 'var(--font-hud)' }}>v2.9.1</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontFamily: 'var(--font-hud)' }}>@admin</span>
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
