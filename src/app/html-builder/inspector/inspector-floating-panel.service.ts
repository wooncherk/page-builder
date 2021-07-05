import {ElementRef, Injectable} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';
import {OverlayPanel} from '../../../common/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from '../../../common/core/ui/overlay-panel/overlay-panel-ref';

@Injectable({
    providedIn: 'root'
})
export class InspectorFloatingPanel {
    public overlayRef: OverlayPanelRef<any>;

    constructor(private overlayPanel: OverlayPanel) {}

    public open<T>(component: ComponentType<T>, origin: ElementRef): OverlayPanelRef<T> {
        this.close();

        const positionStrategy = this.overlayPanel.overlay.position().flexibleConnectedTo(origin)
            .withPositions([
                {originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 35},
                {originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: 35},
            ]);

        this.overlayRef = this.overlayPanel.open(component, {
            origin,
            positionStrategy,
            hasBackdrop: true,
        });

        return this.overlayRef;
    }

    public close() {
        if ( ! this.overlayRef) return;
        this.overlayRef.close();
    }
}
