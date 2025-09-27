
import React, { useState, useEffect } from 'react';
import type { User, NewUser } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: NewUser) => void;
  initialData?: User | null;
}

const emptyForm: NewUser = {
  name: '',
  company: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  website: '',
  description: '',
};

export const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<NewUser>(emptyForm);

  useEffect(() => {
    if (initialData) {
      // Ensure all fields from emptyForm are present to avoid uncontrolled component warnings
      setFormData({ ...emptyForm, ...initialData });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // onClose() is now called from the parent component upon successful submission
  };

  if (!isOpen) return null;

  const formTitle = initialData ? 'Eintrag bearbeiten' : 'Neuen Eintrag erstellen';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-6 m-4 bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{formTitle}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Firma <span className="text-red-500">*</span></label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
            </div>
             <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Webseite</label>
              <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://beispiel.de" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
            </div>
          </div>
          
          <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse (Optional)</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Straße</label>
                <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hausnummer</label>
                <input type="text" id="houseNumber" name="houseNumber" value={formData.houseNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postleitzahl</label>
                <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
              </div>
               <div className="md:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stadt</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
              </div>
            </div>
          </fieldset>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kurzbeschreibung</label>
            <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
