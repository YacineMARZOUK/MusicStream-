import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value && value !== 0) return '0:00';

    const minutes: number = Math.floor(value / 60);
    const seconds: number = Math.floor(value % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}