import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

let nextId = 0;

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SelectComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** قيم بسيطة (36, 'M') أو { value, label } */
  readonly options = input.required<readonly (string | number | SelectOption)[]>();
  readonly placeholder = input('Select');
  /** id العنصر اللي فيه اسم الحقل (للـ accessibility) */
  readonly labelledBy = input<string | null>(null);
  /** بيدعم [(value)] مع أي WritableSignal */
  readonly value = model<string | null>(null);

  readonly uid = `app-select-${nextId++}`;
  readonly open = signal(false);
  readonly activeIndex = signal(-1);

  readonly items = computed<SelectOption[]>(() =>
    this.options().map((o) => (typeof o === 'object' ? o : { value: String(o), label: String(o) })),
  );

  readonly selected = computed(() => this.items().find((i) => i.value === this.value()) ?? null);

  toggle(): void {
    this.open() ? this.close() : this.openPanel();
  }

  select(item: SelectOption): void {
    this.value.set(item.value);
    this.close();
  }

  close(): void {
    this.open.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const count = this.items().length;
    if (!count) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open()) {
          this.openPanel();
          return;
        }
        this.activeIndex.update((i) => (i + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
        this.scrollActiveIntoView();
        return;
      case 'Home':
      case 'End':
        if (this.open()) {
          event.preventDefault();
          this.activeIndex.set(event.key === 'Home' ? 0 : count - 1);
          this.scrollActiveIntoView();
        }
        return;
      case 'Enter':
        if (this.open()) {
          event.preventDefault();
          const item = this.items()[this.activeIndex()];
          if (item) this.select(item);
        }
        return;
      case 'Escape':
      case 'Tab':
        this.close();
        return;
    }
  }

  private openPanel(): void {
    const selectedIndex = this.items().findIndex((i) => i.value === this.value());
    this.activeIndex.set(selectedIndex >= 0 ? selectedIndex : 0);
    this.open.set(true);
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    setTimeout(() => {
      this.host.nativeElement
        .querySelector(`#${this.uid}-opt-${this.activeIndex()}`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }
}
