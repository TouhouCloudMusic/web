declare module 'croppie' {
  interface CroppieOptions {
    viewport?: {
      width: number;
      height: number;
      type?: 'square' | 'circle';
    };
    boundary?: {
      width: number;
      height: number;
    };
    customClass?: string;
    enableExif?: boolean;
    enableOrientation?: boolean;
    enableZoom?: boolean;
    enableResize?: boolean;
    mouseWheelZoom?: boolean;
    showZoomer?: boolean;
  }

  interface CroppieResult {
    type?: 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas';
    size?: 'viewport' | 'original';
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
    circle?: boolean;
  }

  class Croppie {
    constructor(element: HTMLElement, options?: CroppieOptions);
    bind(options: { url: string; points?: number[]; zoom?: number; orientation?: number }): Promise<void>;
    destroy(): void;
    result(options?: CroppieResult): Promise<string | Blob | HTMLElement>;
    rotate(degrees: number): void;
    setZoom(value: number): void;
  }

  export default Croppie;
} 