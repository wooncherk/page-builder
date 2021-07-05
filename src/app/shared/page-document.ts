import {DomHelpers} from './dom-helpers.service';
import {BuilderTemplate} from './builder-types';
import {randomString} from '@common/core/utils/random-string';

export class PageDocument {
    protected pageDocument: Document;
    protected baseUrl: string;
    protected tempBaseUrl: string;

    constructor(baseUrl: string = null) {
        this.baseUrl = baseUrl;
        this.tempBaseUrl = `https://${randomString()}.com`;
    }

    /**
     * Ids of dom elements that are created by the builder and are not part of the project.
     */
    protected internalIds = [
        '#base', '#jquery', '#custom-css', '#custom-js', '#template-js', '[id^=library]', '#theme-css',
        '#template-css', '#framework-css', '#framework-js', '#preview-css', '#font-awesome', '#custom-elements-css',
        '#bootstrap-css', '#bootstrap-js',
    ];

    public getOuterHtml(): string {
        return this.replaceTempBaseUrl('<!DOCTYPE html>' + this.pageDocument.documentElement.outerHTML, '/');
    }

    public getInnerHtml(): string {
        return this.replaceTempBaseUrl(this.pageDocument.documentElement.innerHTML);
    }

    public setBaseUrl(url: string): PageDocument {
        this.baseUrl = url;
        return this;
    }

    public generate(html: string = '', template?: BuilderTemplate): PageDocument {
        this.pageDocument = new DOMParser().parseFromString(html?.trim(), 'text/html');

        // remove old link/script nodes to frameworks, icons, templates etc.
        this.internalIds.forEach(id => {
            const els = this.pageDocument.querySelectorAll(id);
            for (let i = 0; i < els.length; i++) {
                els[i].parentElement.removeChild(els[i]);
            }
        });

        this.addBaseElement();
        this.maybeAddBootstrap();
        this.addFontawesome();

        // theme
        this.createLinkOrScript('link', 'css/theme.css', 'theme-css');

        // custom elements css
        this.createLinkOrScript('link', 'css/custom_elements.css', 'custom-elements-css');

        if (template) {
            this.addTemplate(template);
        }

        this.createLinkOrScript('link', 'css/styles.css', 'custom-css');
        this.createLinkOrScript('script', 'js/scripts.js', 'custom-js');

        return this;
    }

    private addTemplate(template: BuilderTemplate) {
        // legacy libraries
        if (template.config.libraries) {
            template.config.libraries.forEach(library => {
                this.createLinkOrScript('script', `js/${library}.js`, `library-${library}`);
            });
        }

        this.createLinkOrScript('link', 'css/template.css', 'template-css');
        this.createLinkOrScript('script', 'js/template.js', 'template-js');
    }

    protected addBaseElement() {
        const base = this.pageDocument.createElement('base') as HTMLBaseElement;
        base.id = 'base';
        base.href = this.tempBaseUrl;
        this.pageDocument.head.insertBefore(base, this.pageDocument.head.firstChild);
    }

    protected addFontawesome() {
        this.createLinkOrScript('link', 'css/font-awesome.css', 'font-awesome');
    }

    protected maybeAddBootstrap() {
        this.createLinkOrScript('link', 'bootstrap/bootstrap.min.css', 'bootstrap-css');
        this.createLinkOrScript('script', 'bootstrap/jquery.min.js', 'jquery');
        this.createLinkOrScript('script', 'bootstrap/bootstrap.min.js', 'bootstrap-js');
    }

    private createLinkOrScript(type: 'link'|'script', uri: string, id: string) {
        const query  = randomString(8);
        uri = (this.baseUrl || '') + uri + '?=' + query;

        if (type === 'link') {
            this.pageDocument.head.appendChild(DomHelpers.createLink(uri, id));
        } else {
            this.pageDocument.body.appendChild(DomHelpers.createScript(uri, id));
        }
    }

    protected replaceTempBaseUrl(html: string, replacement?: string) {
        // Use invalid base url to prevent execution of template js,
        // and modification of original template html via js, for example,
        // loader elements might be set to "display: none" via js
        // which will modify original template html and cause issues in the project
        return html.replace(this.tempBaseUrl, replacement || this.baseUrl);
    }
}
