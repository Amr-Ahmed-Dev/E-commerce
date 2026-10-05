import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../core/auth/services/auth.service';

interface ITokenPayload {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpService = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly ordersUrl = `${environment.BASE_URL}/orders`;

  getUserOrders(): Observable<IOrder[]> {
    const token = this.authService.token();

    if (!token) {
      throw new Error('User is not authenticated');
    }

    const { id: userId } = jwtDecode<ITokenPayload>(token);

    return this.httpService.get<IOrder[]>(`${this.ordersUrl}/user/${userId}`);
  }
}
