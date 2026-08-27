import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Navigation, 
    Store, 
    Crown, 
    Clock, 
    Phone, 
    MessageCircle, 
    RotateCcw, 
    Maximize2, 
    Minimize2, 
    Layers,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

// 1-to-1 Exact Order-Based Mapping for Dancell 58 Branches from Google Maps
const ORDER_BRANCH_COORDINATES = {
    1: [-7.638359391912256, 112.0163306693161], // DANCELL POM (PUSAT WARUJAYENG)
    2: [-7.628629851630138, 112.01720617465709], // DANCELL SONGO
    3: [-7.66297236536752, 112.01345537176152], // DANCELL GADING
    4: [-7.597913597376363, 112.10545654554744], // DANCELL KERTOSONO
    5: [-7.611035613222933, 111.89946428708467], // DANCELL KOTA 1 (NYAWIJI)
    6: [-7.765827093969056, 112.18928098498219], // DANCELL PARE 1
    7: [-7.6318054336601415, 112.01799677899027], // DANCELL D'ROOFTOP
    8: [-7.765266020447935, 112.1968991780843], // DANCELL PARE 2
    9: [-7.6142063630023165, 111.89857306360342], // DANCELL KOTA 2 (PLOSO)
    10: [-7.7091320389938875, 112.1265354488241], // DANCELL BOGO
    11: [-7.54468888890164, 111.65769938492318], // DANCELL CARUBAN
    12: [-7.799594114737437, 112.03579111421284], // DANCELL DLOPO
    13: [-7.80779094937369, 112.2590033657879], // DANCELL KEPUNG
    14: [-7.797718800503944, 112.00251941080299], // DANCELL MOJOROTO
    15: [-7.446142524997961, 112.2245927588721], // DANCELL PLOSO JOMBANG
    16: [-7.922587144388484, 112.12675381957837], // DANCELL WATES
    17: [-7.806971543390559, 112.08907630160473], // DANCELL GURAH
    18: [-7.5955119777067415, 112.10634699434138], // DANCELL KERTOSONO 2
    19: [-7.832278993289527, 112.04536140238741], // DANCELL PESANTREN
    20: [-7.526347445020971, 111.95122414736434], // DANCELL GONDANG
    21: [-7.660955779167953, 111.86977738665536], // DANCELL BERBEK
    22: [-7.98122067804304, 112.03439443694228], // DANCELL SAMBI
    23: [-7.536474686566878, 112.27722653438553], // DANCELL PETERONGAN
    24: [-7.753457236679215, 112.28184219359201], // DANCELL KANDANGAN
    25: [-8.063654847231973, 112.07149898595642], // DANCELL SRENGAT
    26: [-7.565918151132978, 112.34548204378326], // DANCELL MOJOAGUNG
    27: [-7.7440504184912005, 111.9612333581776], // DANCELL GRINGGING
    28: [-8.103412980848686, 112.00865713458752], // DANCELL NGUNUT
    29: [-7.689835038502193, 112.2728236282924], // DANCELL NGORO (JOMBANG)
    30: [-8.16965410814127, 111.78327346356356], // DANCELL BANDUNG (T AGUNG)
    31: [-8.06332256481888, 111.90277538353727], // DANCELL TULUNGAGUNG KOTA
    32: [-7.628800, 111.517500], // DANCELL MADIUN KOTA
    33: [-8.101476300554964, 112.16760253501093], // DANCELL BLITAR KOTA
    34: [-7.654324168591135, 111.33207977209918], // DANCELL MAGETAN
    35: [-7.527488214013373, 111.90745147443307], // DANCELL REJOSO
    36: [-7.498500, 112.428500], // DANCELL SOOKO
    37: [-8.17023585675328, 112.2163565942413], // DANCELL LODOYO
    38: [-7.585500, 111.854500], // DANCELL KEREP
    39: [-7.894533580086105, 111.96569017715953], // DANCELL MOJO
    40: [-7.562500, 112.482500], // DANCELL DLANGGU
    41: [-7.828297108621024, 111.98299805767142], // DANCELL SEMEN
    42: [-7.560581006580333, 111.45285664232857], // DANCELL BARAT
    43: [-7.821500, 111.998500], // DANCELL BANDAR
    44: [-7.628321271509169, 112.18983902883569], // DANCELL GUDO
    45: [-8.13230205440687, 112.22041805582145], // DANCELL KANIGORO
    46: [-7.705896840949533, 111.53630039815005], // DANCELL UTERAN
    47: [-8.135248139155646, 112.01549042698575], // DANCELL PANJER TULUNGAGUNG
    48: [-7.612478597324975, 112.47814468465717], // DANCELL POHJEJER
    49: [-8.058042544998553, 111.70807944232858], // DANCELL TRENGGALEK KOTA
    50: [-8.132424401043565, 111.70030242883571], // DANCELL GANDUSARI TRENGGALEK
    51: [-7.525418235414888, 112.5609952288357], // DANCELL MOJOSARI
    52: [-7.51854680598714, 111.25601892698576], // DANCELL JOGOROGO NGAWI
    53: [-8.107842622142853, 112.16723901534283], // DANCELL BLITAR 2
    54: [-7.864778802288946, 111.4751727711643], // DANCELL PONOROGO
    55: [-7.755367078577386, 111.52574247116429], // DANCELL DOLOPO
    56: [-7.419304934368551, 112.67307202698575], // DANCELL SUKODONO
    57: [-7.110989458044117, 112.16515272883571], // DANCELL BABAT
    58: [-7.349779377897316, 112.75148928650711], // DANCELL WEDORO
};

// Keyword Fallback Coordinates for Real-World Precision
const EXACT_BRANCH_COORDINATES = {
    "d'rooftop": [-7.6318054336601415, 112.01799677899027],
    'rooftop': [-7.6318054336601415, 112.01799677899027],
    'songo warujayeng': [-7.628629851630138, 112.01720617465709],
    'songo': [-7.628629851630138, 112.01720617465709],
    'pusat warujayeng': [-7.638359391912256, 112.0163306693161],
    'pom': [-7.638359391912256, 112.0163306693161],
    'warujayeng': [-7.638359391912256, 112.0163306693161],
    'kertosono 2': [-7.5955119777067415, 112.10634699434138],
    'kertosono': [-7.597913597376363, 112.10545654554744],
    'kota 1': [-7.611035613222933, 111.89946428708467],
    'nyawiji': [-7.611035613222933, 111.89946428708467],
    'kota 2': [-7.6142063630023165, 111.89857306360342],
    'ploso nganjuk': [-7.6142063630023165, 111.89857306360342],
    'ploso jombang': [-7.446142524997961, 112.2245927588721],
    'gading': [-7.66297236536752, 112.01345537176152],
    'prambon': [-7.66297236536752, 112.01345537176152],
    'pare 1': [-7.765827093969056, 112.18928098498219],
    'pare 2': [-7.765266020447935, 112.1968991780843],
    'dlopo': [-7.799594114737437, 112.03579111421284],
    'bogo': [-7.7091320389938875, 112.1265354488241],
    'mojoroto': [-7.797718800503944, 112.00251941080299],
    'bandar': [-7.821500, 111.998500],
    'kepung': [-7.80779094937369, 112.2590033657879],
    'gurah': [-7.806971543390559, 112.08907630160473],
    'wates': [-7.922587144388484, 112.12675381957837],
    'berbek': [-7.660955779167953, 111.86977738665536],
    'gondang': [-7.526347445020971, 111.95122414736434],
    'pesantren': [-7.832278993289527, 112.04536140238741],
    'kandangan': [-7.753457236679215, 112.28184219359201],
    'peterongan': [-7.536474686566878, 112.27722653438553],
    'sambi': [-7.98122067804304, 112.03439443694228],
    'gringging': [-7.7440504184912005, 111.9612333581776],
    'mojoagung': [-7.565918151132978, 112.34548204378326],
    'srengat': [-8.063654847231973, 112.07149898595642],
    'blitar 2': [-8.107842622142853, 112.16723901534283],
    'blitar kota': [-8.101476300554964, 112.16760253501093],
    'tulungagung kota': [-8.06332256481888, 111.90277538353727],
    'bandung': [-8.16965410814127, 111.78327346356356],
    'ngoro': [-7.689835038502193, 112.2728236282924],
    'ngunut': [-8.103412980848686, 112.00865713458752],
    'mojo': [-7.894533580086105, 111.96569017715953],
    'lodoyo': [-8.17023585675328, 112.2163565942413],
    'rejoso': [-7.527488214013373, 111.90745147443307],
    'kerep': [-7.585500, 111.854500],
    'magetan': [-7.654324168591135, 111.33207977209918],
    'kanigoro': [-8.13230205440687, 112.22041805582145],
    'gudo': [-7.628321271509169, 112.18983902883569],
    'barat': [-7.560581006580333, 111.45285664232857],
    'semen': [-7.828297108621024, 111.98299805767142],
    'mojosari': [-7.525418235414888, 112.5609952288357],
    'gandusari': [-8.132424401043565, 111.70030242883571],
    'trenggalek kota': [-8.058042544998553, 111.70807944232858],
    'trenggalek': [-8.058042544998553, 111.70807944232858],
    'pohjejer': [-7.612478597324975, 112.47814468465717],
    'panjer': [-8.135248139155646, 112.01549042698575],
    'uteran': [-7.705896840949533, 111.53630039815005],
    'caruban': [-7.54468888890164, 111.65769938492318],
    'madiun kota': [-7.628800, 111.517500],
    'dolopo': [-7.755367078577386, 111.52574247116429],
    'sooko': [-7.498500, 112.428500],
    'dlanggu': [-7.562500, 112.482500],
    'sukodono': [-7.419304934368551, 112.67307202698575],
    'wedoro': [-7.349779377897316, 112.75148928650711],
    'babat': [-7.110989458044117, 112.16515272883571],
    'ponorogo': [-7.864778802288946, 111.4751727711643],
    'jogorogo': [-7.51854680598714, 111.25601892698576]
};

// Geocoding Coordinates Baseline for East Java Cities & Districts Zoom Center
const CITY_COORDINATES = {
    'nganjuk': { lat: -7.6042, lng: 112.0298, zoom: 11 },
    'kediri': { lat: -7.8166, lng: 112.0118, zoom: 11 },
    'jombang': { lat: -7.5468, lng: 112.2331, zoom: 11 },
    'blitar': { lat: -8.0983, lng: 112.1681, zoom: 11 },
    'tulungagung': { lat: -8.0667, lng: 111.9000, zoom: 11 },
    'madiun': { lat: -7.6298, lng: 111.5239, zoom: 11 },
    'magetan': { lat: -7.6536, lng: 111.3283, zoom: 11 },
    'mojokerto': { lat: -7.4726, lng: 112.4381, zoom: 11 },
    'trenggalek': { lat: -8.0500, lng: 111.7167, zoom: 11 },
    'ngawi': { lat: -7.4039, lng: 111.4453, zoom: 11 },
    'ponorogo': { lat: -7.8686, lng: 111.4623, zoom: 11 },
    'lamongan': { lat: -7.1198, lng: 112.4154, zoom: 11 },
    'sidoarjo': { lat: -7.4478, lng: 112.7183, zoom: 11 },
};

// East Java Regional Center
const EAST_JAVA_CENTER = { lat: -7.7200, lng: 111.9800, zoom: 9 };

/**
 * Dynamic Coordinate Resolver for Dancell Branches
 * Returns [lat, lng] if valid coordinates exist in database or legacy order table, otherwise returns null.
 */
function resolveBranchCoordinates(branch, index) {
    // 1. Prioritize Real Database Latitude & Longitude
    if (branch.latitude && branch.longitude) {
        const lat = parseFloat(branch.latitude);
        const lng = parseFloat(branch.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            return [lat, lng];
        }
    }

    // 2. Legacy Order Mapping Fallback
    const branchOrder = branch.order || (index + 1);
    if (branchOrder && ORDER_BRANCH_COORDINATES[branchOrder]) {
        return ORDER_BRANCH_COORDINATES[branchOrder];
    }

    // 3. Fallback to Headquarters if explicitly marked as HQ
    if (branch.is_hq || branch.isHQ) {
        return [-7.638359391912256, 112.0163306693161];
    }

    // If no coordinates are defined, return null so it is excluded from the map
    return null;
}

/**
 * Create Custom Leaflet Marker Icon with Dancell Brand Styling
 */
function createDancellIcon(branch, isSelected = false) {
    const isHQ = branch.is_hq || branch.isHQ;
    
    const iconHtml = `
        <div class="custom-dancell-pin-wrapper relative flex flex-col items-center cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
            ${isHQ ? `
                <div class="absolute -inset-2 bg-rose-500/30 rounded-2xl animate-ping pointer-events-none"></div>
            ` : ''}
            
            <div class="w-10 h-10 rounded-2xl ${
                isHQ 
                    ? 'bg-slate-950 border-2 border-amber-400 text-amber-300 shadow-2xl shadow-amber-500/40' 
                    : isSelected 
                        ? 'bg-[#5c0017] border-2 border-amber-300 text-white shadow-2xl ring-4 ring-rose-500/30' 
                        : 'bg-[#800020] border-2 border-white text-white shadow-xl hover:shadow-2xl'
            } flex items-center justify-center font-bold overflow-hidden p-1.5 transition-colors">
                ${isHQ ? `
                    <svg class="w-5 h-5 fill-amber-300" viewBox="0 0 24 24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                    </svg>
                ` : `
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-[9px] font-black tracking-tighter uppercase font-['Raleway'] leading-none">DC</span>
                        <span class="text-[7px] font-semibold opacity-90 leading-none mt-0.5">STORE</span>
                    </div>
                `}
            </div>

            <!-- Pointer Triangle Tail -->
            <div class="w-2.5 h-2.5 ${isHQ ? 'bg-slate-950 border-r-2 border-b-2 border-amber-400' : 'bg-[#800020] border-r-2 border-b-2 border-white'} rotate-45 -mt-1.5 shadow-md"></div>
        </div>
    `;

    return L.divIcon({
        className: 'dancell-leaflet-marker',
        html: iconHtml,
        iconSize: [40, 48],
        iconAnchor: [20, 46],
        popupAnchor: [0, -48]
    });
}

export default function BranchMap({ 
    branches = [], 
    selectedCity = 'all',
    onSelectBranch = null,
    className = ""
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Compute coordinate points ONLY for branches that have valid coordinates
    const mappedBranches = useMemo(() => {
        return (branches || [])
            .map((branch, index) => {
                const coords = resolveBranchCoordinates(branch, index);
                if (!coords) return null; // Exclude branch without coordinates
                return {
                    ...branch,
                    resolvedLat: coords[0],
                    resolvedLng: coords[1],
                };
            })
            .filter(Boolean); // Filter out branches without coordinates
    }, [branches]);

    // 1. Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            // Leaflet Map Instance
            const map = L.map(mapContainerRef.current, {
                center: [EAST_JAVA_CENTER.lat, EAST_JAVA_CENTER.lng],
                zoom: EAST_JAVA_CENTER.zoom,
                minZoom: 8,
                maxZoom: 18,
                zoomControl: false,
                scrollWheelZoom: true,
            });

            // Standard Clean Tile Layer (Supports ENV config or free OSM default with zero watermark)
            const mapTileUrl = import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const mapAttribution = import.meta.env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

            L.tileLayer(mapTileUrl, {
                attribution: mapAttribution,
                subdomains: 'abc',
                maxZoom: 19
            }).addTo(map);

            // Add Zoom Control to Bottom-Right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Markers Layer Group
            const markersGroup = L.layerGroup().addTo(map);
            markersLayerRef.current = markersGroup;
            mapInstanceRef.current = map;
        }

        return () => {
            // Cleanup on unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const prevCityRef = useRef(selectedCity);

    // 2. Render Markers
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markersGroup = markersLayerRef.current;
        if (!map || !markersGroup) return;

        // Clear existing markers
        markersGroup.clearLayers();

        const filtered = selectedCity === 'all'
            ? mappedBranches
            : mappedBranches.filter(b => (b.city || '').toLowerCase() === selectedCity.toLowerCase());

        filtered.forEach((branch) => {
            const latLng = [branch.resolvedLat, branch.resolvedLng];

            const marker = L.marker(latLng, {
                icon: createDancellIcon(branch, false)
            });

            // Premium Popover HTML Card
            const isHQ = branch.is_hq || branch.isHQ;
            const popupContent = document.createElement('div');
            popupContent.className = 'font-[\'Raleway\'] text-slate-900 p-3.5 min-w-[250px] max-w-[290px] space-y-3';
            popupContent.innerHTML = `
                <div class="flex items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100">
                    <div class="flex items-center gap-1.5">
                        <span class="px-2.5 py-0.5 rounded-lg bg-rose-50 text-[#800020] text-[10px] font-bold uppercase tracking-wider border border-rose-100/80">
                            ${branch.city}
                        </span>
                        ${isHQ ? `
                            <span class="px-2 py-0.5 rounded-lg bg-[#800020] text-white text-[10px] font-bold uppercase shadow-2xs">
                                Pusat (HQ)
                            </span>
                        ` : ''}
                    </div>
                    <span class="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Buka
                    </span>
                </div>

                <div>
                    <h4 class="font-bold text-slate-900 text-sm leading-snug">
                        ${branch.name}
                    </h4>
                    <p class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        ${branch.address}
                    </p>
                </div>

                <div class="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                    <div class="flex items-center gap-1.5">
                        <span class="font-semibold text-slate-700">🕒 Jam:</span>
                        <span>${branch.opening_hours || 'Buka Setiap Hari (08.00 - 21.00 WIB)'}</span>
                    </div>
                    ${branch.phone ? `
                        <div class="flex items-center gap-1.5">
                            <span class="font-semibold text-slate-700">📞 CS:</span>
                            <span>${branch.phone}</span>
                        </div>
                    ` : ''}
                </div>

                <div class="pt-1.5 flex items-center gap-2">
                    ${branch.google_maps_url ? `
                        <a 
                            href="${branch.google_maps_url}" 
                            target="_blank" 
                            rel="noreferrer" 
                            class="flex-1 text-center py-2 px-3 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style="color: #ffffff !important; text-decoration: none !important; display: inline-block;"
                        >
                            Petunjuk Arah
                        </a>
                    ` : ''}
                    ${branch.whatsapp ? `
                        <a 
                            href="https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}" 
                            target="_blank" 
                            rel="noreferrer" 
                            class="py-2 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style="color: #047857 !important; text-decoration: none !important; display: inline-block;"
                            title="Chat WhatsApp Cabang"
                        >
                            WA
                        </a>
                    ` : ''}
                </div>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 310,
                className: 'dancell-modern-popup',
                autoPan: true,
                autoPanPadding: [50, 50],
                closeButton: true
            });

            markersGroup.addLayer(marker);
        });

        // 3. Smart Zoom & FlyTo ONLY when selectedCity changes
        if (prevCityRef.current !== selectedCity) {
            prevCityRef.current = selectedCity;
            if (selectedCity !== 'all' && CITY_COORDINATES[selectedCity.toLowerCase()]) {
                const target = CITY_COORDINATES[selectedCity.toLowerCase()];
                map.flyTo([target.lat, target.lng], target.zoom, { duration: 1.2 });
            } else {
                map.flyTo([EAST_JAVA_CENTER.lat, EAST_JAVA_CENTER.lng], EAST_JAVA_CENTER.zoom, { duration: 1.0 });
            }
        }

    }, [selectedCity, mappedBranches]);

    // Reset Map View Handler
    const handleResetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([EAST_JAVA_CENTER.lat, EAST_JAVA_CENTER.lng], EAST_JAVA_CENTER.zoom, { duration: 1.0 });
        }
    };

    // Fullscreen Toggle
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 200);
    };

    return (
        <div className={`relative rounded-[32px] overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 transition-all duration-300 font-['Raleway'] ${
            isFullscreen ? 'fixed inset-4 z-[999999] h-[calc(100vh-32px)]' : 'w-full h-[520px] sm:h-[580px]'
        } ${className}`}>
            
            {/* Map Canvas DOM Container */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Top-Left Floating Glass Header Status */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md text-white border border-slate-700/60 shadow-lg text-xs pointer-events-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-semibold text-white">
                        {selectedCity === 'all' ? 'Seluruh Jawa Timur' : `Kota ${selectedCity}`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#800020] text-white text-[10px] font-bold">
                        {selectedCity === 'all' ? `${branches.length} Outlet` : `${mappedBranches.filter(b => b.city?.toLowerCase() === selectedCity.toLowerCase()).length} Outlet`}
                    </span>
                </div>
            </div>

            {/* Top-Right Floating Controls (Reset View & Fullscreen) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleResetView}
                    className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#800020] border border-slate-200 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                    title="Pusatkan Peta Jawa Timur"
                >
                    <RotateCcw className="w-3.5 h-3.5 text-[#800020]" />
                    <span className="hidden sm:inline">Reset Posisi</span>
                </button>

                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#800020] border border-slate-200 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            {/* Bottom-Left Floating Legend */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-lg bg-slate-900 border border-amber-400 inline-block shadow-2xs"></span>
                    <span className="text-[11px] font-medium text-slate-800">Kantor Pusat (HQ)</span>
                </div>
                <div className="w-px h-3 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-lg bg-[#800020] border border-white inline-block shadow-2xs"></span>
                    <span className="text-[11px] font-medium text-slate-800">Outlet Cabang Resmi</span>
                </div>
            </div>

        </div>
    );
}
