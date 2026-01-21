import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackService } from '../../core/services/TrackService';
import { Track } from '../../shared/components/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule, DurationPipe, RouterLink],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private fb = inject(FormBuilder);
  trackService = inject(TrackService);
  playerService = inject(AudioPlayerService);
  
  private selectedFile: File | null = null;
  private currentFileDuration: number = 0;

  // Propriétés pour la gestion de l'édition
  isEditing = false;
  currentTrackId: string | null = null;

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    category: ['pop', Validators.required],
    file: [null, [Validators.required]]
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      this.selectedFile = file;
      
      const audio = new Audio();
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        audio.src = e.target.result;
        audio.onloadedmetadata = () => {
          this.currentFileDuration = Math.round(audio.duration);
          console.log('Durée détectée :', this.currentFileDuration, 'secondes');
        };
      };
      reader.readAsDataURL(file);

      this.trackForm.patchValue({ file: file });
      this.trackForm.get('file')?.updateValueAndValidity();
    } else {
      alert("Fichier trop lourd (max 10MB)");
      this.selectedFile = null;
      this.currentFileDuration = 0;
    }
  }

  // Fonction pour charger les données dans le formulaire en mode édition
  editTrack(track: Track) {
    this.isEditing = true;
    this.currentTrackId = track.id;
    
    this.trackForm.patchValue({
      title: track.title,
      artist: track.artist,
      category: track.category
    });
    
    // Le fichier n'est plus obligatoire car on garde l'ancien si rien n'est choisi
    this.trackForm.get('file')?.clearValidators();
    this.trackForm.get('file')?.updateValueAndValidity();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentTrackId = null;
    this.trackForm.reset({ category: 'pop' });
    this.selectedFile = null;
    this.currentFileDuration = 0;
    
    // Réinitialiser les validateurs pour le mode ajout
    this.trackForm.get('file')?.setValidators([Validators.required]);
    this.trackForm.get('file')?.updateValueAndValidity();
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async onSubmit() {
    if (this.trackForm.valid) {
      const formValues = this.trackForm.value;

      if (this.isEditing && this.currentTrackId) {
        // --- MODE ÉDITION ---
        const updates: Partial<Track> = {
          title: formValues.title!,
          artist: formValues.artist!,
          category: formValues.category as any,
        };
        
        if (this.selectedFile) {
          updates.fileData = this.selectedFile;
          updates.duration = this.currentFileDuration;
        }

        await this.trackService.updateTrack(this.currentTrackId, updates);
        this.cancelEdit();
      } 
      else if (this.selectedFile) {
        // --- MODE AJOUT ---
        const newTrack: Track = {
          id: crypto.randomUUID(),
          title: formValues.title!,
          artist: formValues.artist!,
          category: formValues.category as any,
          fileData: this.selectedFile,
          addedDate: new Date(),
          duration: this.currentFileDuration
        };
        
        await this.trackService.addTrack(newTrack);
        this.cancelEdit(); // Utilise cancelEdit pour nettoyer le formulaire
      }
    }
  }

  playTrack(track: Track) {
    this.playerService.playTrack(track);
  }

  confirmDelete(track: Track) {
    if (confirm(`Voulez-vous vraiment supprimer "${track.title}" ?`)) {
      this.trackService.deleteTrack(track.id);
    }
  }

  updateSearch(query: string) {
    this.trackService.searchQuery.set(query);
  }

  updateCategory(category: string) {
    this.trackService.selectedCategory.set(category);
  }
}