import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackService } from '../../core/services/TrackService';
import { Track } from '../../shared/components/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private fb = inject(FormBuilder);
  trackService = inject(TrackService);
  playerService = inject(AudioPlayerService);
  
  private selectedFile: File | null = null;

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['pop', Validators.required],
    file: [null, Validators.required]
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      this.selectedFile = file;
      this.trackForm.patchValue({ file: file });
      this.trackForm.get('file')?.updateValueAndValidity();
    } else {
      alert("Fichier trop lourd (max 10MB)");
      this.selectedFile = null;
      this.trackForm.patchValue({ file: null });
    }
  }

  async onSubmit() {
    if (this.trackForm.valid && this.selectedFile) {
      const newTrack: Track = {
        id: crypto.randomUUID(),
        title: this.trackForm.value.title!,
        artist: this.trackForm.value.artist!,
        category: this.trackForm.value.category as 'pop' | 'rock' | 'rap' | 'jazz' | 'other',
        fileData: this.selectedFile, // Le File hérite de Blob, donc c'est OK
        addedDate: new Date(),
        duration: 0
      };
      
      await this.trackService.addTrack(newTrack);
      
      // Reset du formulaire
      this.trackForm.reset({ category: 'pop' });
      this.selectedFile = null;
      
      // Reset de l'input file (important!)
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }

  playTrack(track: Track) {
    this.playerService.playTrack(track);
  }
}