import React from 'react';

const AirlineIntelPanel = ({ data, onItemClick }) => {
    const list = data?.airlineIntel || [
        { id: "LHR", name: "London Heathrow", status: "NORMAL", delay: "--" },
        { id: "CDG", name: "Paris Charles de Gaul...", status: "NORMAL", delay: "--" },
        { id: "FRA", name: "Frankfurt Airport", status: "NORMAL", delay: "--" },
        { id: "IST", name: "Istanbul Airport", status: "MODERATE", delay: "+9m" },
        { id: "DXB", name: "Dubai International", status: "NORMAL", delay: "--" }
    ];

    const tabs = ["Ops", "Flights", "Airlines", "Track", "News"];
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className="glass-panel" style={{
            pointerEvents: 'auto',
            width: '100%',
            height: '240px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-panel-solid)',
            border: 'none',
            borderTop: '1px solid var(--bg-panel-border)',
            borderLeft: '1px solid var(--bg-panel-border)'
        }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-panel-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>✈️</span>
                    <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--text-main)', fontWeight: 'bold' }}>AIRLINE INTELLIGENCE</h3>
                    <span style={{ color: 'var(--text-dim)', fontSize: '11px', border: '1px solid var(--bg-panel-border)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '12px', cursor: 'pointer' }}>↻</div>
            </div>

            {/* Tab (Only Flights) */}
            <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <div 
                    style={{
                        padding: '8px 12px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-hud)',
                        color: 'var(--text-main)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: 'none',
                        borderRadius: '4px 4px 0 0',
                        marginTop: '4px',
                        cursor: 'default'
                    }}
                >
                    Flights
                </div>
            </div>

            {/* Content List */}
            <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', background: 'var(--bg-dark)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {list.map((item, idx) => (
                        <div 
                            key={idx}
                            onClick={() => onItemClick && onItemClick({
                                title: `Aviation Intel: ${item.name}`,
                                type: "LOGISTICS MONITORING",
                                content: `Sitrep for ${item.name} (${item.id}).\n\nOperational Status: ${item.status}\nAverage Latency: ${item.delay}\n\nAnalyzing flight path disruptions and ground handling efficiency. Significant rerouting observed in adjacent sectors due to ongoing atmospheric anomalies or technical interference. Civil aviation assets are advised to maintain strict adherence to localized situational updates.`,
                                details: {
                                    airport: item.name,
                                    code: item.id,
                                    status: item.status,
                                    delay_delta: item.delay
                                }
                            })}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)', width: '30px', fontFamily: 'var(--font-hud)' }}>{item.id}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{item.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ 
                                    fontSize: '9px', 
                                    fontWeight: 'bold', 
                                    color: item.status === 'NORMAL' ? 'var(--text-neon-green)' : 'var(--text-neon-amber)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.status}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-hud)' }}>{item.delay}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AirlineIntelPanel;
