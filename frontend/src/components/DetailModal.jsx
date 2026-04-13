import React from 'react';

const DetailModal = ({ data, onClose }) => {
    if (!data) return null;

    const isVideo = !!data.videoUrl;

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                pointerEvents: 'auto',
                backdropFilter: 'blur(8px)'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="glass-panel" 
                style={{
                    width: isVideo ? '80vw' : '700px',
                    maxWidth: '95%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(10,12,18,0.98)',
                    border: `1px solid ${isVideo ? 'var(--text-neon-red)' : 'var(--text-neon-amber)'}`,
                    boxShadow: `0 0 40px ${isVideo ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 170, 0, 0.15)'}`,
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{ 
                    padding: '20px 24px', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{ flex: 1 }}>
                        <div className={`hud-text ${isVideo ? 'text-red' : 'text-amber'} blink`} style={{ fontSize: '10px', marginBottom: '10px', letterSpacing: '2px' }}>
                            &gt;&gt; {data.type.toUpperCase()} &lt;&lt;
                        </div>
                        <h2 className="hud-text" style={{ fontSize: '22px', color: 'white', letterSpacing: '1px', margin: 0, lineHeight: '1.2' }}>
                            {data.title}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{
                            background: 'rgba(255,0,0,0.1)',
                            border: '1px solid var(--text-neon-red)',
                            color: 'var(--text-neon-red)',
                            padding: '6px 16px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-hud)',
                            fontSize: '11px',
                            borderRadius: '2px',
                            transition: 'all 0.2s ease',
                            marginLeft: '20px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--text-neon-red)';
                            e.currentTarget.style.color = 'black';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,0,0,0.1)';
                            e.currentTarget.style.color = 'var(--text-neon-red)';
                        }}
                    >
                        TERMINATE SESSION [X]
                    </button>
                </div>
                
                {/* Content */}
                <div style={{ 
                    padding: isVideo ? '0' : '32px 40px', 
                    overflowY: 'auto', 
                    color: 'var(--text-main)', 
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    flex: 1,
                    background: isVideo ? 'black' : 'transparent'
                }}>
                    {!isVideo && (
                        <>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                <span style={{ color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-hud)' }}>
                                    TIMESTAMP: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
                                </span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'var(--font-hud)' }}>
                                    ENCRYPTION: AES-256-GCM
                                </span>
                                <span style={{ color: 'var(--text-neon-green)', fontSize: '11px', fontFamily: 'var(--font-hud)' }}>
                                    STATUS: VERIFIED
                                </span>
                            </div>
                            
                            {data.content.split('\n').map((paragraph, idx) => (
                                paragraph.trim() ? <p key={idx} style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.9)' }}>{paragraph}</p> : <br key={idx} />
                            ))}
                            
                            {data.details && (
                                <div style={{ marginTop: '32px', padding: '20px', borderLeft: '3px solid var(--text-neon-amber)', background: 'rgba(255,170,0,0.03)', borderRadius: '0 4px 4px 0' }}>
                                    <div className="hud-text text-amber" style={{ fontSize: '11px', marginBottom: '12px', fontWeight: 'bold' }}>INTEL METADATA</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                        {Object.entries(data.details).map(([key, val]) => (
                                            <div key={key}>
                                                <div style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>{key.replace('_', ' ')}</div>
                                                <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>
                                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isVideo && (
                        <div style={{ width: '100%', height: '100%', aspectRatio: '16/9', background: 'black' }}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`${data.videoUrl}${data.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=0`} 
                                title={data.title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                style={{ border: 'none' }}
                            ></iframe>
                        </div>
                    )}
                </div>

                {/* Footer status line */}
                <div style={{ padding: '8px 24px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-hud)' }}>GLOBAL_NEWS_AI // CORE_V2.9.1</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-hud)' }}>CLEANUP_REQUIRED: FALSE</span>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
