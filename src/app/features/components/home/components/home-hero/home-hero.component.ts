import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../../../shared/services/products.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css',
})
export class HomeHeroComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  // الـ timers لازم تشتغل في المتصفح بس (SSR بيتعلّق لو فيه timer شغال على السيرفر)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly heroSource = signal<IProduct[]>([]);
  private readonly batchIndex = signal(0);

  // 'in' = الدفعة الحالية داخلة/ظاهرة، 'out' = خارجة قبل ما تتبدّل
  readonly phase = signal<'in' | 'out'>('in');

  readonly heroSlots = [
    { width: 'w-[18%]', offset: '' },
    { width: 'w-[22%]', offset: '' },
    { width: 'w-[19%]', offset: '' },
    { width: 'w-[23%]', offset: '' },
    { width: 'w-[18%]', offset: '' },
  ];

  // ----- إعدادات الحركة (عدّلها براحتك) -----
  private readonly batchSize = 5; // عدد الكروت في الدفعة
  private readonly stride = 10; // الفرق بين كل منتج والتاني في نفس الدفعة (0, 10, 20, 30, 40)
  private readonly displayDuration = 4500; // ms — الدفعة بتفضل ظاهرة قد إيه
  private readonly exitDuration = 900; // ms — لازم يكون >= مدة الـ out animation + الـ stagger في الـ CSS
  private readonly productsToLoad = 50; // لازم >= (batchSize - 1) * stride + عدد الدفعات (4*10 + 10 = 50)

  private timer?: ReturnType<typeof setTimeout>;
  private paused = false;

  // عدد الدفعات الكاملة المتاحة: الدفعة رقم b محتاجة منتج على index (b + 40)
  // مع 50 منتج = 10 دفعات (المنتجات 0-49). لو المنتجات أقل من 41 → صفر (مفيش تبديل)
  private readonly batchCount = computed(() => {
    const needed = (this.batchSize - 1) * this.stride;
    return Math.min(this.stride, Math.max(0, this.heroSource().length - needed));
  });

  // الدفعة رقم b = المنتجات [b, b+10, b+20, b+30, b+40]
  private batchAt(b: number): IProduct[] {
    const all = this.heroSource();
    return Array.from({ length: this.batchSize }, (_, k) => all[b + k * this.stride]).filter(
      Boolean,
    );
  }

  readonly heroProducts = computed(() => {
    // لو المنتجات مش كفاية للدفعات، اعرض أول 5 ثابتين بدل كروت ناقصة
    if (this.batchCount() === 0) {
      return this.heroSource().slice(0, this.batchSize);
    }
    return this.batchAt(this.batchIndex());
  });

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));

    this.productsService.getProducts(1, this.productsToLoad).subscribe({
      next: (res) => {
        this.heroSource.set(res.data);

        if (this.isBrowser && this.batchCount() > 1) {
          this.preloadBatch(1);
          this.scheduleNext();
        }
      },
      error: (err) => console.log(err),
    });
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  private scheduleNext(): void {
    this.timer = setTimeout(() => {
      // لو المستخدم واقف بالماوس على الكروت، استنى وحاول تاني
      if (this.paused) {
        this.scheduleNext();
        return;
      }

      this.phase.set('out'); // الكروت الحالية تخرج

      this.timer = setTimeout(() => {
        const count = this.batchCount();
        this.batchIndex.update((i) => (i + 1) % count); // الدفعة الجاية
        this.phase.set('in'); // الكروت الجديدة تدخل
        this.preloadBatch((this.batchIndex() + 1) % count); // حمّل صور اللي بعدها مقدمًا
        this.scheduleNext();
      }, this.exitDuration);
    }, this.displayDuration);
  }

  // بيحمّل صور الدفعة الجاية في الكاش عشان تدخل جاهزة من غير كروت فاضية
  private preloadBatch(b: number): void {
    this.batchAt(b).forEach((p) => {
      const img = new Image();
      img.src = p.imageCover;
    });
  }
}
