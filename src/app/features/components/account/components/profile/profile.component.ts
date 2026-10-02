import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { SelectComponent } from '../../../../../shared/components/select/select.component';

@Component({
  imports: [SelectComponent],
  selector: 'app-profile',
  styleUrl: './profile.component.css',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  readonly authService = inject(AuthService);

  readonly avatarPreview = signal<string | null>(null);

  // ----- Select options -----
  readonly genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];
  readonly shoeSizes = [36, 37, 38, 39, 40, 41, 42];
  readonly clothingSizes = ['XS', 'S', 'M', 'L', 'XL'];

  // ----- Selected value -----
  readonly gender = signal<string | null>(null);
  readonly shoeSize = signal<string | null>(null);
  readonly topSize = signal<string | null>(null);
  readonly bottomSize = signal<string | null>(null);

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.avatarPreview.set(reader.result);
      }
    };

    reader.readAsDataURL(file);
    input.value = '';
  }
}
