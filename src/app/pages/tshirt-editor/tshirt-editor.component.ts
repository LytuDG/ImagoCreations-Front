import {
  Component, ElementRef, viewChild, afterNextRender,
  HostListener, OnDestroy, signal, computed, effect
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';
import { fabric } from 'fabric';

interface ProductItem {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-tshirt-editor',
  standalone: true,
  imports: [FormsModule, ButtonModule, ColorPickerModule, TooltipModule],
  template: `
    <div class="flex flex-col items-center gap-4 p-2 sm:p-6 w-full bg-gray-50 min-h-screen">

      <div class="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-100 w-full max-w-4xl justify-between items-center">

        <div class="flex flex-col gap-2 w-full lg:w-auto items-center lg:items-start text-center lg:text-left">
          <span class="text-xs font-bold text-gray-400 uppercase">Producto</span>
          <div class="flex flex-wrap justify-center gap-2">
            @for (item of products; track item.name) {
              <button
                (click)="changeProduct(item)"
                [class.border-blue-500]="selectedProduct()?.name === item.name"
                class="p-2 border-2 border-gray-100 rounded-lg hover:bg-blue-50 transition-all bg-white shadow-sm">
                <img [src]="item.url" [alt]="item.name" class="w-8 h-8 sm:w-10 sm:h-10 object-contain">
              </button>
            }
          </div>
        </div>

        <div class="flex flex-col gap-2 w-full lg:w-auto items-center lg:items-start border-y lg:border-y-0 lg:border-x border-gray-100 py-4 lg:py-0 lg:px-6">
          <span class="text-xs font-bold text-gray-400 uppercase">Personaliza</span>
          <div class="flex items-center gap-4">
            <p-colorPicker
              [ngModel]="customColor()"
              (ngModelChange)="customColor.set($event); changeShirtColor($event)"
              format="hex">
            </p-colorPicker>
            <input type="file" #fileInput (change)="onUpload($event)" accept="image/*" class="hidden">
            <p-button label="Subir Logo" icon="pi pi-image" severity="primary" size="small" (onClick)="fileInput.click()" />
          </div>
        </div>

        <div class="flex gap-2 w-full lg:w-auto justify-center">
          <p-button icon="pi pi-trash" severity="danger" [outlined]="true" (onClick)="removeSelected()" pTooltip="Borrar Logo" />
          <p-button label="Exportar" icon="pi pi-download" severity="success" (onClick)="exportToPNG()" class="flex-1 lg:flex-none" />
        </div>
      </div>

      <div #container class="w-full max-w-[600px] aspect-square bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center relative">
        <canvas #canvasElement></canvas>

        <div class="absolute bottom-2 right-4 text-[10px] text-gray-400 pointer-events-none uppercase tracking-widest">
           {{ selectedProduct()?.name }}
        </div>
      </div>

    </div>
  `,
  styles: [`
    ::ng-deep .canvas-container { margin: 0 auto !important; }
    ::ng-deep .p-colorpicker-preview {
      border: 1px solid #e2e8f0 !important;
      border-radius: 4px !important;
    }
  `]
})
export class TshirtEditor implements OnDestroy {
  // New Signal-based View Queries
  private readonly canvasEl = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');
  private readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  // State Management with Signals
  readonly customColor = signal('#ffffff');
  readonly selectedProduct = signal<ProductItem | null>(null);

  private canvas!: fabric.Canvas;
  private backgroundObject!: fabric.Image;

  readonly products: ProductItem[] = [
    { name: 'Pullover', icon: 'sweatshirt', url: 'img/pullover.png' },
    { name: 'Polo', icon: 'polo', url: 'img/polo.png' },
    { name: 'Hoodie', icon: 'hoodie', url: 'img/hoodie.png' },
    { name: 'T-Shirt', icon: 'tshirt', url: 'img/tshirt.png' },
  ];

  constructor() {
    // afterNextRender garantiza que el DOM esté listo (sustituye AfterViewInit para SSR/Hydration)
    afterNextRender(() => {
      this.initCanvas();
    });
  }

  private initCanvas() {
    const el = this.canvasEl()?.nativeElement;
    if (!el) return;

    this.canvas = new fabric.Canvas(el);
    this.resizeCanvas();
    this.changeProduct(this.products[0]);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const containerEl = this.container()?.nativeElement;
    if (!containerEl || !this.canvas) return;

    const width = containerEl.clientWidth;
    this.canvas.setDimensions({ width, height: width });

    if (this.backgroundObject) {
      this.backgroundObject.scaleToWidth(width);
      this.canvas.renderAll();
    }
  }

  changeProduct(item: ProductItem) {
    this.selectedProduct.set(item);
    const canvasWidth = this.canvas.getWidth();

    fabric.Image.fromURL(item.url, (img) => {
      img.scaleToWidth(canvasWidth);
      this.applyColorFilter(img, this.customColor());
      this.backgroundObject = img;
      this.canvas.setBackgroundImage(this.backgroundObject, this.canvas.renderAll.bind(this.canvas));
      this.canvas.renderAll();
    });
  }

  changeShirtColor(colorHex: any) {
    if (!this.backgroundObject) return;
    const hex = typeof colorHex === 'string' ? colorHex : colorHex.value;
    const color = hex.startsWith('#') ? hex : `#${hex}`;
    this.applyColorFilter(this.backgroundObject, color);
    this.canvas.renderAll();
  }

  private applyColorFilter(img: fabric.Image, color: string) {
    img.filters = color.toLowerCase() === '#ffffff'
      ? []
      : [new fabric.Image.filters.BlendColor({
          color: color,
          mode: 'multiply',
          alpha: 1
        })];
    img.applyFilters();
  }

  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target?.result as string, (img) => {
        const canvasWidth = this.canvas.getWidth();
        img.scaleToWidth(canvasWidth * 0.3);
        img.set({
          left: canvasWidth / 2 - (canvasWidth * 0.15),
          top: canvasWidth / 2.5,
          cornerSize: canvasWidth > 400 ? 8 : 12,
          transparentCorners: false,
          cornerColor: '#3b82f6'
        });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  }

  removeSelected() {
    const active = this.canvas.getActiveObject();
    if (active) this.canvas.remove(active);
  }

  exportToPNG() {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    const link = document.createElement('a');
    link.download = `diseno-${this.selectedProduct()?.name}.png`;
    link.href = this.canvas.toDataURL({ format: 'png', multiplier: 2 });
    link.click();
  }

  @HostListener('document:keydown.delete')
  onDelete() { this.removeSelected(); }

  ngOnDestroy() {
    this.canvas?.dispose();
  }
}
