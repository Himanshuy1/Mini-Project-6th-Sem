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
          const isCritical = zone.severity.includes('Critical');
          const isHigh = zone.severity.includes('High');
          const color = isCritical || isHigh ? 'var(--text-neon-red)' : 'var(--text-neon-amber)';
          const pulseClass = isCritical ? 'pulse-red' : (isHigh ? 'pulse-amber' : '');

          return (
            <CircleMarker 
              key={zone.id}
              center={[zone.lat, zone.lon]}
              radius={isCritical ? 12 : 8}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: isCritical ? 0.8 : 0.6,
                weight: isCritical ? 3 : 2,
                className: pulseClass // Leaflet takes className for SVG elements
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
                 <div style={{ 
                   background: 'var(--bg-panel-solid)', 
                   color: 'var(--text-main)', 
                   padding: '6px 10px',
                   fontFamily: 'var(--font-hud)',
                   border: `1px solid ${color}`,
                   borderRadius: '4px',
                   boxShadow: `0 0 10px ${color}`
                 }}>
                   <div style={{ color, fontWeight: 'bold', fontSize: '13px', borderBottom: `1px solid ${color}33`, marginBottom: '4px' }}>
                     {zone.name.toUpperCase()}
                   </div>
                   <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                     STATUS: <span style={{ color: 'var(--text-main)' }}>{zone.status}</span>
                   </div>
                   <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                     SEVERITY: <span style={{ color }}>{zone.severity}</span>
                   </div>
                   <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                     DEFCON: <span style={{ color: isCritical ? 'var(--text-neon-red)' : 'var(--text-neon-amber)' }}>{zone.defcon}</span>
                   </div>
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
