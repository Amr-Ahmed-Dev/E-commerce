import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrdersService } from '../../../../../shared/services/orders.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  readonly orders = signal<IOrder[]>([]);

  ngOnInit(): void {
    this.getUserOrders();
  }

  private getUserOrders(): void {
    this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        const sortedOrders = [...(orders ?? [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        this.orders.set(sortedOrders);
      },
    });
  }
}
