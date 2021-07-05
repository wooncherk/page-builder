import {ElementRef, Injectable} from '@angular/core';
import {Elements} from '../elements/elements.service';
import {LocalStorage} from '@common/core/services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ContextBoxes {
    private previewRect: ClientRect;
    private hoverBox: HTMLElement;
    private selectedBox: HTMLElement;

    constructor(
        private elements: Elements,
        private localStorage: LocalStorage
    ) {}

    public repositionBox(name: 'hover'|'selected', node: HTMLElement) {
        // hide context boxes depending on user settings
        if ( ! this.localStorage.get('settings.' + name + 'BoxEnabled', true)) return;

        if ( ! node || node.nodeType !== Node.ELEMENT_NODE || this.nodeIsHtmlOrBody(node)) {
            return this.hideBox(name);
        }

        const rect = node.getBoundingClientRect();

        if ( ! rect.width || ! rect.height) {
            this.hideBox(name);
        } else {
            this.getBox(name).style.top = rect.top + 'px';
            this.getBox(name).style.left = rect.left + 'px';
            this.getBox(name).style.height = rect.height + 'px';
            this.getBox(name).style.width = rect.width + 'px';
            this.showBox(name);
        }

        // active compact mode if node is not wide enough to fit all buttons
        if (rect.width < 85) {
            this.getBox(name).classList.add('compact-mode');
        } else {
            this.getBox(name).classList.remove('compact-mode');
        }

        // place context box toolbar on the bottom, if there's not enough space top
        if (parseInt(this.getBox(name).style.top) < 20) {
            this.getBox(name).classList.add('toolbar-bottom');
        } else {
            this.getBox(name).classList.remove('toolbar-bottom');
        }
    }

    public hideBox(name: 'hover'|'selected') {
        const box = this.getBox(name);
        box && box.classList.add('hidden');
    }

    public hideBoxes() {
        this.hideBox('selected');
        this.hideBox('hover');
    }

    public showBox(name: 'hover'|'selected') {
        this.getBox(name).classList.remove('hidden');
    }

    public set(hover: HTMLElement, selected: HTMLElement, iframe: ElementRef) {
        this.hoverBox = hover;
        this.selectedBox = selected;
        this.previewRect = iframe.nativeElement.getBoundingClientRect();
    }

    public getBox(name: 'hover'|'selected'): HTMLElement {
        return name === 'hover' ? this.hoverBox : this.selectedBox;
    }

    private nodeIsHtmlOrBody(node: HTMLElement) {
        if ( ! node) return false;
        return node.nodeName === 'BODY' || node.nodeName === 'HTML';
    }
}
