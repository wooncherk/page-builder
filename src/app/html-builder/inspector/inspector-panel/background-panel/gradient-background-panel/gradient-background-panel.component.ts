import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {baseGradients} from '../../../../gradient-values';
import {OverlayPanelRef} from '../../../../../../common/core/ui/overlay-panel/overlay-panel-ref';

@Component({
    selector: 'gradient-background-panel',
    templateUrl: './gradient-background-panel.component.html',
    styleUrls: ['./gradient-background-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GradientBackgroundPanelComponent {
    public gradients = baseGradients.slice();

    constructor(
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef
    ) { }

    public emitSelectedEvent(gradient: string) {
        this.overlayRef.emitValue(gradient);
    }
}
