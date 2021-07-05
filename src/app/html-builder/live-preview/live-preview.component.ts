import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {LivePreview} from '../live-preview.service';
import {ContextBoxes} from './context-boxes.service';
import {ContextBoxComponent} from './context-box/context-box.component';
import {fromEvent, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'live-preview',
    templateUrl: './live-preview.component.html',
    styleUrls: ['./live-preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LivePreviewComponent implements OnInit, OnDestroy {
    @ViewChild('iframe', {static: true}) iframe: ElementRef;
    @ViewChild('hoverBox', {static: true}) hoverBox: ContextBoxComponent;
    @ViewChild('selectedBox', {static: true}) selectedBox: ContextBoxComponent;
    @ViewChild('dragOverlay', {static: true}) dragOverlay: ElementRef<HTMLElement>;
    private wheelSub: Subscription;

    constructor(
        public livePreview: LivePreview,
        private contextBoxes: ContextBoxes,
    ) {}

    ngOnInit() {
        this.contextBoxes.set(this.hoverBox.el.nativeElement, this.selectedBox.el.nativeElement, this.iframe);
        this.livePreview.iframe = this.iframe.nativeElement;

        this.wheelSub = fromEvent(window, 'wheel')
            .pipe(filter(() => this.livePreview.dragging))
            .subscribe((e: WheelEvent) => {
                this.livePreview.iframe.contentDocument.documentElement.scrollTop += e.deltaY;
            });
    }

    ngOnDestroy() {
        this.wheelSub.unsubscribe();
    }
}
