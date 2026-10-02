import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
} from '@angular/core';

@Component({
  imports: [DecimalPipe],
  selector: 'app-home-slider',
  styleUrl: './home-slider.component.css',
  templateUrl: './home-slider.component.html',
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  // بيتأكد إننا في المتصفح مش على السيرفر (SSR) — أي setInterval لازم يتلف بيه
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // ----- Hero carousel data & state -----
  readonly slides: HeroSlide[] = [
    {
      eyebrow: 'Fresh This Week',
      title: 'Farm-Fresh Produce Delivered Today',
      subtitle: 'Hand-picked fruits and vegetables, sourced daily from local farms.',
      ctaLabel: 'Shop Produce',
      ctaLink: '#',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    },
    {
      eyebrow: 'Limited Time',
      title: 'Up to 30% Off Pantry Essentials',
      subtitle: 'Stock up on everyday staples before the deal disappears.',
      ctaLabel: 'View Offers',
      ctaLink: '#',
      background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    },
    {
      eyebrow: 'New Arrivals',
      title: 'Discover Artisan Bakery Favorites',
      subtitle: 'Warm bread, pastries and more, baked fresh every morning.',
      ctaLabel: 'Explore Bakery',
      ctaLink: '#',
      background: 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)',
    },
  ];

  currentSlide = 0;
  progress = 0;

  private readonly autoPlayDelay = 5000; // ms
  private readonly progressTick = 50; // ms
  private autoPlayTimer?: ReturnType<typeof setInterval>;
  private progressInterval?: ReturnType<typeof setInterval>;
  private touchStartX = 0;
  private touchEndX = 0;

  // ----- Flash Deals data & countdown state -----
  // بيانات وهمية حاليًا — استبدلها بمنتجات حقيقية فيها priceAfterDiscount وقت ما تجهز
  readonly deals: DealProduct[] = [
    {
      id: 1,
      name: 'Cold-Pressed Olive Oil 500ml',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      price: 145,
      oldPrice: 290,
      discountPercent: 50,
      claimedPercent: 72,
    },
    {
      id: 2,
      name: 'Free-Range Eggs, 12-Pack',
      image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400',
      price: 42,
      oldPrice: 65,
      discountPercent: 35,
      claimedPercent: 45,
    },
    {
      id: 3,
      name: 'Wildflower Honey Jar',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
      price: 66,
      oldPrice: 95,
      discountPercent: 30,
      claimedPercent: 88,
    },
    {
      id: 4,
      name: 'Whole Wheat Pasta 400g',
      image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400',
      price: 18,
      oldPrice: 32,
      discountPercent: 44,
      claimedPercent: 60,
    },
  ];

  // العرض بينتهي بعد 6 ساعات من تحميل الصفحة — استبدلها بتاريخ انتهاء حقيقي من الـ API
  private readonly dealEndsAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
  private readonly remainingMs = signal(this.dealEndsAt.getTime() - Date.now());

  readonly dealHours: Signal<number> = computed(() =>
    Math.max(0, Math.floor(this.remainingMs() / 3_600_000)),
  );
  readonly dealMinutes: Signal<number> = computed(() =>
    Math.max(0, Math.floor((this.remainingMs() % 3_600_000) / 60_000)),
  );
  readonly dealSeconds: Signal<number> = computed(() =>
    Math.max(0, Math.floor((this.remainingMs() % 60_000) / 1000)),
  );

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startAutoPlay();
      this.startDealsCountdown();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // ----- Carousel controls -----
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetProgress();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetProgress();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetProgress();
  }

  pauseAutoPlay(): void {
    this.clearTimers();
  }

  resumeAutoPlay(): void {
    if (this.isBrowser) {
      this.startAutoPlay();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const delta = this.touchStartX - this.touchEndX;
    if (delta > 50) {
      this.nextSlide();
    } else if (delta < -50) {
      this.prevSlide();
    }
  }

  // ----- Internal helpers -----
  private startAutoPlay(): void {
    this.clearTimers();
    this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    this.resetProgress();
  }

  private resetProgress(): void {
    this.progress = 0;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.progressInterval = setInterval(() => {
      this.progress = Math.min(this.progress + (100 * this.progressTick) / this.autoPlayDelay, 100);
    }, this.progressTick);
  }

  private clearTimers(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  // -------- Flash Deals Countdown --------
  private startDealsCountdown(): void {
    const timer = setInterval(() => {
      const msLeft = this.dealEndsAt.getTime() - Date.now();
      this.remainingMs.set(Math.max(0, msLeft));
      if (msLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}
