import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    MapPin,
    Search,
    RotateCcw,
    Trash2,
    CheckCircle2,
    Sparkles,
    Navigation,
    Info,
    ExternalLink,
    Maximize2,
    Minimize2
} from 'lucide-react';

const DEFAULT_CENTER = { lat: -7.638359, lng: 112.016330, zoom: 12 }; // Warujayeng HQ Default

/**
 * Custom Pin Marker Icon for Admin Map Picker
 */
function createAdminPickerIcon(isHQ = false) {
    const iconHtml = `
        <div class="custom-admin-pin flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform hover:scale-110">
            <div class="w-9 h-9 rounded-2xl ${
                isHQ 
                    ? 'bg-slate-950 border-2 border-amber-400 text-amber-300 shadow-xl' 
                    : 'bg-[#800020] border-2 border-white text-white shadow-xl'
            } flex items-center justify-center font-bold p-1 shadow-rose-950/40">
                <div class="flex flex-col items-center justify-center">
                    <span class="text-[8px] font-black uppercase font-['Raleway'] leading-none">DC</span>
                    <span class="text-[6px] font-semibold opacity-90 leading-none mt-0.5">${isHQ ? 'HQ' : 'PIN'}</span>
                </div>
            </div>
            <div class="w-2.5 h-2.5 ${isHQ ? 'bg-slate-950 border-r-2 border-b-2 border-amber-400' : 'bg-[#800020] border-r-2 border-b-2 border-white'} rotate-45 -mt-1.5 shadow-sm"></div>
        </div>
    `;

    return L.divIcon({
        className: 'dancell-admin-picker-marker',
        html: iconHtml,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -44]
    });
}

/**
 * Helper: Parse Latitude & Longitude from multiple formats (e.g. Google Maps URL, raw comma string)
 */
export function parseCoordinates(inputStr) {
    if (!inputStr || typeof inputStr !== 'string') return null;
    const cleanStr = inputStr.trim();

    // 1. Check Google Maps URL format (e.g. @-7.638359,112.016330 or ?q=-7.638359,112.016330)
    const urlMatch = cleanStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || cleanStr.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (urlMatch) {
        return {
            lat: parseFloat(urlMatch[1]).toFixed(6),
            lng: parseFloat(urlMatch[2]).toFixed(6)
        };
    }

    // 2. Check comma / space separated lat, lng (e.g. "-7.638359, 112.016330" or "-7.638359 112.016330")
    const coordMatch = cleanStr.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (coordMatch) {
        return {
            lat: parseFloat(coordMatch[1]).toFixed(6),
            lng: parseFloat(coordMatch[2]).toFixed(6)
        };
    }

    return null;
}

export default function BranchLocationPicker({
    latitude = '',
    longitude = '',
    onChangeCoordinates = () => {},
    isHQ = false,
    branchName = '',
    address = '',
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [pasteInput, setPasteInput] = useState('');
    const [pasteSuccess, setPasteSuccess] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hasCoords = Boolean(
        latitude && 
        longitude && 
        !isNaN(parseFloat(latitude)) && 
        !isNaN(parseFloat(longitude))
    );

    const curLat = hasCoords ? parseFloat(latitude) : DEFAULT_CENTER.lat;
    const curLng = hasCoords ? parseFloat(longitude) : DEFAULT_CENTER.lng;

    // 1. Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [curLat, curLng],
                zoom: hasCoords ? 15 : DEFAULT_CENTER.zoom,
                minZoom: 7,
                maxZoom: 19,
                zoomControl: false,
                scrollWheelZoom: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Click anywhere on map to position the marker
            map.on('click', (e) => {
                const newLat = e.latlng.lat.toFixed(6);
                const newLng = e.latlng.lng.toFixed(6);
                onChangeCoordinates(newLat, newLng);
            });

            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 2. Synchronize Draggable Marker on Coordinate / State Change
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (hasCoords) {
            const pos = [parseFloat(latitude), parseFloat(longitude)];

            if (!markerRef.current) {
                const marker = L.marker(pos, {
                    icon: createAdminPickerIcon(isHQ),
                    draggable: true,
                    autoPan: true
                });

                marker.on('dragend', (e) => {
                    const latlng = e.target.getLatLng();
                    onChangeCoordinates(latlng.lat.toFixed(6), latlng.lng.toFixed(6));
                });

                marker.bindPopup(`
                    <div class="text-xs p-1 text-slate-800 font-['Raleway']">
                        <strong class="block text-slate-900">${branchName || 'Lokasi Outlet'}</strong>
                        <span class="text-[10px] text-slate-500">${address || 'Geser pin ini untuk ubah lokasi'}</span>
                    </div>
                `);

                marker.addTo(map);
                markerRef.current = marker;
            } else {
                markerRef.current.setIcon(createAdminPickerIcon(isHQ));
                markerRef.current.setLatLng(pos);
            }
        } else {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
        }
    }, [latitude, longitude, isHQ, branchName, address, hasCoords]);

    // Handle Manual Coordinate Change from Inputs
    const handleLatChange = (val) => {
        onChangeCoordinates(val, longitude);
        if (val && longitude && !isNaN(parseFloat(val)) && !isNaN(parseFloat(longitude)) && mapInstanceRef.current) {
            mapInstanceRef.current.panTo([parseFloat(val), parseFloat(longitude)], { animate: true });
        }
    };

    const handleLngChange = (val) => {
        onChangeCoordinates(latitude, val);
        if (latitude && val && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(val)) && mapInstanceRef.current) {
            mapInstanceRef.current.panTo([parseFloat(latitude), parseFloat(val)], { animate: true });
        }
    };

    // Quick Paste Parser (e.g. from Google Maps)
    const handleQuickPaste = (e) => {
        const text = e.target.value;
        setPasteInput(text);

        const parsed = parseCoordinates(text);
        if (parsed) {
            onChangeCoordinates(parsed.lat, parsed.lng);
            setPasteSuccess(true);
            setTimeout(() => setPasteSuccess(false), 2500);

            if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([parseFloat(parsed.lat), parseFloat(parsed.lng)], 16, { duration: 1 });
            }
        }
    };

    // Clear Coordinates
    const handleClearCoords = () => {
        onChangeCoordinates('', '');
        setPasteInput('');
    };

    // Reset Map View
    const handleResetCenter = () => {
        if (mapInstanceRef.current) {
            if (hasCoords) {
                mapInstanceRef.current.flyTo([parseFloat(latitude), parseFloat(longitude)], 15, { duration: 1 });
            } else {
                mapInstanceRef.current.flyTo([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_CENTER.zoom, { duration: 1 });
            }
        }
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 250);
    };

    return (
        <div className="space-y-4 font-['Raleway'] pt-4 border-t border-slate-100">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-50 text-[#800020] border border-rose-100">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Titik Koordinat & Pin Peta (Leaflet)</span>
                            {hasCoords ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                    Aktif di Peta
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">
                                    Tidak Tampil di Peta
                                </span>
                            )}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            Klik pada peta atau ketik koordinat presisi agar outlet muncul di fitur peta landing page.
                        </p>
                    </div>
                </div>

                {hasCoords && (
                    <button
                        type="button"
                        onClick={handleClearCoords}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold transition-colors cursor-pointer border border-rose-200 self-start sm:self-auto"
                        title="Kosongkan koordinat agar cabang ini tidak muncul di peta"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus dari Peta</span>
                    </button>
                )}
            </div>

            {/* Smart Google Maps Quick Paste Helper Bar */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Tempel Cepat dari Google Maps (One-Click Auto Parse):</span>
                    </label>
                    {pasteSuccess && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Koordinat berhasil dipasang!
                        </span>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tempel di sini: contoh '-7.638359, 112.016330' atau link Google Maps..."
                        value={pasteInput}
                        onChange={handleQuickPaste}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                    />
                    {pasteInput && (
                        <button
                            type="button"
                            onClick={() => setPasteInput('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>💡 Tips: Klik kanan di Google Maps &gt; Klik angka koordinat &gt; Paste di kolom atas.</span>
                </div>
            </div>

            {/* Manual Lat & Long Two-Column Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                        Latitude (Garis Lintang)
                    </label>
                    <input
                        type="text"
                        placeholder="Contoh: -7.638359"
                        value={latitude || ''}
                        onChange={(e) => handleLatChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                        Longitude (Garis Bujur)
                    </label>
                    <input
                        type="text"
                        placeholder="Contoh: 112.016330"
                        value={longitude || ''}
                        onChange={(e) => handleLngChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                    />
                </div>
            </div>

            {/* Interactive Leaflet Map Picker Canvas */}
            <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 transition-all duration-300 ${
                isFullscreen ? 'fixed inset-4 z-[999999] h-[calc(100vh-32px)]' : 'w-full h-[280px] sm:h-[320px]'
            }`}>
                {/* Map Container */}
                <div ref={mapContainerRef} className="w-full h-full z-10" />

                {/* Map Overlay Badge (Top-Left) */}
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/60 shadow-md text-[11px] font-medium">
                        <span className={`w-2 h-2 rounded-full ${hasCoords ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        <span>{hasCoords ? `${latitude}, ${longitude}` : 'Klik pada peta untuk pasang pin'}</span>
                    </div>
                </div>

                {/* Map Floating Controls (Top-Right) */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleResetCenter}
                        className="p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#800020] border border-slate-200 shadow-md transition-all cursor-pointer text-xs font-semibold flex items-center gap-1"
                        title="Pusatkan Peta"
                    >
                        <RotateCcw className="w-3.5 h-3.5 text-[#800020]" />
                        <span className="hidden sm:inline text-[11px]">Pusatkan</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#800020] border border-slate-200 shadow-md transition-all cursor-pointer"
                        title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                    >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
                * Catatan: Jika kolom Latitude &amp; Longitude dikosongkan, outlet cabang ini tetap tersimpan normal namun otomatis <strong>tidak akan ditampilkan di peta interaktif</strong>.
            </p>
        </div>
    );
}
