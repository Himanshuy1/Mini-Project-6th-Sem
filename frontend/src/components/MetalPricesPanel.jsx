import React from 'react';

const MetalPricesPanel = ({ data, onItemClick }) => {
    const list = data?.metalPrices || [
        { name: "GOLD", price: "$4,787", change: "-0.64%", trend: "down" },
        { name: "SILVER", price: "$76.48", change: "+0.05%", trend: "up" },
        { name: "COPPER", price: "$5.89", change: "+2.11%", trend: "up" },
        { name: "PLATINUM", price: "$2,065", change: "-2.22%", trend: "down" },
        { name: "PALLADIUM", price: "$1,540", change: "-1.71%", trend: "down" },
        { name: "ALUMINUM", price: "$3,415", change: "+1.66%", trend: "up" }
    ];

    const tabs = ["Commodities", "EUR FX"];
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
                    <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--text-main)', fontWeight: 'bold' }}>METALS & MATERIALS</h3>
                    <span style={{ color: 'var(--text-dim)', fontSize: '11px', border: '1px solid var(--bg-panel-border)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>?</span>
                </div>
            </div>

            {/* Tab (Only Commodities) */}
            <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div 
                    style={{
                        padding: '10px 0',
                        marginRight: '20px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-hud)',
                        fontWeight: 'bold',
                        color: 'var(--text-main)',
                        borderBottom: '2px solid var(--text-main)',
                        cursor: 'default',
                        letterSpacing: '0.5px'
                    }}
                >
                    Commodities
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', background: 'var(--bg-dark)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {list.map((item, idx) => (
                        <div 
                            key={idx}
                            onClick={() => onItemClick && onItemClick({
                                title: `${item.name} Market Analysis`,
                                type: "COMMODITY INTELLIGENCE",
                                content: `Analyzing price movement for ${item.name}.\n\nCurrent Price: ${item.price}\nDelta: ${item.change}\n\nGlobal supply chain constraints and geopolitical volatility in key mining sectors are driving these shifts. Our predictive models indicate continued ${item.trend === 'up' ? 'bullish' : 'bearish'} sentiment in the near term.`,
                                details: {
                                    commodity: item.name,
                                    price: item.price,
                                    variance: item.change,
                                    risk_level: "High"
                                }
                            })}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                padding: '8px',
                                borderRadius: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: 'bold' }}>{item.name}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 'bold', fontFamily: 'var(--font-hud)' }}>{item.price}</span>
                            <span style={{ fontSize: '10px', color: item.trend === 'up' ? 'var(--text-neon-green)' : 'var(--text-neon-red)', fontWeight: 'bold' }}>{item.change}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MetalPricesPanel;
