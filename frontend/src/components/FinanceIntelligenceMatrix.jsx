import React from 'react';

const FinanceIntelligenceMatrix = ({ data, onItemClick }) => {
  const ticker = data?.tickerNews || [];
  const shippingStocks = data?.shippingStocks || [];
  const metals = data?.metalPrices || [];

  // Filter news by sub-categories
  const globalEconNews = ticker.filter(n => n.category === 'finance_global_econ' || n.category === 'finance');
  const shippingNews = ticker.filter(n => n.category === 'finance_shipping');
  const insuranceNews = ticker.filter(n => n.category === 'finance_insurance');

  const handleNewsClick = (news, type) => {
    onItemClick && onItemClick({
      title: news.title,
      type: type,
      content: `Organizational data harvested for ${news.title}. Source: ${news.source}.\n\nEconomic impact models are active. Institutional source verifying with IMF/WB nodes.`,
      details: {
        source: news.source,
        domain: "Global Economics",
        url: news.url
      }
    });
  };

  const handleShippingClick = (s) => {
    onItemClick && onItemClick({
      title: `${s.name} (${s.ticker}) - Logistics Intelligence`,
      type: "MARITIME DYNAMICS",
      content: `Strategic tracking for ${s.name}.\nCurrent Status: [${s.status}].\n\nDirect impact from global conflict zones is high. Analysis: ${s.impact}.`,
      details: { ticker: s.ticker, sector: "Maritime Logistics", impact: s.impact }
    });
  };

  const BlockHeader = ({ title, icon, color }) => (
    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: color }}>
        <span style={{ marginRight: '8px' }}>{icon}</span> {title}
      </h3>
      <span className="blink" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>● LIVE SYNC</span>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', paddingRight: '12px', pointerEvents: 'auto' }}>
      
      {/* Container 1: Global Market Economics */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(20,10,30,0.85)' }}>
        <BlockHeader title="GLOBAL MARKET ECONOMICS" icon="🏛️" color="var(--text-neon-cyan)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {globalEconNews.length > 0 ? globalEconNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "INSTITUTIONAL")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
               <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-cyan)', marginTop: '4px' }}>ORG: {n.source || 'GLOBAL'}</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Polling IMF/WB nodes...</div>}
        </div>
      </div>

      {/* Container 2: Shipping Stock Analysis */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(20,10,30,0.85)' }}>
        <BlockHeader title="SHIPPING STOCK ANALYSIS" icon="🚢" color="var(--text-neon-amber)" />
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
           {shippingStocks.filter(s => s).map((s, i) => (
            <div key={i} onClick={() => handleShippingClick(s)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', cursor: 'pointer' }}>
               <span className="hud-text" style={{ fontSize: '10px', fontWeight: 'bold' }}>{s.ticker}</span>
               <span className="hud-text" style={{ 
                 fontSize: '10px', 
                 color: s?.status?.includes('+') ? 'var(--text-neon-green)' : 'var(--text-neon-red)' 
               }}>
                 {s?.status?.split(' ')?.[1] || '0.00%'}
               </span>
            </div>
           ))}
        </div>
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <span className="hud-text text-dim" style={{ fontSize: '9px', display: 'block', marginBottom: '8px' }}>LATEST SHIPPING INTELLIGENCE</span>
          {shippingNews.length > 0 ? shippingNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "LOGISTICS")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Analyzing freight rates...</div>}
        </div>
      </div>

      {/* Container 3: Shipping Insurance */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(20,10,30,0.85)' }}>
        <BlockHeader title="SHIPPING INSURANCE & RISK" icon="🛡️" color="var(--text-neon-red)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {insuranceNews.length > 0 ? insuranceNews.map((n, i) => (
            <div key={i} onClick={() => handleNewsClick(n, "INSURANCE RISK")} className="tech-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dotted rgba(255,255,255,0.05)', cursor: 'pointer' }}>
               <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)', lineHeight: '1.4' }}>{n.title}</div>
               <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-red)', marginTop: '4px' }}>RISK PREMIUM ALERT</div>
            </div>
          )) : <div className="hud-text text-dim" style={{ fontSize: '10px' }}>Monitoring war risk premiums...</div>}
        </div>
      </div>

      {/* Container 4: Commodities & Metals */}
      <div className="glass-panel" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(20,10,30,0.85)' }}>
        <BlockHeader title="COMMODITY INDEX" icon="⛓️" color="var(--text-neon-amber)" />
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {metals.filter(m => m).map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div className="hud-text" style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>{m.name}</div>
                <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-dim)' }}>SPOT PRICE / LB</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="hud-text" style={{ fontSize: '10px', color: 'var(--text-main)' }}>{m?.price || '0.00'}</div>
                <div className="hud-text" style={{ fontSize: '8px', color: 'var(--text-neon-amber)' }}>{m?.change || '0.00%'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FinanceIntelligenceMatrix;
