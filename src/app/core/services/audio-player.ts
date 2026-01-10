import { Injectable, signal, computed } from '@angular/core';
import { Track } from '../../shared/components/models/track.model';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio = new Audio();
  
  // États réactifs avec Signals
  currentTrack = signal<Track | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(0.5);

  constructor() {
    // Écouter les événements natifs de l'élément Audio
    this.audio.ontimeupdate = () => this.currentTime.set(this.audio.currentTime);
    this.audio.onloadedmetadata = () => this.duration.set(this.audio.duration);
    this.audio.onplay = () => this.isPlaying.set(true);
    this.audio.onpause = () => this.isPlaying.set(false);
    this.audio.onended = () => this.next();
  }

  playTrack(track: Track) {
    if (this.currentTrack()?.id !== track.id) {
      this.currentTrack.set(track);
      // Créer une URL temporaire pour le Blob (fichier stocké)
      const url = URL.createObjectURL(track.fileData);
      this.audio.src = url;
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

  // Fonctions pour le prochain/précédent (à lier avec TrackService plus tard)
  next() { console.log('Next track'); }
  previous() { console.log('Previous track'); }
}