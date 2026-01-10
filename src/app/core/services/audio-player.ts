import { Injectable, signal } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio = new Audio();
  private currentBlobUrl: string | null = null; // Pour nettoyer l'URL
  
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
    
    // Définir le volume initial
    this.audio.volume = 0.5;
  }

  playTrack(track: Track) {
    if (this.currentTrack()?.id !== track.id) {
      // Libérer l'ancienne URL si elle existe
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }
      
      this.currentTrack.set(track);
      this.currentBlobUrl = URL.createObjectURL(track.fileData);
      this.audio.src = this.currentBlobUrl;
    }
    this.audio.play();
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play();
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
    // TODO: Implémenter avec la playlist
  }
  
  previous() { 
    console.log('Previous track'); 
    // TODO: Implémenter avec la playlist
  }
}