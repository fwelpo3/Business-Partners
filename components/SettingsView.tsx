import React, { useState, useRef } from 'react';
import type { User, NewUser, InboxItem, GuestbookEntry } from '../types';
import type { FullImportData } from '../App';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';

// SheetJS is loaded globally from index.html
declare const XLSX: any;

interface SettingsViewProps {
  users: User[];
  inboxItems: InboxItem[];
  guestbookEntries: GuestbookEntry[];
  onImport: (data: FullImportData) => Promise<void>;
  showImportConfirmation: (onConfirm: () => void) => void;
  onChangePassword: (current: string, newPass: string) => boolean;
}

interface ExcelExportButtonProps {
    users: User[];
    inboxItems: InboxItem[];
    guestbookEntries: GuestbookEntry[];
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ users, inboxItems, guestbookEntries }) => {
    const handleExport = () => {
        const workbook = XLSX.utils.book_new();
        const today = new Date().toISOString().slice(0, 10);

        // 1. Export Users
        if (users.length > 0) {
            const usersToExport = users.map(({ id, coords, ...rest }) => rest);
            const userWorksheet = XLSX.utils.json_to_sheet(usersToExport);
            userWorksheet['!cols'] = [
                { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 10 },
                { wch: 10 }, { wch: 20 }, { wch: 35 }, { wch: 50 },
            ];
            XLSX.utils.book_append_sheet(workbook, userWorksheet, 'Einträge');
        }

        // 2. Export Inbox Items
        if (inboxItems.length > 0) {
            const inboxWorksheet = XLSX.utils.json_to_sheet(inboxItems);
            inboxWorksheet['!cols'] = [
                { wch: 36 }, { wch: 15 }, { wch: 80 }, { wch: 20 },
            ];
            XLSX.utils.book_append_sheet(workbook, inboxWorksheet, 'Eingang');
        }

        // 3. Export Guestbook Entries (flattened)
        if (guestbookEntries.length > 0) {
            const flattenedGuestbookData: any[] = [];
            guestbookEntries.forEach(entry => {
                if (entry.replies.length === 0) {
                    flattenedGuestbookData.push({
                        'Eintrag ID': entry.id,
                        'Eintrag Autor': entry.authorName,
                        'Eintrag Titel': entry.title,
                        'Eintrag Inhalt': entry.content,
                        'Eintrag Datum': entry.createdAt,
                    });
                } else {
                    entry.replies.forEach(reply => {
                        flattenedGuestbookData.push({
                            'Eintrag ID': entry.id,
                            'Eintrag Autor': entry.authorName,
                            'Eintrag Titel': entry.title,
                            'Eintrag Inhalt': entry.content,
                            'Eintrag Datum': entry.createdAt,
                            'Antwort ID': reply.id,
                            'Antwort Autor': reply.authorName,
                            'Antwort Inhalt': reply.content,
                            'Antwort Datum': reply.createdAt,
                        });
                    });
                }
            });
            const guestbookWorksheet = XLSX.utils.json_to_sheet(flattenedGuestbookData);
            guestbookWorksheet['!cols'] = [
                { wch: 36 }, { wch: 20 }, { wch: 30 }, { wch: 50 }, { wch: 20 },
                { wch: 36 }, { wch: 20 }, { wch: 50 }, { wch: 20 },
            ];
            XLSX.utils.book_append_sheet(workbook, guestbookWorksheet, 'Gästebuch');
        }

        XLSX.writeFile(workbook, `gesamtexport_${today}.xlsx`);
    };

    const hasDataToExport = users.length > 0 || inboxItems.length > 0 || guestbookEntries.length > 0;

    return (
        <button
            onClick={handleExport}
            disabled={!hasDataToExport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Alle Daten als Excel exportieren
        </button>
    );
};


const ExcelImportButton: React.FC<{ onImport: (data: FullImportData) => Promise<void>, showImportConfirmation: (onConfirm: () => void) => void }> = ({ onImport, showImportConfirmation }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        showImportConfirmation(() => {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const importedData: FullImportData = {
                        users: [],
                        inbox: [],
                        guestbook: [],
                    };

                    // 1. Import Users
                    if (workbook.SheetNames.includes('Einträge')) {
                        const worksheet = workbook.Sheets['Einträge'];
                        const json: NewUser[] = XLSX.utils.sheet_to_json(worksheet);
                        importedData.users = json.map(row => ({
                            name: row.name || '',
                            company: row.company || '',
                            phone: row.phone || '',
                            street: row.street || '',
                            houseNumber: row.houseNumber || '',
                            postalCode: String(row.postalCode || ''),
                            city: row.city || '',
                            website: row.website || '',
                            description: row.description || '',
                        }));
                    }

                    // 2. Import Inbox
                    if (workbook.SheetNames.includes('Eingang')) {
                        const worksheet = workbook.Sheets['Eingang'];
                        const json: InboxItem[] = XLSX.utils.sheet_to_json(worksheet);
                        importedData.inbox = json.filter(item => item.id && item.type && item.content && item.createdAt);
                    }

                    // 3. Import Guestbook (and un-flatten it)
                    if (workbook.SheetNames.includes('Gästebuch')) {
                        const worksheet = workbook.Sheets['Gästebuch'];
                        const flattenedData: any[] = XLSX.utils.sheet_to_json(worksheet);
                        const entriesMap = new Map<string, GuestbookEntry>();

                        for (const row of flattenedData) {
                            const entryId = row['Eintrag ID'];
                            if (!entryId) continue;

                            if (!entriesMap.has(entryId)) {
                                entriesMap.set(entryId, {
                                    id: entryId,
                                    authorName: row['Eintrag Autor'] || 'Unbekannt',
                                    title: row['Eintrag Titel'] || '',
                                    content: row['Eintrag Inhalt'] || '',
                                    createdAt: row['Eintrag Datum'],
                                    replies: [],
                                });
                            }
                            
                            if (row['Antwort ID']) {
                                const entry = entriesMap.get(entryId);
                                if (entry) {
                                    entry.replies.push({
                                        id: row['Antwort ID'],
                                        authorName: row['Antwort Autor'] || 'Unbekannt',
                                        content: row['Antwort Inhalt'] || '',
                                        createdAt: row['Antwort Datum'],
                                    });
                                }
                            }
                        }
                        importedData.guestbook = Array.from(entriesMap.values());
                    }

                    await onImport(importedData);
                   
                } catch (error) {
                    console.error('Fehler beim Importieren der Datei:', error);
                    alert('Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass die Datei das richtige Format hat.');
                } finally {
                    setIsLoading(false);
                    setFile(null);
                    if(fileInputRef.current) fileInputRef.current.value = '';
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-gray-600 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <DocumentArrowUpIcon className="w-5 h-5" />
                Datei auswählen...
                <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </label>
            {file && <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>}
            <button
                onClick={handleImport}
                disabled={!file || isLoading}
                className="inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Importiere...' : 'Daten importieren'}
            </button>
        </div>
    );
};

const PasswordSettings: React.FC<{ onChangePassword: (current: string, newPass: string) => boolean; }> = ({ onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({type: 'error', text: 'Die neuen Passwörter stimmen nicht überein.'});
            return;
        }
        if (newPassword.length < 4) {
             setMessage({type: 'error', text: 'Das neue Passwort muss mindestens 4 Zeichen lang sein.'});
             return;
        }
        
        const success = onChangePassword(currentPassword, newPassword);
        
        if (success) {
            setMessage({type: 'success', text: 'Passwort erfolgreich geändert.'});
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({type: 'error', text: 'Das aktuelle Passwort ist falsch.'});
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aktuelles Passwort</label>
                  <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Neues Passwort</label>
                  <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
                </div>
                 <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Neues Passwort bestätigen</label>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" />
                </div>
            </div>
             {message && <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
            <div className="flex justify-end">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Passwort ändern
                </button>
            </div>
        </form>
    );
};

export const SettingsView: React.FC<SettingsViewProps> = ({ users, inboxItems, guestbookEntries, onImport, showImportConfirmation, onChangePassword }) => {
    return (
        <div className="flex-grow p-4 md:p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Einstellungen</h2>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Daten Exportieren</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Sichern Sie alle Ihre Daten (Einträge, Eingang, Gästebuch) in einer einzigen Excel-Datei.
                    </p>
                    <ExcelExportButton users={users} inboxItems={inboxItems} guestbookEntries={guestbookEntries} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Daten Importieren</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Importieren Sie Daten aus einer zuvor exportierten Excel-Datei (.xlsx). Es werden die Tabellenblätter "Einträge", "Eingang" und "Gästebuch" gelesen.
                    </p>
                     <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">
                        Achtung: Der Import überschreibt alle aktuell vorhandenen Daten (Einträge, Eingang, Gästebuch).
                    </p>
                    <ExcelImportButton onImport={onImport} showImportConfirmation={showImportConfirmation} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
                     <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Passwort Ändern</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Hier können Sie das Passwort für den Zugriff auf die Verwaltungs- und Einstellungsseiten ändern.
                    </p>
                    <PasswordSettings onChangePassword={onChangePassword} />
                </div>

            </div>
        </div>
    );
};