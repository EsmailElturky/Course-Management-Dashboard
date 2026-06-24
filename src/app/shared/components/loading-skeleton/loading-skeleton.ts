import { Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'card' | 'table-row';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.html',
  styleUrl: './loading-skeleton.scss',
})
export class LoadingSkeleton {
  readonly count = input<number>(6);
  readonly variant = input<SkeletonVariant>('card');

  protected readonly items = computed(() => Array.from({ length: this.count() }, (_, index) => index));
}
