import { Injectable } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private dbName = 'MusicStreamDB';
  private dbVersion = 2; // Incrémenté pour forcer la mise à jour

  // Récupérer toutes les musiques
  async getAllTracks(): Promise<Track[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('tracks', 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Erreur lors de la récupération des tracks');
    });
  }

  // Sauvegarder une musique
  async saveTrack(track: Track): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('tracks', 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.add(track);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Erreur lors de la sauvegarde du track');
    });
  }

  // Supprimer une musique
  async deleteTrack(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('tracks', 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Erreur lors de la suppression du track');
    });
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      // Création/mise à jour de la structure
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        
        // Supprimer l'ancien store s'il existe
        if (db.objectStoreNames.contains('tracks')) {
          db.deleteObjectStore('tracks');
        }
        
        // Créer le nouveau store
        db.createObjectStore('tracks', { keyPath: 'id' });
        console.log('Object store "tracks" créé avec succès');
      };

      request.onsuccess = () => {
        console.log('Base de données ouverte avec succès');
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Erreur lors de l\'ouverture de la base de données');
        reject('Erreur IndexedDB');
      };
    });
  }

  // Méthode utilitaire pour réinitialiser la base (développement)
  async resetDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onsuccess = () => {
        console.log('Base de données supprimée');
        resolve();
      };
      request.onerror = () => reject('Erreur lors de la suppression de la DB');
    });
  }
}