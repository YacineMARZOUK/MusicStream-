import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackService } from '../../core/services/TrackService';
import { Track } from '../../shared/components/models/track.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private fb = inject(FormBuilder);
  trackService = inject(TrackService);

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['pop', Validators.required],
    file: [null, Validators.required]
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // Limite 10MB
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
        duration: 0 // On calculera la vraie durée plus tard
      };
      this.trackService.addTrack(newTrack);
      this.trackForm.reset();
    }
  }
}