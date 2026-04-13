import React from 'react';

const HUDFooter = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '24px',
            background: 'var(--bg-dark)',
            borderTop: '1px solid var(--bg-panel-border)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-hud)', fontSize: '10px' }}>
                <span className="text-dim" style={{ color: 'var(--text-main)', opacity: 0.8 }}>WORLD MONITOR</span>
                <span className="text-dim" style={{ color: 'var(--text-main)', opacity: 0.8 }}>V2.6.7</span>
                <span className="text-dim">@ELIEHABIB</span>
                
                <span style={{ margin: '0 24px' }}></span>

                <span className="text-dim" style={{ cursor: 'pointer' }}>Pro</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>Blog</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>Docs</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>Status</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>GitHub</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>Discord</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>X</span>
                <span className="text-dim" style={{ cursor: 'pointer' }}>Download App</span>
            </div>
        </div>
    );
};

export default HUDFooter;
