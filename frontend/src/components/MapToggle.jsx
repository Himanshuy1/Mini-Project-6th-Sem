import React from 'react';

const MapToggle = ({ viewMode, onViewModeChange }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            background: 'rgba(10, 12, 18, 0.85)',
            padding: '4px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto'
        }}>
            <button
                onClick={() => onViewModeChange('2D')}
                style={{
                    padding: '6px 14px',
                    background: viewMode === '2D' ? 'var(--text-neon-green)' : 'transparent',
                    color: viewMode === '2D' ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-hud)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: viewMode === '2D' ? '0 0 10px var(--text-neon-green)' : 'none'
                }}
            >
                2D
            </button>
            <button
                onClick={() => onViewModeChange('3D')}
                style={{
                    padding: '6px 14px',
                    background: viewMode === '3D' ? 'var(--text-neon-green)' : 'transparent',
                    color: viewMode === '3D' ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-hud)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: viewMode === '3D' ? '0 0 10px var(--text-neon-green)' : 'none'
                }}
            >
                3D
            </button>
        </div>
    );
};

export default MapToggle;
