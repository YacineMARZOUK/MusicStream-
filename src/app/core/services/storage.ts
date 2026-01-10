import { Injectable } from '@angular/core';
import { Track } from '../../shared/components/models/track.model'

@Injectable({ providedIn: 'root' })
export class StorageService {
  private dbName = 'MusicStreamDB';

  // Récupérer toutes les musiques
  async getAllTracks(): Promise<Track[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('tracks', 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Sauvegarder une musique
  async saveTrack(track: Track): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction('tracks', 'readwrite');
    const store = transaction.objectStore('tracks');
    store.add(track);
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Erreur IndexedDB');
    });
  }
}