import React from 'react';

const HUDSidebarLeft = ({ data, onItemClick }) => {
  const airlineIntel = data?.airlineIntel || [];
  const warZones = data?.warZones || [];
  const cyberAttacks = data?.cyberAttacks || [];

  return (
    <div className="glass-panel" style={{
      pointerEvents: 'auto',
      width: '280px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(15,17,26,0.95)',
      border: 'none',
      borderRight: '1px solid var(--bg-panel-border)',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bg-panel-border)' }}>
          <h3 className="hud-text" style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--text-main)' }}>GLOBAL SITUATION</h3>
      </div>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Active Conflict Zones */}
        <div>
           <span className="hud-text text-dim" style={{ fontSize: '10px', marginBottom: '8px', display: 'block' }}>ACTIVE KINETIC ZONES</span>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {warZones.map((z, i) => (
                  <div 
                    key={i} 
                    onClick={() => onItemClick && onItemClick({
                        title: `Conflict Alert: ${z.name}`,
                        type: "KINETIC ZONE INTEL",
                        content: `Intelligence report for ${z.name} zone.\n\nCurrent Status: ${z.status}.\nSeverity Level: ${z.severity}.\n\nField reports indicate sustained activity in the peripheral sectors. Civilian displacement is rising as infrastructure continues to sustain damage. Local government forces are attempting to establish secure corridors, but progress is hampered by active resistance. \n\nSatellite monitoring shows troop movements consistent with a tactical repositioning phase. Electronic signatures suggest an increase in localized jamming efforts.`,
                        details: {
                            region: z.name,
                            coordinates: `${z.lat}, ${z.lon}`,
                            defcon_link: z.defcon,
                            status: z.status
                        }
                    })}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '6px 8px', 
                      borderRadius: '4px', 
                      borderLeft: `2px solid ${z.severity.includes('High') ? 'var(--text-neon-red)' : 'var(--text-neon-amber)'}`,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                      <span className="hud-text" style={{ fontSize: '11px' }}>{z.name}</span>
                      <span className="hud-text" style={{ fontSize: '9px', color: z.severity.includes('High') ? 'var(--text-neon-red)' : 'var(--text-neon-amber)' }}>{z.severity}</span>
                  </div>
              ))}
           </div>
        </div>


        {/* Cyber Attacks */}
        <div>
           <span className="hud-text text-dim" style={{ fontSize: '10px', marginBottom: '8px', display: 'block' }}>CYBER SECURITY THREATS</span>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             {cyberAttacks.map((attack, idx) => (
               <div 
                 key={idx} 
                 onClick={() => onItemClick && onItemClick({
                    title: `Cyber Threat Alert: ${attack.target}`,
                    type: `CYBER THREAT: ${attack.type}`,
                    content: `System actively tracking a highly coordinated ${attack.type} campaign impacting the ${attack.target}.\n\nOrigin traced to suspected state-affiliated actors in ${attack.origin}. The severity is categorized as ${attack.severity} with the current status marked as [${attack.status}].\n\nSecondary proxy networks are being isolated to prevent lateral movement.`,
                    details: {
                      Attack_Vector: attack.type,
                      IP_Origin: "Spoofed / Multiple",
                      Status: attack.status,
                      Severity: attack.severity
                    }
                 })}
                 style={{ 
                   padding: '8px', 
                   background: 'rgba(255,170,0,0.05)', 
                   border: '1px solid rgba(255,170,0,0.2)', 
                   borderRadius: '4px', 
                   borderLeft: `2px solid ${attack.severity === 'Critical' ? 'var(--text-neon-red)' : 'var(--text-neon-amber)'}`,
                   cursor: 'pointer',
                   transition: 'background 0.2s ease'
                 }}
                 onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,170,0,0.1)' }
                 onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,170,0,0.05)' }
               >
                 <div className="hud-text" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
                     <span style={{ color: 'white' }}>{attack.target}</span>
                     <span style={{ color: attack.severity === 'Critical' ? 'var(--text-neon-red)' : 'var(--text-neon-amber)' }}>{attack.type}</span>
                 </div>
                 <div className="hud-text" style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                     Origin: {attack.origin} | Status: <span style={{ color: 'white' }}>{attack.status}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
      
      <div style={{ marginTop: 'auto', padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-hud)', borderTop: '1px solid var(--bg-panel-border)' }}>
          System Data Stream: SECURE
      </div>
    </div>
  );
};

export default HUDSidebarLeft;
