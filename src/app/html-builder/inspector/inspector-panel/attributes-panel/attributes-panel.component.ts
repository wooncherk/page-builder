import {Component, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {LivePreview} from '../../../live-preview.service';
import {UndoManager} from '../../../undo-manager/undo-manager.service';
import {ActiveElement} from '../../../live-preview/active-element';
import {SelectedElement} from '../../../live-preview/selected-element.service';

@Component({
    selector: 'attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AttributesPanelComponent implements OnInit {

    public customAttributes: object = {};

    /**
     * Selected element "float" position.
     */
    public position = 'none';

    /**
     * Selected element classes.
     */
    public classes: string[] = [];

    public hiddenOn: string[] = [];
    public canHideOn = {
        xs: 'd-sm-block',
        sm: 'd-md-block',
        md: 'd-lg-block',
        lg: 'd-xl-block',
    };

    /**
     * Selected element ID.
     */
    public id: string;

    constructor(
        private livePreview: LivePreview,
        private undoManager: UndoManager,
        private selectedElement: SelectedElement,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.selectedElement.changed.subscribe(() => {
            this.onElementSelected();
        });
    }

    private onElementSelected() {
        this.customAttributes = {};
        this.classes = [];
        this.hiddenOn = [];

        this.callElementOnAssign(this.selectedElement);

        if (!this.selectedElement.node || !this.selectedElement.node.classList) return;

        // set element classes
        for (let i = 0; i < this.selectedElement.node.classList.length; i++) {
            const className = this.selectedElement.node.classList[i],
                hiddenClasses = this.selectedElement.element.hiddenClasses;

            if (hiddenClasses && hiddenClasses.indexOf(className) > -1) continue;

            this.classes.push(className);
        }

        // set element id
        this.id = this.selectedElement.node.id;

        // set element position
        ['pull-left', 'pull-right', 'center-block'].forEach(float => {
            const className = this.selectedElement.node.className;
            if (typeof className === 'string' && className.indexOf(float) > -1) {
                this.position = float;
            } else {
                this.position = 'none';
            }
        });

        // set 'bootstrap' visibility
        if (this.selectedElement.node.classList.contains('d-none')) {
            Object.entries(this.canHideOn).forEach(([breakpoint, className]) => {
                if ( ! this.selectedElement.node.classList.value.includes(className)) {
                    this.hiddenOn.push(breakpoint);
                }
            });
        }
    }

    /**
     * Add given float class to active html node
     * and remove all other ones present on it.
     */
    public changeElPosition(position: string) {
        this.removeClass(['pull-left', 'pull-right', 'center-block']);

        if (position && position !== 'none') {
            this.addClass([position]);
        }

        this.livePreview.repositionBox('selected');
    }

    /**
     * Change selected element ID to specifie one.
     */
    public changeElId(id: string) {
        this.selectedElement.node.id = id;
    }

    public changeVisibility(size: string) {
        const index = this.hiddenOn.indexOf(size);
        if (index > -1) {
            this.hiddenOn.splice(index, 1);
        } else {
            this.hiddenOn.push(size);
        }

        // add "display: none" style if we are hiding element on at least one breakpoint
        if (this.hiddenOn.length) {
            this.selectedElement.node.classList.add('d-none');
        } else {
            this.selectedElement.node.classList.remove('d-none');
        }

        // add classname to show element on every breakpoint that is not hidden
        Object.entries(this.canHideOn).forEach(([breakpoint, className]) => {
            if ( ! this.hiddenOn.length || this.hiddenOn.includes(breakpoint)) {
                this.selectedElement.node.classList.remove(className);
            } else {
                this.selectedElement.node.classList.add(className);
            }
        });

        this.livePreview.repositionBox('selected');
    }

    /**
     * Remove specified classes from active html node and from Inspector styles object.
     */
    public removeClass(classes: string[], addUndo = true) {
        classes.forEach(className => {
            const i = this.classes.indexOf(className);
            if (i > -1) {
                this.classes.splice(i, 1);
            }
            this.selectedElement.node.classList.remove(className);
        });

        if (addUndo) {
            this.undoManager.add('generic', {
                undo: () => {this.addClass(classes, false); },
                redo: () => {this.removeClass(classes, false); },
            });
        }

        this.livePreview.repositionBox('selected');
    }

    /**
     * Add given class to active html node and to inspector styles object.
     */
    public addClass(classes: string[], addUndo = true) {
        if (classes.length === 1 && ! classes[0].length) return;

        classes.forEach(className => {
            if (className && className.length && this.classes.indexOf(className) === -1) {
                this.classes.push(className);
            }

            this.selectedElement.node.classList.add(className);
        });

       if (addUndo) {
           this.undoManager.add('generic', {
               undo: () => {this.removeClass(classes, false); },
               redo: () => {this.addClass(classes, false); },
           });
       }

       this.livePreview.repositionBox('selected');
    }

    public callElementOnChange(key: string, newValue: string) {
        const oldValue = this.customAttributes[key].value;
        this.customAttributes[key].value = newValue;

        this.makeUndoCommand(this.customAttributes[key].onChange, oldValue, newValue);

        if (this.customAttributes[key].onChange) {
            this.customAttributes[key].onChange(this.livePreview, newValue);
        } else {
            this.defaultOnChange(this.customAttributes[key]);
        }

        this.livePreview.repositionBox('selected');
    }

    /**
     * Check if specified class should be hidden in inspector.
     */
    public shouldClassBeHidden(className: string): boolean {
        if (className.indexOf('d-') > -1) return true;
        if (className.indexOf('col-') > -1) return true;
        return false;
    }

    /**
     * Create an undo command for custom elements attributes
     */
    private makeUndoCommand(func: Function, oldVal: string, newVal: string) {
        this.undoManager.add('generic', {
            undo: () => {
                func(this.livePreview, oldVal);
            },
            redo: () => {
                func(this.livePreview, newVal);
            }
        });
    }

    /**
     * Fire specified element 'onAssign' callback.
     */
    private callElementOnAssign(selected: ActiveElement) {
        for (const attr in selected.element.attributes) {
            this.customAttributes[attr] = Object.assign({}, selected.element.attributes[attr]);

            if (this.customAttributes[attr].onAssign) {
                this.customAttributes[attr].onAssign(this.livePreview);
            } else {
                this.defaultOnAssign(this.customAttributes[attr]);
            }
        }
    }

    public getElAttributeKeys(el: object) {
        return Object.keys(el);
    }

    /**
     * Default on assign action for custom options dropdown.
     */
    private defaultOnAssign(attr: {list: any[], value: any}) {
        let first = null;

        for (let i = attr.list.length - 1; i >= 0; i--) {
            first = attr.list[i];

            if (this.selectedElement.node.className.indexOf(attr.list[i].value) > -1) {
                return attr.value = attr.list[i];
            }
        }

        // if we can't find any classes just set first
        // value on the select list as current value
        return attr.value = first;
    }


    /**
     * Default on change action for custom options dropdown.
     */
    private defaultOnChange(attr: {list: any[], value: any}) {
        for (let i = attr.list.length - 1; i >= 0; i--) {
            this.renderer.removeClass(this.selectedElement.node, attr.list[i].value);
        }

        this.renderer.addClass(this.selectedElement.node, attr.value);

        setTimeout(() => this.livePreview.repositionBox('selected'), 300);
    }
}
