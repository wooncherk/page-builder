import {Injectable} from '@angular/core';
import {ActiveElement} from './active-element';
import {Elements} from '../elements/elements.service';
import {ContextBoxes} from './context-boxes.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SelectedElement extends ActiveElement {
    public changed = new BehaviorSubject(null);
    public isIcon = false;
    public isLink = false;
    public isLayout = false;

    constructor(
        private elements: Elements,
        private contextBoxes: ContextBoxes,
    ) {
        super();
    }

    public selectParent() {
        this.selectNode(this.node.parentElement);
    }

    public canSelectParent() {
        if ( ! this.node) return false;
        const parent = this.node.parentElement;
        return parent && parent.nodeName.toLowerCase() !== 'body';
    }

    public selectFirstChild() {
        this.selectNode(this.node.firstChild as HTMLElement);
    }

    public canSelectChild() {
        if ( ! this.node) return false;
        return this.node.firstChild;
    }

    public getStyle(name: string): string {
        if ( ! this.node) return null;
        return window.getComputedStyle(this.node)[name];
    }

    /**
     * Check if specified property/style of this element can be modified.
     */
    public canModify(property: string) {
        return this.elements.canModify(property, this.element);
    }

    /**
     * Select specified node as active one in the builder.
     */
    public selectNode(node: HTMLElement) {
        if ( ! node || node.nodeType !== Node.ELEMENT_NODE || this.node === node) return;

        if (node.nodeName.toLowerCase() === 'html') {
            node = node.querySelector('body');
        }
        if (node.nodeName.toLowerCase() === 'path') {
            node = node.closest('svg') as any;
        }

        // if we haven't already stored a reference to passed in node, do it now
        if (node && this.node !== node) {
            this.node = node as HTMLElement;
        }

        // cache some more references about the node for later use
        this.element = this.elements.match(this.node, 'select', true);
        this.parent = this.node.parentElement;

        // position select box on top of the newly selected node
        this.contextBoxes.repositionBox('selected', this.node);

        // whether or not the new node is locked
        this.locked = typeof this.node.className === 'string' && this.node.className.indexOf('locked') > -1;

        this.isImage = this.node.nodeName.toLowerCase() === 'img';
        this.isIcon = this.elements.isIcon(this.node);
        this.isLink = this.elements.isLink(this.node);
        this.isLayout = this.elements.isLayout(this.node);

        // create an array from all parents of this node
        let el = this.node;
        this.path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE && el.nodeName.toLowerCase() !== 'body') {
            this.path.unshift({node: el, name: this.elements.getDisplayName(this.elements.match(el), el)});
            el = el.parentElement;
        }

        this.changed.next(this);
    }

    public isHtmlOrBody() {
        return this.node.nodeName === 'BODY' || this.node.nodeName === 'HTML';
    }
}
