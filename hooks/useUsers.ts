
import { useState, useEffect, useCallback } from 'react';
import type { User, NewUser } from '../types';

const STORAGE_KEY = 'business_directory_users';

// Bounding box for Germany for random coordinates (fallback)
const MIN_LAT = 47.2;
const MAX_LAT = 55.0;
const MIN_LNG = 5.8;
const MAX_LNG = 15.0;

// Geocoding function using Nominatim (free, no API key required)
const geocodeAddress = async (user: NewUser): Promise<{lat: number; lng: number} | null> => {
  const { street, houseNumber, postalCode, city } = user;
  const addressQuery = [street, houseNumber, postalCode, city].filter(Boolean).join(', ');

  // Only attempt to geocode if there is an address query
  if (!addressQuery) {
    return null;
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`;
  
  try {
    // Nominatim requires a User-Agent header for its usage policy
    const response = await fetch(url, { headers: { 'User-Agent': 'BusinessDirectoryMapApp/1.0 (for-a-project)' } });
    if (!response.ok) {
      console.error('Nominatim API request failed with status:', response.status);
      return null;
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon), // Nominatim uses 'lon' for longitude
      };
    }
    return null; // Address not found by Nominatim
  } catch (error) {
    console.error('Error during geocoding fetch:', error);
    return null;
  }
};


export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Failed to load users from localStorage', error);
      setUsers([]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error('Failed to save users to localStorage', error);
      }
    }
  }, [users, isInitialized]);

  const addUser = useCallback(async (newUser: NewUser) => {
    let coords;
    const hasAddress = newUser.street || newUser.city || newUser.postalCode;

    if (hasAddress) {
      coords = await geocodeAddress(newUser);
      if (!coords) {
        // Throw error to be caught by the UI, informing user address was not found
        throw new Error("Adresse konnte nicht gefunden werden. Bitte überprüfen Sie die Eingabe.");
      }
    } else {
      // Fallback to random coordinates if no address is provided
      coords = {
        lat: Math.random() * (MAX_LAT - MIN_LAT) + MIN_LAT,
        lng: Math.random() * (MAX_LNG - MIN_LNG) + MIN_LNG,
      };
    }

    const userWithIdAndCoords: User = {
      ...newUser,
      id: crypto.randomUUID(),
      coords,
    };
    setUsers(prevUsers => [...prevUsers, userWithIdAndCoords]);
  }, []);

  const updateUser = useCallback(async (id: string, updatedUserData: NewUser) => {
    const originalUser = users.find(u => u.id === id);
    if (!originalUser) return;
    
    let coords = originalUser.coords;

    const addressChanged = originalUser.street !== updatedUserData.street ||
                             originalUser.houseNumber !== updatedUserData.houseNumber ||
                             originalUser.postalCode !== updatedUserData.postalCode ||
                             originalUser.city !== updatedUserData.city;

    const hasAddress = updatedUserData.street || updatedUserData.city || updatedUserData.postalCode;

    if (addressChanged) {
        if (hasAddress) {
             const newCoords = await geocodeAddress(updatedUserData);
             if (!newCoords) {
                 throw new Error("Die aktualisierte Adresse konnte nicht gefunden werden. Bitte überprüfen Sie die Eingabe.");
             }
             coords = newCoords;
        } else {
            // Address was removed, fallback to a random location
            coords = {
                lat: Math.random() * (MAX_LAT - MIN_LAT) + MIN_LAT,
                lng: Math.random() * (MAX_LNG - MIN_LNG) + MIN_LNG,
            };
        }
    }
    
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, ...updatedUserData, coords } : user
      )
    );
  }, [users]);


  const deleteUser = useCallback((id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  }, []);

  const overwriteUsers = useCallback(async (usersToImport: NewUser[]) => {
    const processedUsers: User[] = [];

    for (const userToImport of usersToImport) {
        let coords;
        const hasAddress = userToImport.street || userToImport.city || userToImport.postalCode;

        if (hasAddress) {
            coords = await geocodeAddress(userToImport);
            if (!coords) {
                console.warn(`Adresse für "${userToImport.name}" konnte nicht gefunden werden. Fallback zu zufälligen Koordinaten.`);
                coords = {
                    lat: Math.random() * (MAX_LAT - MIN_LAT) + MIN_LAT,
                    lng: Math.random() * (MAX_LNG - MIN_LNG) + MIN_LNG,
                };
            }
        } else {
            coords = {
                lat: Math.random() * (MAX_LAT - MIN_LAT) + MIN_LAT,
                lng: Math.random() * (MAX_LNG - MIN_LNG) + MIN_LNG,
            };
        }

        processedUsers.push({
            ...userToImport,
            id: crypto.randomUUID(),
            coords,
        });
    }
    
    setUsers(processedUsers);
  }, []);

  return { users, addUser, updateUser, deleteUser, overwriteUsers, isInitialized };
};