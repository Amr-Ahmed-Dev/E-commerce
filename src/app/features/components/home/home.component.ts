import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductsService } from '../../../shared/services/products.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { AuthService } from '../../../core/auth/services/auth.service';

import { HomeSliderComponent } from './home-slider/home-slider.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';

import { JsonPipe } from '@angular/common';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    HomeSliderComponent,
    CardComponent,
    NgxPaginationModule,
    JsonPipe,
    HomeHeroComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('categoryScroller')
  private categoryScroller!: ElementRef<HTMLDivElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  readonly authService = inject(AuthService);

  readonly products = signal<IProduct[]>([]);
  readonly categories = signal<ICategory[]>([]);

  readonly itemsPerPage = signal(12);
  readonly currentPage = signal(1);
  readonly totalItems = signal(0);
  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);

  readonly pagination = computed<PaginationInstance>(() => ({
    id: 'foo',
    itemsPerPage: this.itemsPerPage(),
    currentPage: this.currentPage(),
    totalItems: this.totalItems(),
  }));

  constructor() {
    this.getAllProducts();
    this.getAllCategories();
  }

  private getAllProducts(): void {
    this.productsService.getProducts(this.currentPage(), this.itemsPerPage()).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.itemsPerPage.set(response.metadata.limit);
        this.currentPage.set(response.metadata.currentPage);
        this.totalItems.set(response.metadata.numberOfPages * response.metadata.limit);
      },
    });
  }

  private getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response: IResponse<ICategory>) => {
        this.categories.set(response.data);
      },
    });
  }

  pageChanged(page: number): void {
    this.currentPage.set(page);
    this.getAllProducts();
  }
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    const element = this.categoryScroller.nativeElement;
    const update = () => this.updateScrollButtons(element);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined;

    const mutationObserver =
      typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : undefined;

    resizeObserver?.observe(element);
    mutationObserver?.observe(element, { childList: true, subtree: true });

    requestAnimationFrame(update);

    this.destroyRef.onDestroy(() => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    });
  }

  updateScrollButtons(element: HTMLDivElement): void {
    const maxScroll = element.scrollWidth - element.clientWidth;

    this.canScrollLeft.set(element.scrollLeft > 1);
    this.canScrollRight.set(maxScroll - element.scrollLeft > 1);
  }
}
