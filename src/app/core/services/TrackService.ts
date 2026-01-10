import { Injectable, signal } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';
import { StorageService } from './StorageService';

@Injectable({ providedIn: 'root' })
export class TrackService {
  // Signal pour la liste des tracks (Réactif !)
  tracks = signal<Track[]>([]);
  loading = signal<boolean>(false);

  constructor(private storageService: StorageService) {
    this.loadTracks();
  }

  async loadTracks() {
    this.loading.set(true);
    const data = await this.storageService.getAllTracks();
    this.tracks.set(data);
    this.loading.set(false);
  }

  async addTrack(track: Track) {
    await this.storageService.saveTrack(track);
    this.tracks.update(all => [...all, track]); // Mise à jour auto de l'UI
  }
}