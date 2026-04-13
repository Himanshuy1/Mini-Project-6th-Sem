import React from 'react';

const LegendItem = ({ color, label, type = 'dot' }) => {
    const renderIcon = () => {
        switch (type) {
            case 'triangle':
                return (
                    <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: '6px' }}>
                        <path d="M6 1 L11 10 L1 10 Z" fill={color} />
                    </svg>
                );
            case 'hexagon':
                return (
                    <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: '6px' }}>
                        <path d="M3 1 L9 1 L12 6 L9 11 L3 11 L0 6 Z" fill={color} />
                    </svg>
                );
            case 'dot':
            default:
                return (
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: color,
                        marginRight: '8px',
                        boxShadow: `0 0 8px ${color}66`
                    }}></div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {renderIcon()}
            <span className="hud-text" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>
                {label}
            </span>
        </div>
    );
};

const MapLegend = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(6, 8, 12, 0.95)',
            padding: '10px 24px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            pointerEvents: 'auto',
            zIndex: 100,
            backdropFilter: 'blur(10px)'
        }}>
            <span className="hud-text" style={{ 
                fontSize: '11px', 
                color: 'white', 
                fontWeight: 'bold', 
                letterSpacing: '2px',
                marginRight: '10px',
                borderRight: '1px solid rgba(255,255,255,0.2)',
                paddingRight: '15px'
            }}>LEGEND</span>
            
            <LegendItem color="#ff3366" label="High Alert" />
            <LegendItem color="#ffaa00" label="Elevated" />
            <LegendItem color="#ffff00" label="Monitoring" />
            <LegendItem color="#ff6688" label="Conflict Zone" />
            <LegendItem color="#3b82f6" label="Base" type="triangle" />
            <LegendItem color="#eab308" label="Nuclear" type="hexagon" />
        </div>
    );
};

export default MapLegend;
