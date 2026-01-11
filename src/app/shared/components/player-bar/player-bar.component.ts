import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../../../core/services/audio-player';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  templateUrl: './player-bar.component.html'
})
export class PlayerBarComponent {
  // On injecte le service pour accéder à la musique en cours et aux contrôles
  playerService = inject(AudioPlayerService);

  // Petite fonction pour transformer les secondes en format 0:00
  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}