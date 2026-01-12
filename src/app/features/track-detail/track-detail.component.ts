import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrackService } from '../../core/services/TrackService';
import { AudioPlayerService } from '../../core/services/audio-player';
import { Track } from '../../shared/components/models/track.model';
import { DurationPipe } from '../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DurationPipe],
  templateUrl: './track-detail.html'
})
export class TrackDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private trackService = inject(TrackService);
  public playerService = inject(AudioPlayerService);

  track = signal<Track | null>(null);

  ngOnInit() {
    // Récupérer l'ID depuis l'URL (ex: /track/123-abc)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundTrack = this.trackService.getTrackById(id);
      if (foundTrack) {
        this.track.set(foundTrack);
      }
    }
  }
}