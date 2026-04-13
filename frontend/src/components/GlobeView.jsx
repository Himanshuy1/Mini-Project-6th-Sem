import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

// SVG Icon Library
const ICONS = {
    nuclear: `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="11" fill="#eab308" stroke="black" stroke-width="0.5"/>
            <path d="M12 12 L12 2 A10 10 0 0 1 20.66 7 L12 12 Z" fill="black"/>
            <path d="M12 12 L3.34 7 A10 10 0 0 1 12 2 L12 12 Z" fill="black" transform="rotate(120 12 12)"/>
            <path d="M12 12 L3.34 7 A10 10 0 0 1 12 2 L12 12 Z" fill="black" transform="rotate(240 12 12)"/>
            <circle cx="12" cy="12" r="3" fill="#eab308"/>
            <circle cx="12" cy="12" r="2" fill="black"/>
        </svg>
    `,
    base: `
        <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M12 2 L22 20 L2 20 Z" fill="#3b82f6" stroke="white" stroke-width="1"/>
            <path d="M12 8 L12 16 M8 12 L16 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    fleet: `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="11" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="2 1"/>
            <path d="M4 14 L20 14 L18 18 L6 18 Z" fill="#ef4444"/>
            <path d="M8 14 L8 10 L12 10 L12 14" fill="#ef4444"/>
        </svg>
    `,
    shield: `
        <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M12 2 L4 5 L4 11 C4 16.5 7.5 21.3 12 23 C16.5 21.3 20 16.5 20 11 L20 5 Z" fill="#ef4444" stroke="white" stroke-width="1"/>
            <path d="M9 12 L11 14 L15 10" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    spiral: `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2 A10 10 0 0 1 22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 12 2" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 2"/>
            <path d="M12 7 A5 5 0 0 1 17 12 A5 5 0 0 1 12 17 A5 5 0 0 1 7 12 A5 5 0 0 1 12 7" fill="#a855f7" opacity="0.6"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
    `,
    plane: `
        <svg viewBox="0 0 24 24" width="20" height="20" transform="rotate(45)">
            <path d="M21 16 L21 14 L13 9 L13 3.5 C13 2.67 12.33 2 11.5 2 C10.67 2 10 2.67 10 3.5 L10 9 L2 14 L2 16 L10 13.5 L10 19 L8 20.5 L8 22 L11.5 21 L15 22 L15 20.5 L13 19 L13 13.5 Z" fill="white"/>
        </svg>
    `
};

const GlobeView = ({ hudData }) => {
    const globeRef = useRef();

    // Combined Intelligence Feed
    const allMarkers = useMemo(() => {
        if (!hudData) return [];

        const warZones = (hudData.warZones || []).map(z => ({ ...z, type: 'WAR ZONE', label: z.name, detail: z.status }));
        const cyber = (hudData.cyberAttacks || []).map(c => ({ ...c, type: 'CYBER ALERT', label: c.target, detail: `${c.type} from ${c.origin}` }));
        const climate = (hudData.climateAnomaliesList || []).map(cl => ({ ...cl, type: 'CLIMATE ANOMALY', label: cl.zone, detail: `Temp: ${cl.temp}` }));
        const flights = (hudData.airlineIntel || []).map(f => ({ ...f, type: 'AIRSPACE INTEL', label: f.region, detail: f.status }));

        return [...warZones, ...cyber, ...climate, ...flights];
    }, [hudData]);

    const rings = useMemo(() => {
        return allMarkers
            .filter(m => m.severity?.includes('Critical') || m.severity?.includes('High') || m.defcon <= 2)
            .map(m => ({
                lat: m.lat,
                lng: m.lon,
                color: m.markerType === 'nuclear' || m.markerType === 'shield' ? '#ef4444' : '#ffaa00',
                maxR: 5,
                propagationSpeed: 2
            }));
    }, [allMarkers]);

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.pointOfView({ lat: 20, lng: 40, altitude: 2 }, 2000);
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 1.0;
        }
    }, []);

    const arcs = useMemo(() => {
        return (hudData?.cyberAttacks || []).map(c => ({
            startLat: c.originLat,
            startLng: c.originLon,
            endLat: c.lat,
            endLng: c.lon,
            color: '#ef4444'
        }));
    }, [hudData]);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Globe
                ref={globeRef}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                htmlElementsData={allMarkers}
                htmlElement={(d) => {
                    const el = document.createElement('div');
                    const iconSvg = ICONS[d.markerType] || ICONS.base;
                    el.innerHTML = `
                        <div style="cursor: pointer; position: relative;">
                            <div class="hud-marker" style="transform: translate(-50%, -50%);">
                                ${iconSvg}
                            </div>
                            <div class="globe-tooltip" style="
                                position: absolute;
                                bottom: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: rgba(6, 8, 12, 0.95);
                                border: 1px solid rgba(255,255,255,0.2);
                                border-left: 3px solid ${d.markerType === 'nuclear' ? '#ef4444' : '#3b82f6'};
                                padding: 8px 12px;
                                border-radius: 4px;
                                font-family: 'Space Mono', monospace;
                                font-size: 10px;
                                white-space: nowrap;
                                display: none;
                                z-index: 1000;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                            ">
                                <span style="color: #94a3b8; font-size: 8px;">[ ${d.type} ]</span><br/>
                                <span style="color: white; font-weight: bold; font-size: 11px;">${d.label.toUpperCase()}</span><br/>
                                <span style="color: var(--text-neon-amber);">${d.detail}</span>
                            </div>
                        </div>
                    `;
                    el.style.pointerEvents = 'auto';
                    el.onmouseenter = () => { el.querySelector('.globe-tooltip').style.display = 'block'; };
                    el.onmouseleave = () => { el.querySelector('.globe-tooltip').style.display = 'none'; };
                    return el;
                }}

                arcsData={arcs}
                arcColor={d => d.color}
                arcDashLength={0.4}
                arcDashGap={4}
                arcDashAnimateTime={2000}
                arcStroke={0.5}

                ringsData={rings}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod={2000}
                ringColor={d => d.color}

                showAtmosphere={true}
                atmosphereColor="#224488"
                atmosphereAltitude={0.25}
            />
        </div>
    );
};

export default GlobeView;
