import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ hudData }) => {
  const warZones = hudData?.warZones || [];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      {/* Global dark background style override within MapContainer is handled via standard leaflet classes or inline */}
      <MapContainer 
        center={[25, 30]} 
        zoom={3} 
        style={{ height: '100%', width: '100%', background: 'var(--bg-dark)' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />

        {warZones.map((zone) => {
          const isCritical = zone.severity?.includes('Critical');
          const isHigh = zone.severity?.includes('High');
          const color = isCritical || isHigh ? 'var(--text-neon-red)' : 'var(--text-neon-amber)';
          const pulseClass = isCritical ? 'pulse-red' : (isHigh ? 'pulse-amber' : '');

          return (
            <CircleMarker 
              key={`war-${zone.id}`}
              center={[zone.lat, zone.lon]}
              radius={isCritical ? 12 : 8}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: isCritical ? 0.8 : 0.6,
                weight: isCritical ? 3 : 2,
                className: pulseClass
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                 <div style={{ background: 'var(--bg-panel-solid)', color: 'var(--text-main)', padding: '6px 10px', fontFamily: 'var(--font-hud)', border: `1px solid ${color}`, borderRadius: '4px', boxShadow: `0 0 10px ${color}` }}>
                   <div style={{ color, fontWeight: 'bold', fontSize: '12px', borderBottom: `1px solid ${color}33`, marginBottom: '4px' }}>[WAR ZONE] {zone.name.toUpperCase()}</div>
                   <div style={{ fontSize: '9px' }}>STATUS: {zone.status}</div>
                   <div style={{ fontSize: '9px', color }}>SEVERITY: {zone.severity}</div>
                 </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {(hudData?.cyberAttacks || []).map((attack, idx) => {
          const color = attack.severity === 'Critical' ? 'var(--text-neon-red)' : 'var(--text-neon-amber)';
          return (
            <CircleMarker 
              key={`cyber-${idx}`}
              center={[attack.lat, attack.lon]}
              radius={6}
              pathOptions={{
                color: '#ff3300',
                fillColor: '#ff3300',
                fillOpacity: 0.7,
                weight: 1,
                dashArray: '2, 4'
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                 <div style={{ background: 'rgba(10, 5, 15, 0.95)', color: 'white', padding: '6px 10px', fontFamily: 'var(--font-hud)', border: '1px solid #ff3300', borderRadius: '4px' }}>
                   <div style={{ color: '#ff3300', fontWeight: 'bold', fontSize: '11px' }}>[CYBER THREAT] {attack.target}</div>
                   <div style={{ fontSize: '9px', color: '#94a3b8' }}>Type: {attack.type}</div>
                   <div style={{ fontSize: '9px', color: '#94a3b8' }}>Origin: {attack.origin}</div>
                 </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
