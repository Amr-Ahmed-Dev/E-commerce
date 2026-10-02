import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';

@Service()
export class AnimateProductToCardService {
  private readonly platformId = inject(PLATFORM_ID);

  animateProductToCart(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const button = event.currentTarget as HTMLElement;
    const card = button.closest('article');
    const source = card?.querySelector<HTMLImageElement>('img');

    const cartIcons = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-icon]'));

    const target = cartIcons.find((icon) => {
      const rect = icon.getBoundingClientRect();
      const styles = window.getComputedStyle(icon);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        styles.display !== 'none' &&
        styles.visibility !== 'hidden'
      );
    });

    if (!source || !target) return;

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const imageSize = Math.min(88, sourceRect.width, sourceRect.height);

    const startLeft = sourceRect.left + (sourceRect.width - imageSize) / 2;
    const startTop = sourceRect.top + (sourceRect.height - imageSize) / 2;
    const endX = targetRect.left + targetRect.width / 2 - (startLeft + imageSize / 2);
    const endY = targetRect.top + targetRect.height / 2 - (startTop + imageSize / 2);

    const flyingImage = source.cloneNode(true) as HTMLImageElement;

    Object.assign(flyingImage.style, {
      position: 'fixed',
      left: `${startLeft}px`,
      top: `${startTop}px`,
      width: `${imageSize}px`,
      height: `${imageSize}px`,
      objectFit: 'cover',
      borderRadius: '12px',
      zIndex: '99999',
      pointerEvents: 'none',
      boxShadow: '0 8px 24px rgb(15 23 42 / 25%)',
    });

    document.body.appendChild(flyingImage);

    const animation = flyingImage.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${endX}px, ${endY}px) scale(0.18)`, opacity: 0.5 },
      ],
      {
        duration: 700,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    );

    animation.onfinish = () => {
      flyingImage.remove();
      target.classList.remove('cart-icon-bump');
      void target.getBoundingClientRect();
      target.classList.add('cart-icon-bump');
    };
  }
}
