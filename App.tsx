import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { ManagementView } from './components/ManagementView';
import { SettingsView } from './components/SettingsView';
import { InboxView } from './components/InboxView';
import { GuestbookView } from './components/GuestbookView';
import { UserForm } from './components/UserForm';
import { UserDetailModal } from './components/UserDetailModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PasswordModal } from './components/PasswordModal';
import { QuestionForm } from './components/QuestionForm';
import { SuggestionForm } from './components/SuggestionForm';
import { useUsers } from './hooks/useUsers';
import { useAuth } from './hooks/useAuth';
import { useInbox } from './hooks/useInbox';
import { useGuestbook } from './hooks/useGuestbook';
import type { User, NewUser, InboxItem, GuestbookEntry } from './types';

export type View = 'map' | 'management' | 'settings' | 'inbox' | 'guestbook';
type PasswordModalMode = 'setup' | 'login';

export interface FullImportData {
  users: NewUser[];
  inbox: InboxItem[];
  guestbook: GuestbookEntry[];
}

function App() {
  const { users, addUser, updateUser, deleteUser, overwriteUsers } = useUsers();
  const { inboxItems, addInboxItem, deleteInboxItem, overwriteInboxItems } = useInbox();
  const { guestbookEntries, addGuestbookEntry, addGuestbookReply, overwriteGuestbookEntries } = useGuestbook();
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<View>('map');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [confirmationState, setConfirmationState] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<PasswordModalMode>('login');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [destinationView, setDestinationView] = useState<View | null>(null);

  // New states for question/suggestion modals
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [isSuggestionFormOpen, setIsSuggestionFormOpen] = useState(false);


  const handleNavigate = useCallback((view: View) => {
    // Public views that don't require authentication
    if (view === 'map' || view === 'guestbook' || view === 'inbox') {
      setCurrentView(view);
      return;
    }
    
    // Protected views
    if (auth.isAuthenticated) {
      setCurrentView(view);
    } else {
      setDestinationView(view);
      setPasswordModalMode(auth.hasPassword ? 'login' : 'setup');
      setPasswordError(null);
      setIsPasswordModalOpen(true);
    }
  }, [auth.isAuthenticated, auth.hasPassword]);

  const handleLock = useCallback(() => {
    auth.logout();
    setCurrentView('map');
  }, [auth]);

  const handlePasswordModalClose = useCallback(() => {
    setIsPasswordModalOpen(false);
    setDestinationView(null);
  }, []);

  const handlePasswordSubmit = useCallback((passwordAttempt: string) => {
    let success = false;
    if (passwordModalMode === 'setup') {
      auth.createPassword(passwordAttempt);
      success = true;
    } else {
      success = auth.login(passwordAttempt);
    }
    
    if (success && destinationView) {
      setCurrentView(destinationView);
      handlePasswordModalClose();
    } else {
      setPasswordError('Passwort ist falsch.');
    }
  }, [auth, destinationView, passwordModalMode, handlePasswordModalClose]);

  const handleChangePassword = useCallback((current: string, newPass: string): boolean => {
    try {
        return auth.changePassword(current, newPass);
    } catch(e) {
        alert(e instanceof Error ? e.message : 'Ein Fehler ist aufgetreten.');
        return false;
    }
  }, [auth]);

  const handleAddUserClick = useCallback(() => {
    setEditingUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEditUserClick = useCallback((user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingUser(null);
  }, []);

  const handleFormSubmit = useCallback(async (userData: NewUser) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        await addUser(userData);
      }
      handleFormClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ein unerwarteter Fehler ist aufgetreten.");
      }
    }
  }, [addUser, updateUser, editingUser, handleFormClose]);

  const handleDeleteUserClick = useCallback((user: User) => {
    setConfirmationState({
        title: "Eintrag löschen",
        message: `Sind Sie sicher, dass Sie den Eintrag für "${user.name}" endgültig löschen möchten?`,
        onConfirm: () => {
            deleteUser(user.id);
            setConfirmationState(null);
        }
    });
  }, [deleteUser]);

  const handleFullImport = useCallback(async (data: FullImportData) => {
      try {
          await overwriteUsers(data.users);
          overwriteInboxItems(data.inbox);
          overwriteGuestbookEntries(data.guestbook);
          alert('Daten erfolgreich importiert!');
      } catch (error) {
          console.error("Import failed:", error);
          alert("Der Import ist fehlgeschlagen.");
      }
  }, [overwriteUsers, overwriteInboxItems, overwriteGuestbookEntries]);


  const showImportConfirmation = useCallback((onConfirmAction: () => void) => {
    setConfirmationState({
        title: "Daten importieren",
        message: "Achtung: Dadurch werden alle vorhandenen Daten (Einträge, Eingang, Gästebuch) überschrieben. Möchten Sie fortfahren?",
        onConfirm: () => {
            onConfirmAction();
            setConfirmationState(null);
        }
    });
  }, []);

  const handleCancelConfirmation = useCallback(() => {
    setConfirmationState(null);
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedUser(null);
  }, []);
  
  // New handlers for question/suggestion forms
  const handleAddQuestionClick = useCallback(() => {
    setIsQuestionFormOpen(true);
  }, []);

  const handleAddSuggestionClick = useCallback(() => {
    setIsSuggestionFormOpen(true);
  }, []);

  const handleQuestionFormClose = useCallback(() => {
    setIsQuestionFormOpen(false);
  }, []);
  
  const handleSuggestionFormClose = useCallback(() => {
    setIsSuggestionFormOpen(false);
  }, []);

  const handleQuestionSubmit = useCallback((question: string) => {
    addInboxItem(question, 'question');
    alert("Vielen Dank für Ihre Frage! Sie wurde zum Posteingang hinzugefügt.");
    handleQuestionFormClose();
  }, [addInboxItem, handleQuestionFormClose]);

  const handleSuggestionSubmit = useCallback((suggestion: string) => {
    addInboxItem(suggestion, 'suggestion');
    alert("Vielen Dank für Ihren Vorschlag! Er wurde zum Posteingang hinzugefügt.");
    handleSuggestionFormClose();
  }, [addInboxItem, handleSuggestionFormClose]);
  
  const handleDeleteInboxItemClick = useCallback((item: InboxItem) => {
    setConfirmationState({
        title: "Eintrag löschen",
        message: `Möchten Sie diesen Eintrag wirklich löschen?`,
        onConfirm: () => {
            deleteInboxItem(item.id);
            setConfirmationState(null);
        }
    });
  }, [deleteInboxItem]);

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isAuthenticated={auth.isAuthenticated}
        onLock={handleLock}
      />
      <main className="flex-grow flex flex-col overflow-y-hidden">
        {currentView === 'map' && (
          <MapView
            users={users}
            onAddUser={handleAddUserClick}
            onSelectUser={handleSelectUser}
            onAddQuestion={handleAddQuestionClick}
            onAddSuggestion={handleAddSuggestionClick}
          />
        )}
        {currentView === 'guestbook' && (
            <GuestbookView 
                entries={guestbookEntries}
                onAddEntry={addGuestbookEntry}
                onAddReply={addGuestbookReply}
            />
        )}
        {currentView === 'inbox' && (
            <InboxView
                items={inboxItems}
                onDeleteItem={handleDeleteInboxItemClick}
            />
        )}
        {currentView === 'management' && (
          <ManagementView
            users={users}
            onEditUser={handleEditUserClick}
            onDeleteUser={handleDeleteUserClick}
          />
        )}
        {currentView === 'settings' && (
          <SettingsView
            users={users}
            inboxItems={inboxItems}
            guestbookEntries={guestbookEntries}
            onImport={handleFullImport}
            showImportConfirmation={showImportConfirmation}
            onChangePassword={handleChangePassword}
          />
        )}
      </main>
      
      <UserForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />

      <UserDetailModal
        user={selectedUser}
        onClose={handleCloseDetailModal}
      />
      
      <ConfirmationModal
        isOpen={!!confirmationState}
        onClose={handleCancelConfirmation}
        onConfirm={confirmationState?.onConfirm ?? (() => {})}
        title={confirmationState?.title ?? ""}
        message={confirmationState?.message ?? ""}
      />

      <PasswordModal 
        isOpen={isPasswordModalOpen}
        mode={passwordModalMode}
        onClose={handlePasswordModalClose}
        onSubmit={handlePasswordSubmit}
        errorMessage={passwordError}
      />

      <QuestionForm
        isOpen={isQuestionFormOpen}
        onClose={handleQuestionFormClose}
        onSubmit={handleQuestionSubmit}
      />
      
      <SuggestionForm
        isOpen={isSuggestionFormOpen}
        onClose={handleSuggestionFormClose}
        onSubmit={handleSuggestionSubmit}
      />
    </div>
  );
}

export default App;