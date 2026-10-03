declare module "page-flip" {
  export interface IFlipSetting {
    startPage?: number;
    size?: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: IFlipSetting);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    loadFromImages(imagesPaths: string[]): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(pageNum: number): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(pageNum: number, corner?: "top" | "bottom"): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): "portrait" | "landscape";
    getBoundsRect(): DOMRect;
    on(eventName: string, callback: (e: any) => void): PageFlip;
    off(eventName: string): PageFlip;
    destroy(): void;
  }
}
