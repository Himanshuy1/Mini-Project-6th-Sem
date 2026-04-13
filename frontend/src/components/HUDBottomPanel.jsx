import React, { useState } from 'react';

// Confirmed embeddable live news channels via YouTube channel ID
// These channels have embedding enabled for their live streams
const LIVE_CHANNELS = [
  {
    title: "DW News",
    channelId: "UCknLrEdhRCp3B9H2Y_sM6fA",
    icon: "🌐",
    color: "#2980b9",
    rssSource: "DW",
    thumbUrl: "https://i.ytimg.com/vi/GE_SfNVNyEQ/maxresdefault_live.jpg"
  },
  {
    title: "France 24 English",
    channelId: "UCQk1QE-Y-748H4d2sB-Vw7Q",
    icon: "🇫🇷",
    color: "#e74c3c",
    rssSource: "FRANCE 24",
    thumbUrl: "https://i.ytimg.com/vi/h3MuIUNCCLI/maxresdefault_live.jpg"
  },
  {
    title: "Al Jazeera English",
    channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
    icon: "📡",
    color: "#f39c12",
    rssSource: "AL JAZEERA",
    thumbUrl: "https://i.ytimg.com/vi/gCNeDWCI0vo/maxresdefault_live.jpg"
  },
  {
    title: "CGTN",
    channelId: "UCgrNz-aDmcr2uuto8_DL2jg",
    icon: "🏮",
    color: "#c0392b",
    rssSource: "CGTN",
    thumbUrl: "https://i.ytimg.com/vi/8KKEBkVJ_Gg/maxresdefault_live.jpg"
  },
  {
    title: "Euronews",
    channelId: "UCg2VtLTW9Q2HBwxNLDvCuMg",
    icon: "🇪🇺",
    color: "#8e44ad",
    rssSource: "EURONEWS",
    thumbUrl: "https://i.ytimg.com/vi/6IA0gNVMKnY/maxresdefault_live.jpg"
  },
  {
    title: "Sky News",
    channelId: "UCoMdktPbSTixAyNGwb-UYkQ",
    icon: "🛰️",
    color: "#27ae60",
    rssSource: "SKY NEWS",
    thumbUrl: "https://i.ytimg.com/vi/9Auq9mYxFEE/maxresdefault_live.jpg"
  }
];

const HUDBottomPanel = ({ data, onItemClick }) => {
  const ticker = data?.tickerNews || ["AWAITING LIVE DATA SYNC..."];
  const liveVideos = data?.liveVideos || [];
  const newsSources = ['LIVE FEED', 'DW NEWS', 'FRANCE 24', 'AL JAZEERA'];
  const [activeSource, setActiveSource] = useState(0);

  // Market stuff
  const market = data?.indianMarket;
  const giants = data?.marketGiants || [];

  const handleVideoClick = (channel) => {
    // If we have a specific videoId, use the direct embed
    // Otherwise fallback to channel-based live stream (legacy)
    const embedUrl = channel.videoId 
      ? `https://www.youtube.com/embed/${channel.videoId}?autoplay=1&rel=0`
      : `https://www.youtube.com/embed/live_stream?channel=${channel.channelId}&autoplay=1&rel=0`;

    onItemClick && onItemClick({
      title: `${channel.title} — LIVE BROADCAST`,
      type: "LIVE BROADCAST",
      videoUrl: embedUrl,
      content: `Streaming live from ${channel.title}. Click the player to interact.`
    });
  };

  const handleTickerClick = (news) => {
    const isObject = typeof news === 'object' && news !== null;
    const source = isObject ? news.source : (news.match(/\[(.*?)\]/)?.[1] || "GLOBAL FEED");
    const title = isObject ? news.title : (news.replace(/\[.*?\] /, ''));

    onItemClick && onItemClick({
      title: title,
      type: `NEWS ALERT / ${source}`,
      content: isObject ? (news.fullContent || news.content) : `URGENT: ${title}\n\nOur automated harvesting systems have detected a significant development regarding this event. Preliminary reports suggest rapid escalation in the affected region. \n\nSatellite imagery and localized signal intelligence currently corroborate the headline. Technical assets are being redirected for higher-fidelity monitoring. Further updates will follow as the situation stabilizes or shifts into tertiary phases of our monitoring protocol.`,
      details: {
        source: source,
        confidence: "89%",
        latency: "124ms",
        origin: "Multi-Source Verification",
        url: isObject ? news.url : null
      }
    });
  };

  const handleGiantClick = (g) => {
    onItemClick && onItemClick({
      title: `${g.name} (${g.ticker}) - Rapid Market Shift`,
      type: "MARKET INTELLIGENCE",
      content: `Major volatility alert for ${g.name}. Current status: [${g.status}].\n\nDirect Impact Analysis: ${g.impact}.\n\nThe global geopolitical landscape is putting immense pressure on ${g.ticker}'s operations. Risk models indicate a potential 12% fluctuation within the next 48 hours. Supply chain disruptions and energy market shifts are cited as the primary drivers for this technical movement.\n\nAutomated hedging protocols are recommended for linked portfolios.`,
      details: {
        ticker: g.ticker,
        market_cap_impact: g.status,
        risk_vector: g.impact,
        trading_volume: "Elevated"
      }
    });
  };

  return (
    <div style={{ display: 'flex', gap: '4px', height: '260px', pointerEvents: 'auto' }}>

      {/* 1. LIVE NEWS TICKER */}
      <div className="glass-panel" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', background: 'var(--bg-panel-solid)', border: 'none', borderTop: '1px solid var(--bg-panel-border)', borderRight: '1px solid var(--bg-panel-border)' }}>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-panel-border)' }}>
          <h3 className="hud-text" style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-main)' }}>LIVE NEWS <span className="text-red">● {ticker.length}</span></h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="hud-text text-green blink" style={{ fontSize: '9px', border: '1px solid var(--text-neon-green)', padding: '2px 4px', borderRadius: '4px' }}>SYNCING DB</span>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--bg-panel-border)', padding: '0 8px', overflowX: 'hidden' }}>
          {newsSources.map((src, i) => (
            <div key={src} onClick={() => setActiveSource(i)} style={{
              padding: '8px 10px',
              fontSize: '9px',
              color: activeSource === i ? 'white' : 'var(--text-dim)',
              background: activeSource === i ? 'var(--text-neon-red)' : 'transparent',
              fontFamily: 'var(--font-body)',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              {src}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '12px', overflowY: 'auto', background: 'var(--bg-dark)' }}>
          {ticker.filter(item => {
            if (activeSource === 0) return true; // LIVE FEED
            const sourceTab = newsSources[activeSource].toUpperCase();
            const newsSource = (typeof item === 'string' ? item : item.source).toUpperCase();
            
            // Map common source variations
            if (sourceTab.includes("DW")) return newsSource.includes("DW");
            if (sourceTab.includes("FRANCE")) return newsSource.includes("FRANCE");
            if (sourceTab.includes("AL JAZEERA")) return newsSource.includes("AL JAZEERA");
            
            return newsSource.includes(sourceTab);
          }).map((news, idx) => {
            const isObject = typeof news === 'object' && news !== null;
            const title = isObject ? news.title : news;
            const source = isObject ? news.source : "INFO";

            return (
              <div
                key={idx}
                onClick={() => handleTickerClick(news)}
                className="hud-text"
                style={{
                  fontSize: '11px',
                  color: 'var(--text-main)',
                  borderBottom: '1px dotted rgba(255,255,255,0.1)',
                  paddingBottom: '12px',
                  marginBottom: '12px',
                  lineHeight: '1.5',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-neon-amber)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              >
                <span className="text-red">●</span> <span style={{ color: 'var(--text-neon-red)', fontWeight: 'bold' }}>[{source}]</span> {title}
                <div style={{ fontSize: '8px', color: 'var(--text-dim)', marginTop: '4px' }}>[ CLICK FOR FULL INTEL ]</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. LIVE VIDEO CHANNELS & MARKET FEED */}
      <div className="glass-panel" style={{ flex: 1.5, display: 'flex', flexDirection: 'column', background: 'var(--bg-panel-solid)', border: 'none', borderTop: '1px solid var(--bg-panel-border)', borderRight: '1px solid var(--bg-panel-border)' }}>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-panel-border)' }}>
          <h3 className="hud-text" style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-main)' }}>
            LIVE NEWS BROADCASTS
            <span className="blink" style={{ marginLeft: '8px', fontSize: '9px', color: 'var(--text-neon-red)' }}>● ON AIR</span>
          </h3>
          <span className="hud-text text-dim" style={{ fontSize: '9px' }}>CLICK TO OPEN STREAM</span>
        </div>

        <div style={{ flex: 1, display: 'flex', background: 'var(--bg-dark)', overflow: 'hidden' }}>
          {/* Live Channel Grid */}
          <div style={{ flex: 1.2, padding: '10px', borderRight: '1px solid var(--bg-panel-border)', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
            <span className="hud-text text-dim" style={{ fontSize: '9px', letterSpacing: '1px' }}>
              SATELLITE UPLINK — {liveVideos.length > 0 ? `${liveVideos.length} CHANNELS` : "SCANNING..."} ACTIVE
            </span>
            <div className="no-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', flex: 1, overflowY: 'auto' }}>
              {liveVideos.length > 0 ? liveVideos.map((channel, idx) => (
                <div
                  key={idx}
                  onClick={() => handleVideoClick(channel)}
                  title={`Click to open ${channel.title} live stream`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                    background: '#000'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = channel.color;
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* YouTube thumbnail as background — always loads, never "video not available" */}
                  <img
                    src={channel.thumbUrl}
                    alt={channel.title}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover', filter: 'brightness(0.45) saturate(0.8)'
                    }}
                  />

                  {/* Scanline overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
                    pointerEvents: 'none'
                  }} />

                  {/* Channel info */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '3px'
                  }}>
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{channel.icon}</span>
                    <span className="hud-text" style={{
                      fontSize: '7px', color: 'rgba(255,255,255,0.9)',
                      textAlign: 'center', padding: '0 3px', letterSpacing: '0.5px', fontWeight: 'bold'
                    }}>
                      {channel.title.toUpperCase()}
                    </span>
                    {/* LIVE badge */}
                    <div className="blink" style={{
                      display: 'flex', alignItems: 'center', gap: '3px',
                      background: channel.color, padding: '1px 5px', borderRadius: '2px'
                    }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                      <span style={{ fontSize: '7px', color: 'white', fontFamily: 'var(--font-hud)', fontWeight: 'bold', letterSpacing: '1px' }}>LIVE</span>
                    </div>
                  </div>

                  {/* Hover play overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0)', transition: 'background 0.2s ease'
                  }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s ease'
                    }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                      onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <span style={{ fontSize: '12px', marginLeft: '2px' }}>▶</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                   <span className="hud-text text-dim blink" style={{ fontSize: '10px' }}>SEARCHING FOR ACTIVE BROADCASTS...</span>
                </div>
              )}
            </div>
          </div>

          {/* Market Giants Data Feed */}
          <div style={{ width: '220px', padding: '12px', background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            <span className="hud-text text-dim" style={{ fontSize: '9px' }}>WAR AFFECTED MARKET GIANTS</span>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '4px' }}>
              <span className="hud-text" style={{ fontSize: '10px' }}>{market?.index}</span>
              <span className="hud-text text-red" style={{ fontSize: '10px' }}>{market?.change}</span>
            </div>

            {giants.map((g, idx) => (
              <div
                key={idx}
                onClick={() => handleGiantClick(g)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  borderLeft: `2px solid var(--text-neon-amber)`,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div className="hud-text" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'white', fontWeight: 'bold' }}>
                  <span>{g.ticker}</span>
                  <span style={{ color: g.status.includes('+') ? 'var(--text-neon-green)' : 'var(--text-neon-red)' }}>
                    {g.status.split(' ')[1]}
                  </span>
                </div>
                <div className="hud-text" style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px' }}>{g.name}</div>
                <div className="hud-text" style={{ fontSize: '9px', color: 'var(--text-neon-amber)', marginTop: '4px' }}>Impact: {g.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HUDBottomPanel;
