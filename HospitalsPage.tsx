import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  Search,
  Filter,
  Building2,
  Bed,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  List,
  Map as MapIcon,
  PhoneCall,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { Hospital } from '../types';

export const HospitalsPage: React.FC = () => {
  const { t } = useLanguage();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Default Map center: Shamshabad / Telangana rural region
  const [mapCenter, setMapCenter] = useState({ lat: 17.2582, lng: 78.3965 });
  const [mapZoom, setMapZoom] = useState(10);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await api.getHospitals({
        search: searchQuery,
        type: selectedType,
        district: selectedDistrict,
        userLat: userLocation?.lat,
        userLng: userLocation?.lng,
      });
      setHospitals(data);
      if (data.length > 0 && !selectedHospital) {
        setSelectedHospital(data[0]);
      }
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [selectedType, selectedDistrict, userLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHospitals();
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(12);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSelectHospital = (h: Hospital) => {
    setSelectedHospital(h);
    setMapCenter({ lat: h.lat, lng: h.lng });
    setMapZoom(13);
  };

  // Color helper for facility pin
  const getPinColor = (type: string) => {
    switch (type) {
      case 'District Hospital':
        return '#dc2626'; // red
      case 'CHC':
        return '#7c3aed'; // purple
      case 'PHC':
        return '#0284c7'; // sky blue
      case 'Jan Aushadhi':
        return '#059669'; // emerald
      default:
        return '#d97706'; // amber
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Healthcare Facility Locator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('hospitalsTitle')}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
            {t('hospitalsSubtitle')}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={locating}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 text-emerald-700 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detecting...' : t('useMyLocation')}</span>
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-stone-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Type:
          </span>
          {[
            { id: 'all', label: t('allTypes') },
            { id: 'PHC', label: 'PHC' },
            { id: 'CHC', label: 'CHC' },
            { id: 'District Hospital', label: 'District Hosp' },
            { id: 'Jan Aushadhi', label: 'Jan Aushadhi' },
            { id: 'Sub-Centre', label: 'Sub-Centre' },
            { id: 'Clinic', label: 'Clinic' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedType(item.id)}
              className={`px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                selectedType === item.id
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          <span className="text-stone-300 mx-1">|</span>

          {/* District selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50 font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Districts</option>
            <option value="Ranga Reddy">Ranga Reddy</option>
            <option value="Mahabubnagar">Mahabubnagar</option>
            <option value="Vikarabad">Vikarabad</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Hospital Cards List (Scrollable) */}
        <div className={`${viewMode === 'map' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3 max-h-[680px] overflow-y-auto pr-1`}>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Found {hospitals.length} Healthcare Facilities</span>
            {userLocation && <span className="text-emerald-700">Sorted by Nearest Distance</span>}
          </div>

          {loading ? (
            <div className="p-8 text-center text-stone-500 text-sm">Loading verified healthcare centres...</div>
          ) : hospitals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
              No medical facilities matched your query. Try resetting filters.
            </div>
          ) : (
            hospitals.map((h) => {
              const isSelected = selectedHospital?._id === h._id;
              return (
                <div
                  key={h._id}
                  onClick={() => handleSelectHospital(h)}
                  className={`bg-white rounded-2xl border transition p-4 cursor-pointer shadow-xs ${
                    isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                          style={{ backgroundColor: getPinColor(h.facilityType) }}
                        >
                          {h.facilityType}
                        </span>
                        {h.emergency24x7 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            24x7 Emergency
                          </span>
                        )}
                        {h.ayushmanEmpanelled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            PM-JAY
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base mt-1.5">
                        {h.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                        <span>{h.address}</span>
                      </p>
                    </div>

                    {h.distanceKm !== undefined && (
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          {h.distanceKm} km
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Badges / Stats */}
                  <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                    {h.beds > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-stone-400" />
                        <span>{h.beds} {t('bedsAvailable')}</span>
                      </span>
                    )}
                    {h.oxygenAvailable && (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Wind className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Oxygen Ready</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 truncate text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{h.timings.split(',')[0]}</span>
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${h.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('callNow')}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('getDirections')}</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Google Map View */}
        {viewMode === 'map' && (
          <div className="lg:col-span-7 h-[500px] lg:h-[680px] rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative">
            {apiKey ? (
              <APIProvider apiKey={apiKey} libraries={['marker']}>
                <Map
                  mapId="bf51a910020fa25a"
                  center={mapCenter}
                  zoom={mapZoom}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                  className="w-full h-full"
                >
                  {/* Markers for hospitals */}
                  {hospitals.map((h) => (
                    <AdvancedMarker
                      key={h._id}
                      position={{ lat: h.lat, lng: h.lng }}
                      onClick={() => handleSelectHospital(h)}
                      title={h.name}
                    >
                      <Pin
                        background={getPinColor(h.facilityType)}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={selectedHospital?._id === h._id ? 1.2 : 1.0}
                      />
                    </AdvancedMarker>
                  ))}

                  {/* Marker for current user position */}
                  {userLocation && (
                    <AdvancedMarker position={userLocation} title="Your Location">
                      <Pin background="#2563eb" borderColor="#ffffff" glyphColor="#ffffff" />
                    </AdvancedMarker>
                  )}

                  {/* InfoWindow for selected hospital */}
                  {selectedHospital && (
                    <InfoWindow
                      position={{ lat: selectedHospital.lat, lng: selectedHospital.lng }}
                      onCloseClick={() => setSelectedHospital(null)}
                    >
                      <div className="p-1 max-w-xs text-stone-900">
                        <div className="text-[10px] font-bold uppercase text-emerald-700 mb-0.5">
                          {selectedHospital.facilityType} • {selectedHospital.district}
                        </div>
                        <h4 className="font-bold text-sm leading-tight text-stone-900">
                          {selectedHospital.name}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1">{selectedHospital.address}</p>
                        <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-stone-200">
                          <a
                            href={`tel:${selectedHospital.phone}`}
                            className="font-bold text-emerald-700 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {selectedHospital.phone}
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-700 font-semibold hover:underline"
                          >
                            Route →
                          </a>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center p-6 text-center text-stone-500">
                <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
                <p className="text-sm font-semibold">Google Maps API key not initialized.</p>
                <p className="text-xs max-w-sm mt-1">
                  You can view all facilities in the list view on the left with directions and phone contacts.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
