import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

// Leaflet ist global verfügbar durch das Skript in index.html
declare const L: any;

interface MapViewProps {
  users: User[];
  onAddUser: () => void;
  onSelectUser: (user: User) => void;
  onAddQuestion: () => void;
  onAddSuggestion: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ users, onAddUser, onSelectUser, onAddQuestion, onAddSuggestion }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Karte initialisieren
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([51.1657, 10.4515], 6); // Zentrum Deutschlands

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Marker aktualisieren, wenn sich Benutzer ändern
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      const currentMarkerIds = Object.keys(markersRef.current);
      const userIds = users.map(u => u.id);

      // Marker für gelöschte Benutzer entfernen
      currentMarkerIds.forEach(markerId => {
        if (!userIds.includes(markerId)) {
          markersRef.current[markerId].remove();
          delete markersRef.current[markerId];
        }
      });

      // Marker für aktuelle Benutzer hinzufügen oder aktualisieren
      users.forEach(user => {
        if (!markersRef.current[user.id]) {
          const marker = L.marker(user.coords).addTo(map);

          marker.on('click', () => {
            onSelectUser(user);
          });

          // Popup für Hover-Effekt
          const popupContent = `
            <div class="font-sans text-gray-800">
              <p class="font-bold">${user.name}</p>
              <p class="text-xs text-gray-600">${user.company}</p>
            </div>
          `;
          marker.bindPopup(popupContent);
          
          marker.on('mouseover', function (this: any) {
            this.openPopup();
          });
          marker.on('mouseout', function (this: any) {
            this.closePopup();
          });


          markersRef.current[user.id] = marker;
        } else {
            // Update position if coordinates changed
            const marker = markersRef.current[user.id];
            const currentPos = marker.getLatLng();
            if (currentPos.lat !== user.coords.lat || currentPos.lng !== user.coords.lng) {
                marker.setLatLng(user.coords);
            }
        }
      });
    }
  }, [users, onSelectUser]);

  const handleFabClick = () => {
    setIsFabMenuOpen(prev => !prev);
  };

  const handleOptionClick = (action: () => void) => {
    action();
    setIsFabMenuOpen(false);
  };


  return (
    <div className="relative flex-grow w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" />

      {isFabMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setIsFabMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-4">
        {/* Speed dial options */}
        <div 
          className={`flex flex-col items-end gap-4 transition-all duration-300 ease-in-out ${
            isFabMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
            {/* Suggestion Button */}
            <div className="flex items-center gap-3">
                <span className="bg-gray-900 bg-opacity-80 text-white text-sm px-3 py-1 rounded-md shadow-lg">Vorschlag</span>
                <button
                    onClick={() => handleOptionClick(onAddSuggestion)}
                    className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    aria-label="Vorschlag machen"
                >
                    <LightBulbIcon className="w-6 h-6" />
                </button>
            </div>
            {/* Question Button */}
            <div className="flex items-center gap-3">
                 <span className="bg-gray-900 bg-opacity-80 text-white text-sm px-3 py-1 rounded-md shadow-lg">Frage</span>
                <button
                    onClick={() => handleOptionClick(onAddQuestion)}
                    className="flex items-center justify-center w-12 h-12 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    aria-label="Frage stellen"
                >
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>
            </div>
            {/* New Entry Button */}
            <div className="flex items-center gap-3">
                <span className="bg-gray-900 bg-opacity-80 text-white text-sm px-3 py-1 rounded-md shadow-lg">Neuer Eintrag</span>
                <button
                    onClick={() => handleOptionClick(onAddUser)}
                    className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Eintrag hinzufügen"
                >
                    <PencilSquareIcon className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Main FAB */}
        <button
          onClick={handleFabClick}
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={isFabMenuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isFabMenuOpen}
        >
          <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isFabMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
        </button>
      </div>
    </div>
  );
};
