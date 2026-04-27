import type { Bounds, Updatable } from "./interfaces";

interface LogoView {
  x: number;
  y: number;
}

export class Logo implements Updatable {
  private x: number;
  private y: number;
  private w: number;
  private h: number;
  private dx: number = 1;
  private dy: number = 1;
  private stepSize: number = 2;
  private bounds: Bounds;
  private view: LogoView;
  private dragging: boolean = false;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    bounds: Bounds,
    view: LogoView,
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bounds = bounds;

    if (Math.random() > 0.5) {
      this.dx *= -1;
    }

    if (Math.random() > 0.5) {
      this.dy *= -1;
    }

    this.view = view;

    this.view.x = this.x;
    this.view.y = this.y;
  }

  public moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;

    this.view.x = this.x;
    this.view.y = this.y;
  }

  public isDragging(): boolean {
    return this.dragging;
  }

  public startDragging() {
    this.dragging = true;
  }

  public stopDragging()
  {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.w >= this.bounds.width) {
      this.x = this.bounds.width - this.w - 1;
    }

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.h >= this.bounds.height) {
      this.y = this.bounds.height - this.h - 1;
    }
    this.dragging = false;
  }

  public setStepSize(stepSize: number) {
    this.stepSize = stepSize;
  }

  public update(): void {
    if (!this.dragging) {
      this.x += this.dx * this.stepSize;
    this.y += this.dy * this.stepSize;

    if (this.x + this.w >= this.bounds.width || this.x < 0) {
      this.dx *= -1;
      this.x += this.dx * this.stepSize;
    }

    if (this.y + this.h >= this.bounds.height || this.y < 0) {
      this.dy *= -1;
      this.y += this.dy * this.stepSize;
    }

    this.view.x = this.x;
    this.view.y = this.y;
    }
  }
}
