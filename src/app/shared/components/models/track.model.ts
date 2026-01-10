export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number; 
  category: 'pop' | 'rock' | 'rap' | 'jazz' | 'other';
  fileData: Blob; 
  coverImage?: string; 
}