import React from 'react';

const ClimatePanel = ({ data, onItemClick }) => {
    const list = data?.climateAnomaliesList || [
        { zone: "Ukraine", icon: "❄️", temp: "-4.1°C", precip: "-0.7mm", severity: "MODERATE", trend: "stable" },
        { zone: "Middle East", icon: "❄️", temp: "-4.8°C", precip: "0.0mm", severity: "MODERATE", trend: "stable" },
        { zone: "South Asia", icon: "❄️", temp: "-3.9°C", precip: "+0.5mm", severity: "MODERATE", trend: "stable" },
        { zone: "California", icon: "🌧️", temp: "+2.7°C", precip: "+7.6mm", severity: "MODERATE", trend: "up" },
        { zone: "Greenland", icon: "❄️", temp: "-3.5°C", precip: "-0.5mm", severity: "MODERATE", trend: "stable" }
    ];

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
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--bg-panel-border)' }}>
                <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--text-main)', fontWeight: 'bold' }}>CLIMATE ANOMALIES</h3>
                <span style={{ color: 'var(--text-dim)', fontSize: '11px', border: '1px solid var(--bg-panel-border)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                <span style={{ marginLeft: '16px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.1)' }}>{list.length}</span>
            </div>
            
            <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', background: 'var(--bg-dark)' }}>
                {/* Headers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px', fontFamily: 'var(--font-hud)', fontWeight: 'bold' }}>
                    <span style={{ flex: 1.5 }}>ZONE</span>
                    <span style={{ flex: 1, textAlign: 'right' }}>TEMP</span>
                    <span style={{ flex: 1, textAlign: 'right' }}>PRECIP</span>
                    <span style={{ width: '70px', textAlign: 'right' }}>SEVERITY</span>
                </div>

                {/* Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {list.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onItemClick && onItemClick({
                                title: `Atmos Anomaly: ${item.zone}`,
                                type: "CLIMATE INTELLIGENCE",
                                content: `Analyzing rapid systemic shift in ${item.zone}.\n\nThermal Variance: ${item.temp}\nPrecipitation Delta: ${item.precip}\n\nOur environmental modeling core is detecting a sustained ${item.severity.toLowerCase()} severity anomaly. Primary drivers appear to be localized thermal feedback loops exacerbated by shifting trade currents. Immediate-term stability is uncertain as the system transitions into a secondary stabilization phase.`,
                                details: {
                                    zone: item.zone,
                                    thermal_delta: item.temp,
                                    precip_variance: item.precip,
                                    severity: item.severity
                                }
                            })}
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                fontSize: '11px', 
                                fontFamily: 'var(--font-body)', 
                                color: 'var(--text-main)', 
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                padding: '4px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.02)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ flex: 1.5, display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px' }}>{item.icon}</span>
                                <span style={{ letterSpacing: '0.3px' }}>{item.zone}</span>
                            </div>
                            <span style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--font-hud)', fontSize: '10px' }}>{item.temp}</span>
                            <span style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--font-hud)', fontSize: '10px' }}>{item.precip}</span>
                            <div style={{ width: '70px', display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ 
                                    background: 'rgba(255,170,0,0.15)', 
                                    color: 'var(--text-neon-amber)', 
                                    padding: '2px 6px', 
                                    borderRadius: '3px', 
                                    fontSize: '8px',
                                    fontWeight: 'bold',
                                    border: '1px solid rgba(255,170,0,0.2)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.severity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.1)', letterSpacing: '4px', fontSize: '12px' }}>•••</span>
                </div>
            </div>
        </div>
    );
};

export default ClimatePanel;

