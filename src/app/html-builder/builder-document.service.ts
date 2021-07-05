import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, Subject} from 'rxjs';
import {BuilderDocumentActions} from './builder-document-actions.service';
import {Settings} from '@common/core/config/settings.service';
import {ContextBoxes} from './live-preview/context-boxes.service';
import {BuilderTemplate} from '../shared/builder-types';
import {DomHelpers} from '../shared/dom-helpers.service';
import {randomString} from '@common/core/utils/random-string';
import {getProductionHtml} from './utils/parse-html-into-document';
import {MainLoaderService} from './main-loader/main-loader.service';
import {share} from 'rxjs/operators';

export type changeSources = 'builder' | 'codeEditor' | 'activeProject';

@Injectable({
    providedIn: 'root'
})
export class BuilderDocument {
    public document: Document;
    public baseUrl: string;
    public contentChanged = new Subject<changeSources>();
    public loaded$ = new ReplaySubject(1);
    private template: BuilderTemplate;

    constructor(
        public actions: BuilderDocumentActions,
        private settings: Settings,
        private contextBoxes: ContextBoxes,
        private mainLoader: MainLoaderService,
    ) {
        this.actions.setChangedSubject(this.contentChanged);
    }

    public getInnerHtml(): string {
        return this.document.documentElement.innerHTML;
    }

    public getOuterHtml(): string {
        return getProductionHtml(this.document.documentElement.outerHTML, this.template?.config);
    }

    public get(): Document {
        return this.document;
    }

    public getBody(): HTMLBodyElement {
        return this.document.body as HTMLBodyElement;
    }

    public focus() {
        const body = this.getBody();
        body && body.focus();
    }

    public getScrollTop(): number {
        if ( ! this.document.documentElement) return 0;
        return this.document.documentElement.scrollTop || this.getBody().scrollTop;
    }

    public scrollIntoView(node: HTMLElement) {
        if ( ! node) return;
        node.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
    }

    public elementFromPoint(x: number, y: number): HTMLElement {
        return this.document.elementFromPoint(x, y) as HTMLElement;
    }

    /**
     * Reload css from specified stylesheet link.
     */
    public reloadCustomElementsCss() {
        const link = this.find('#custom-elements-css');
        const newHref = link.getAttribute('href').split('?')[0] + '?=' + randomString(8);
        link.setAttribute('href', newHref);
    }

    public createElement(tagName: string): HTMLElement {
        return this.document.createElement(tagName);
    }

    public on(name: string, callback: Function, useCapture?: boolean) {
        this.document.addEventListener(name as any, callback as any, useCapture);
    }

    public find(selector: string): HTMLElement {
        return this.document.querySelector(selector) as HTMLElement;
    }

    public findAll(selector: string): NodeListOf<HTMLElement> {
        return this.document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    }

    public execCommand(name: string, value?: string) {
        return this.document.execCommand(name, null, value);
    }

    public queryCommandState(name: string): boolean {
        return this.document.queryCommandState(name);
    }

    public update(options: {html: string, template?: BuilderTemplate, theme?: boolean, source?: changeSources}): Observable<any> {
        this.mainLoader.loading$.next(true);

        options = Object.assign({}, {
            template: this.template,
            source: 'builderDocument'
        }, options);

        this.template = options.template || this.template;
        const config = {includeBootstrap: true, ...this.template?.config, theme: options.theme};

        this.contextBoxes.hideBoxes();
        this.document.body.scrollTop = 0;
        this.document.documentElement.innerHTML = getProductionHtml(options.html, config);
        this.addIframeCss();
        this.contentChanged.next(options.source);

        // wait until all css stylesheets are loaded
        const links = Array.from(this.document.head.querySelectorAll('link'));
        const promises = links.filter(link => link.href.endsWith('.css') && !link.sheet).map(link => {
            return new Promise(r => link.addEventListener('load', r));
        });

        const observable = from(Promise.all(promises)).pipe(share());
        observable.subscribe(() => {
            // fire window "load" event so loaders and other things are hidden when page is changed
            this.document.defaultView.dispatchEvent(new Event('load'));
            this.mainLoader.loading$.next(false);
        });
        return observable;
    }

    public getMetaTagValue(name: string) {
        const node = this.document.querySelector(`meta[name=${name}]`);
        return node && node.getAttribute('content');
    }

    public setMetaTagValue(name: string, value: string) {
        let node = this.document.querySelector(`meta[name=${name}]`);
        if ( ! node) {
            node = this.document.createElement('meta');
            this.document.head.appendChild(node);
        }

        node.setAttribute('name', name);
        node.setAttribute('content', value);
    }

    public getTitleValue() {
        const node = this.document.querySelector('title');
        return node && node.innerText;
    }

    public setTitleValue(value: string) {
        let node = this.document.querySelector('title');
        if ( ! node) {
            node = this.document.createElement('title');
            this.document.head.appendChild(node);
        }

        node.innerText = value;
    }

    /**
     * Set template that is currently applied to project.
     */
    public setTemplate(template: BuilderTemplate) {
        this.template = template;
    }

    /**
     * Add html builder iframe css to the document.
     */
    public addIframeCss() {
        const url = this.settings.getAssetUrl() + 'css/iframe.css';
        const link = DomHelpers.createLink(url, 'preview-css');
        this.document.head.appendChild(link);
    }
}
