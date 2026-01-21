import { Injectable, signal, computed, inject } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';
import { StorageService } from './StorageService';

@Injectable({ providedIn: 'root' })
export class TrackService {
  // Signal pour la liste des tracks (Réactif !)
  tracks = signal<Track[]>([]);
  loading = signal<boolean>(false);

  // Signaux pour les filtres
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

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
    this.tracks.update(all => [...all, track]); 
  }
  getTrackById(id: string): Track | undefined {
  return this.tracks().find(t => t.id === id);
  }

  async deleteTrack(id: string) {
  try {
    // 1. Suppression physique dans IndexedDB
    await this.storageService.deleteTrack(id); 
    
    // Mise à jour réactive du Signal
    // Cela déclenchera automatiquement le recalcul de filteredTracks()
    this.tracks.update(all => all.filter(t => t.id !== id));
    
    console.log('Morceau supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
  }
}

  filteredTracks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    
    return this.tracks().filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(query) || 
                           track.artist.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || track.category === category;
      
      return matchesSearch && matchesCategory;
    });
  });
}