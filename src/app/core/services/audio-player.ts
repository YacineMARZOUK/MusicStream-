import { Injectable, signal, inject } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';
import { TrackService } from './TrackService'; 

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  
  private trackService = inject(TrackService);
  
  private audio = new Audio();
  private currentBlobUrl: string | null = null;
  
  currentTrack = signal<Track | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(0.5);

  constructor() {
    this.audio.ontimeupdate = () => this.currentTime.set(this.audio.currentTime);
    this.audio.onloadedmetadata = () => this.duration.set(this.audio.duration);
    this.audio.onplay = () => this.isPlaying.set(true);
    this.audio.onpause = () => this.isPlaying.set(false);
    this.audio.onended = () => this.next(); 
    this.audio.volume = 0.5;
  }

  playTrack(track: Track) {
    if (this.currentTrack()?.id !== track.id) {
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }
      
      this.currentTrack.set(track);
      
      let blob: Blob;
      if (track.fileData instanceof Blob) {
        blob = track.fileData;
      } else {
        blob = new Blob([track.fileData]);
      }
      
      this.currentBlobUrl = URL.createObjectURL(blob);
      this.audio.src = this.currentBlobUrl;
    }
    
    this.audio.play().catch(err => console.error('Erreur de lecture:', err));
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => console.error('Erreur play:', err));
    }
  }

  // 2. Logique pour le morceau suivant
  next() { 
    const tracks = this.trackService.tracks(); // Liste des morceaux du signal
    const current = this.currentTrack();
    
    if (current && tracks.length > 0) {
      const currentIndex = tracks.findIndex(t => t.id === current.id);
      // Calcul de l'index suivant (revient au début si on est à la fin)
      const nextIndex = (currentIndex + 1) % tracks.length;
      this.playTrack(tracks[nextIndex]);
    }
  }
  
  // 3. Logique pour le morceau précédent
  previous() { 
    const tracks = this.trackService.tracks();
    const current = this.currentTrack();
    
    if (current && tracks.length > 0) {
      const currentIndex = tracks.findIndex(t => t.id === current.id);
      // Calcul de l'index précédent (va à la fin si on est au début)
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      this.playTrack(tracks[prevIndex]);
    }
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(val: number) {
    this.audio.volume = val;
    this.volume.set(val);
  }
}