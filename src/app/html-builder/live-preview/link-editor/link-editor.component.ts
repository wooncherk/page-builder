import {Component, Inject, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {ActiveProject} from '../../projects/active-project';
import {BuilderDocument} from '../../builder-document.service';
import {OVERLAY_PANEL_DATA} from '@common/core/ui/overlay-panel/overlay-panel-data';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'link-editor',
    templateUrl: './link-editor.component.html',
    styleUrls: ['./link-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LinkEditorComponent implements OnInit {
    public hrefModel: string;
    public downloadName: string;
    public anchors$ = new BehaviorSubject<string[]>([]);

    constructor(
        public activeProject: ActiveProject,
        private builderDocument: BuilderDocument,
        @Inject(OVERLAY_PANEL_DATA) @Optional() public data: {node: HTMLLinkElement},
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef,
    ) {}

    ngOnInit() {
        this.anchors$.next(Array.from(this.builderDocument.document.querySelectorAll('*[id]'))
            .map((el: HTMLElement) => el.id));
    }

    public setEmail() {
        this.data.node.href = 'mailto:' + this.hrefModel;
        this.closeAndEmitChanges();
    }

    public setDownload() {
        this.data.node.href = this.hrefModel;
        this.data.node.setAttribute('download', this.downloadName);
        this.closeAndEmitChanges();
    }

    public setPageLink() {
        this.data.node.href = this.hrefModel + '.html';
        this.closeAndEmitChanges();
    }

    public setAnchor() {
        this.data.node.href = '#' + this.hrefModel;
        this.closeAndEmitChanges();
    }

    public setUrl() {
        this.data.node.href = this.hrefModel;
        this.closeAndEmitChanges();
    }

    public closeAndEmitChanges() {
        this.close();
        this.builderDocument.contentChanged.next('builder');
    }

    public close() {
        this.overlayRef.close();
    }

    public resetModel() {
        this.hrefModel = null;
    }
}
