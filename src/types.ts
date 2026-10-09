export type Screen = 'welcome' | 'notes' | 'folders' | 'editor' | 'tasks' | 'assistant' | 'settings' | 'recycle'
export type ThemeMode = 'auto' | 'light' | 'dark'

export type Note = {
  id: string
  title: string
  body: string
  folderId?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  originalFolderId?: string
}

export type Folder = { id: string; name: string; system?: boolean }
export type Task = { id: string; text: string; done: boolean; createdAt: string }
export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; noteId?: string }
export type ModalState =
  | { type: 'delete-note'; noteId: string }
  | { type: 'move-note'; noteId: string }
  | { type: 'folder-menu'; folderId: string }
  | { type: 'new-folder' }
  | { type: 'delete-folder'; folderId: string }
  | { type: 'extract-tasks'; noteId: string; suggestions: string[] }
  | { type: 'delete-permanent'; noteId: string }
  | { type: 'privacy' }
  | null
