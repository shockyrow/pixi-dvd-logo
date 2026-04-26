import type { Bounds, Updatable } from "./interfaces";

interface WalkerView {
  x: number;
  y: number;
}

export class Walker implements Updatable {
  private x: number;
  private y: number;
  private stepSize: number = 2;
  private bounds: Bounds;

  private view: WalkerView;

  constructor(x: number, y: number, bounds: Bounds, view: WalkerView) {
    this.x = x;
    this.y = y;
    this.bounds = bounds;

    this.view = view;

    this.view.x = this.x;
    this.view.y = this.y;
  }

  public update(): void {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;

    this.x += dx * this.stepSize;
    this.y += dy * this.stepSize;

    this.x = Math.max(0, Math.min(this.bounds.width, this.x));
    this.y = Math.max(0, Math.min(this.bounds.height, this.y));

    this.view.x = this.x;
    this.view.y = this.y;
  }
}
