import React from 'react';

const AIInsights = ({ data, onItemClick }) => {
  return (
    <div className="glass-panel" style={{
      pointerEvents: 'auto',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-panel-solid)',
      border: 'none',
      borderTop: '1px solid var(--bg-panel-border)',
      borderLeft: '1px solid var(--bg-panel-border)'
    }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-panel-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="hud-text" style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-main)' }}>AI INSIGHTS</h3>
            <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>(?)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="hud-text text-green" style={{ fontSize: '9px', border: '1px solid var(--text-neon-green)', padding: '2px 6px', borderRadius: '10px' }}>LIVE</span>
            <span className="text-dim" style={{ fontSize: '10px' }}>⚙</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
        <div 
          onClick={() => onItemClick && onItemClick({
              title: "US-Israeli strikes in Iran",
              type: "World Brief / AI Insight",
              content: "US-Israeli strikes in Iran killed over 25 people, including six children. This escalation follows reports of US special forces rescuing two airmen from Iran.\n\nThe unverified operation inside Iranian territory highlights the rapidly expanding nature of the conflict. Local assets report significant disruptions to regional communication networks and an increased presence of military aircraft across the Gulf.\n\nAI Confidence Score: 87%\nSources corroborated: 3 major networks, 11 local stringers.",
              details: {
                  author: "Global Intel AI",
                  credibility: "High",
                  tags: ["Middle East", "KINETIC", "Special Ops"]
              }
          })}
          style={{ 
            background: 'var(--bg-panel-solid)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '4px',
            padding: '16px',
            flex: 1,
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }
        onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-panel-solid)' }
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4285F4' }}></div>
            <span className="hud-text" style={{ fontSize: '11px', color: '#4285F4', fontWeight: 'bold' }}>WORLD BRIEF</span>
            </div>
            
            <p className="hud-text" style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            US-Israeli strikes in Iran killed over 25 people, including six children. This escalation follows reports of US special forces rescuing two airmen from Iran.
            </p>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '12px', textAlign: 'right' }}>[ CLICK TO READ FULL ]</div>
        </div>
      </div>

    </div>
  );
};

export default AIInsights;
