import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly PROFILE_IMAGE_KEY = 'profileImage';

  profileImage = signal<string | null>(localStorage.getItem(this.PROFILE_IMAGE_KEY));

  setProfileImage(image: string): void {
    localStorage.setItem(this.PROFILE_IMAGE_KEY, image);
    this.profileImage.set(image);
  }

  removeProfileImage(): void {
    localStorage.removeItem(this.PROFILE_IMAGE_KEY);
    this.profileImage.set(null);
  }
}
