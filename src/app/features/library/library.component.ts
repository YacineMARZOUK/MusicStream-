import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackService } from '../../core/services/TrackService';
import { Track } from '../../shared/components/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player'; // ← AJOUTEZ CECI

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private fb = inject(FormBuilder);
  trackService = inject(TrackService);
  playerService = inject(AudioPlayerService); // ← AJOUTEZ CECI

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['pop', Validators.required],
    file: [null, Validators.required]
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      this.trackForm.patchValue({ file: file });
    } else {
      alert("Fichier trop lourd (max 10MB)");
    }
  }

  onSubmit() {
    if (this.trackForm.valid) {
      const newTrack: any = {
        id: crypto.randomUUID(),
        ...this.trackForm.value,
        addedDate: new Date(),
        duration: 0
      };
      this.trackService.addTrack(newTrack);
      this.trackForm.reset();
    }
  }

  // ← AJOUTEZ CETTE FONCTION
   playTrack(track: Track) {
     this.playerService.playTrack(track);
   }
}