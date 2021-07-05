import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input
} from '@angular/core';
import {ContextBoxes} from '../context-boxes.service';
import {SelectedElement} from '../selected-element.service';
import {BuilderDocumentActions} from '../../builder-document-actions.service';
import {InlineTextEditor} from '../inline-text-editor/inline-text-editor.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Inspector} from '../../inspector/inspector.service';
import {ActiveProject} from '../../projects/active-project';
import {LivePreview} from '../../live-preview.service';
import {Elements} from '../../elements/elements.service';
import {LinkEditor} from '../link-editor/link-editor.service';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';

@Component({
    selector: 'context-box',
    templateUrl: './context-box.component.html',
    styleUrls: ['./context-box.component.scss'],
    providers: [UploadQueueService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextBoxComponent  {
    @Input() type: 'selected'|'hover' = 'hover';
    @HostBinding('class.type-selected') get typeSelected() {
        return this.type === 'selected';
    }

    constructor(
        public livePreview: LivePreview,
        private builderActions: BuilderDocumentActions,
        private selectedElement: SelectedElement,
        private inspector: Inspector,
        private modal: Modal,
        private activeProject: ActiveProject,
        private contextBoxes: ContextBoxes,
        private inlineTextEditor: InlineTextEditor,
        public el: ElementRef<HTMLElement>,
        private elements: Elements,
        private linkEditor: LinkEditor,
        private uploadQueue: UploadQueueService,
    ) {}

    public deleteNode() {
        this.builderActions.removeNode(this.livePreview[this.type].node);
    }

    public editNode() {
        const node = this.livePreview[this.type].node;
        if (this.elements.isLayout(node)) {
            this.inspector.openPanel('layout');
        } else if (this.elements.isImage(node)) {
            this.openUploadImageModal();
        } else if (this.elements.isLink(node)) {
            this.linkEditor.open(node as HTMLLinkElement);
        } else if (this.elements.isIcon(node)) {
            this.inlineTextEditor.open(node, {activePanel: 'icons'});
        } else if (this.elements.canModifyText(this.elements.match(node))) {
            this.contextBoxes.hideBoxes();
            this.inlineTextEditor.open(node);
        } else {
            this.selectedElement.selectNode(node);
            this.inspector.togglePanel('inspector');
        }
    }

    private openUploadImageModal() {
        const config = {uri: 'uploads/images', httpParams: {diskPrefix: this.activeProject.getBaseUrl(true) + 'images'}};
        openUploadWindow({types: [UploadInputTypes.image]}).then(files => {
            this.uploadQueue.start(files, config).subscribe(response => {
                (this.livePreview[this.type].node as HTMLImageElement).src = this.activeProject.getImageUrl(response.fileEntry);
            });
        });
    }
}
