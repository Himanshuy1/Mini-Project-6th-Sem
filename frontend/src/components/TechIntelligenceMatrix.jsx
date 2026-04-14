import React from 'react';

const TechIntelligenceMatrix = ({ data, onItemClick }) => {
  const ticker = data?.tickerNews || [];
  const giants = data?.marketGiants || [];

  // Filter news by sub-categories
  const breakthroughNews = ticker.filter(n => n.category === 'tech_breakthroughs' || n.category === 'tech');
  const startupNews = ticker.filter(n => n.category === 'tech_startups');
  const unicornNews = ticker.filter(n => n.category === 'tech_unicorns');

  const handleNewsClick = (news, type) => {
    onItemClick && onItemClick({
      title: news.title,
      type: type,
      content: `Intelligence data harvested for ${news.title}. Source: ${news.source}.\n\nFull analysis of this technical development is currently being processed by Sentient-7.`,
      details: {
        source: news.source,
        domain: "Technology Intelligence",
        url: news.url
      }
    });
  };

  const handleGiantClick = (g) => {
    onItemClick && onItemClick({
      title: `${g.name} (${g.ticker}) - Quantum Valuation`,
      type: "MARKET DYNAMICS",
      content: `Current valuation for ${g.name} is tracked at ${g.status}.\n\nSentiment Analysis: ${g.impact}.`,
      details: { ticker: g.ticker, sector: "Technology Giant", impact: g.impact }
    });
  };

  const BlockHeader = ({ title, icon, color }) => (
    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: color }}>
        <span style={{ marginRight: '8px' }}>{icon}</span> {title}
      </h3>
      <span className="blink" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>● ACTIVE SCAN</span>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', paddingRight: '12px', pointerEvents: 'auto' }}>
      
      {/* Container 1: Latest Technologies */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(10,20,30,0.85)' }}>
        <BlockHeader title="LATEST NEW TECHNOLOGIES" icon="🔬" color="var(--text-neon-cyan)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {breakthroughNews.length > 0 ? breakthroughNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "BREAKTHROUGH")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
               <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-cyan)', marginTop: '4px' }}>SOURCE: {n.source}</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Scanning R&D pipelines...</div>}
        </div>
      </div>

      {/* Container 2: Startups Info */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(10,20,30,0.85)' }}>
        <BlockHeader title="STARTUPS INFO" icon="🚀" color="var(--text-neon-amber)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {startupNews.length > 0 ? startupNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "STARTUP INTEL")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
               <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-amber)', marginTop: '4px' }}>VC FUNDING / UPDATES</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Filtering seed rounds...</div>}
        </div>
      </div>

      {/* Container 3: Unicorn Companies */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(10,20,30,0.85)' }}>
        <BlockHeader title="UNICORN COMPANIES" icon="🦄" color="#f39c12" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {unicornNews.length > 0 ? unicornNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "UNICORN DYNAMICS")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
               <div className="hud-text" style={{ fontSize: '8px', color: '#f39c12', marginTop: '4px' }}>VALUATION BENCHMARK ALERT</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Tracking $1B+ valuations...</div>}
        </div>
      </div>

      {/* Container 4: Giant Company Market Value */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(10,20,30,0.85)' }}>
        <BlockHeader title="GIANT COMPANY MARKET VALUE" icon="📊" color="var(--text-neon-green)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {giants.filter(g => g).map((g, i) => (
            <div key={i} onClick={() => handleGiantClick(g)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
              <div>
                <div className="hud-text" style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>{g.ticker}</div>
                <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-dim)' }}>{g.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="hud-text" style={{ 
                  fontSize: '10px', 
                  color: g?.status?.includes('+') ? 'var(--text-neon-green)' : 'var(--text-neon-red)' 
                }}>
                  {g?.status?.split(' ')?.[1] || '0.00%'}
                </div>
                <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-amber)' }}>{g.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TechIntelligenceMatrix;
