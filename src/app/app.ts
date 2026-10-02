import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SidebarComponent } from './core/layouts/components/navbar/sidebar.component';
import { FooterComponent } from './core/layouts/components/footer/footer.component';
import { AuthService } from './core/auth/services/auth.service';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  imports: [RouterOutlet, NgxSpinnerComponent, SidebarComponent, FooterComponent, LoaderComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('E-commerce');
  private authService = inject(AuthService);
  constructor() {
    this.authService.initAuth();
  }
}
