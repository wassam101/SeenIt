// Local-only storage for posts that couldn't be uploaded (e.g. no
// connection right after recording). IndexedDB rather than localStorage
// since drafts hold a video Blob, which localStorage can't store. Not unit
// tested: jsdom has no IndexedDB implementation, same as the browser-only
// geolocation/MediaRecorder APIs this feature also depends on.
const DB_NAME = 'seenit-drafts'
const STORE_NAME = 'drafts'
const DB_VERSION = 1

export type Draft = {
  id: string
  blob: Blob
  caption: string
  locationLabel: string
  lat?: number
  lng?: number
  createdAt: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDraft(draft: Draft): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(draft)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function listDrafts(): Promise<Draft[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result as Draft[])
    request.onerror = () => reject(request.error)
  })
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
