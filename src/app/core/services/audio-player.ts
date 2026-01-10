import { Injectable, signal } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
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
      
      // Vérifier si fileData est bien un Blob
      console.log('Type de fileData:', track.fileData);
      console.log('Est un Blob?', track.fileData instanceof Blob);
      
      // S'assurer que c'est bien un Blob
      let blob: Blob;
      if (track.fileData instanceof Blob) {
        blob = track.fileData;
      } else {
        // Si ce n'est pas un Blob, essayer de le convertir
        console.warn('fileData n\'est pas un Blob, tentative de conversion');
        blob = new Blob([track.fileData]);
      }
      
      this.currentBlobUrl = URL.createObjectURL(blob);
      this.audio.src = this.currentBlobUrl;
    }
    
    // Attendre un peu avant de jouer pour éviter les interruptions
    this.audio.play().catch(err => {
      console.error('Erreur de lecture:', err);
    });
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => console.error('Erreur play:', err));
    }
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(val: number) {
    this.audio.volume = val;
    this.volume.set(val);
  }

  next() { 
    console.log('Next track');
  }
  
  previous() { 
    console.log('Previous track');
  }
} 