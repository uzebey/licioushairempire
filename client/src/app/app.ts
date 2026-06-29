import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CartService } from './core/services/cart';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly firstName = computed(
    () => (this.authService.currentUser()?.name ?? '').split(' ')[0]
  );
}
