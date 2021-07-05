import {randomString} from '@common/core/utils/random-string';
import {DomHelpers} from '../../shared/dom-helpers.service';
import {HtmlParserConfig} from '../../shared/builder-types';

export function getProductionHtml(html: string = '', config: HtmlParserConfig = {includeBootstrap: true}): string {
    return '<!DOCTYPE html>' + parseHtmlIntoDocument(html, config).documentElement.outerHTML;
}

function parseHtmlIntoDocument(html: string = '', config: HtmlParserConfig = {includeBootstrap: true}): Document {
    const pageDocument = new DOMParser().parseFromString(html?.trim(), 'text/html');

    // remove old link/script nodes to frameworks, icons, templates etc.
    INTERNAL_ASSET_IDS.forEach(id => {
        const els = pageDocument.querySelectorAll(id);
        for (let i = 0; i < els.length; i++) {
            els[i].parentElement.removeChild(els[i]);
        }
    });

    // remove "contenteditable" attribute
    pageDocument.querySelectorAll('[contenteditable]')
        .forEach(n => n.removeAttribute('contenteditable'));

    applyTemplateModifications(pageDocument, config);
    addCustomCssAndJsTags(pageDocument);

    if (config?.includeTheme) {
        pageDocument.head.appendChild(DomHelpers.createLink(`css/theme.css?${randomString(8)}`, 'theme-css'));
    }

    if (config?.includeBootstrap) {
        addBootstrap(pageDocument);
    }

    if (config?.includeBootstrap || config?.includeFontawesome) {
        addFontawesome(pageDocument);
    }

    // TODO: test template with loader to see if there are any issues
    // addBaseElement(pageDocument);

    return pageDocument;
}

function applyTemplateModifications(document: Document, config: HtmlParserConfig) {
    if (config) {
        // restore any specified elements, for example restore preloader element
        // that would be removed after by template after it's done loading
        if (config.nodesToRestore?.length) {
            config.nodesToRestore.forEach(nodeString => {
                const docFragment = document.createRange().createContextualFragment(nodeString);
                const nodeToRestore = docFragment.childNodes[0] as HTMLElement;
                if ( ! nodeToRestore.id || ! document.getElementById(nodeToRestore.id)) {
                    document.body.appendChild(nodeToRestore);
                }
            });
        }

        // remove specified classnames. For example template might add some classes
        // to nodes that are scrolled into view with animation after animation is done
        if (config.classesToRemove?.length) {
            config.classesToRemove.forEach(className => {
                document.body.querySelectorAll('.' + className).forEach(node => {
                    node.classList.remove(className);
                });
            });
        }
    }
}

function addBaseElement(document: Document) {
    const base = document.createElement('base') as HTMLBaseElement;
    base.id = 'base';
    base.href = `https://${randomString()}.com`;
    document.head.insertBefore(base, document.head.firstChild);
}

function addBootstrap(document: Document) {
    document.head.appendChild(DomHelpers.createLink(`bootstrap/bootstrap.min.css?${randomString(8)}`, 'bootstrap-css'));
    document.body.appendChild(DomHelpers.createScript(`bootstrap/jquery.min.js?${randomString(8)}`, 'jquery'));
    document.body.appendChild(DomHelpers.createScript(`bootstrap/bootstrap.min.js?${randomString(8)}`, 'bootstrap-js'));
}

function addFontawesome(document: Document) {
    document.head.appendChild(DomHelpers.createLink(`font-awesome/font-awesome.min.css?${randomString(8)}`, 'font-awesome'));
}

function addCustomCssAndJsTags(document: Document) {
    document.head.appendChild(DomHelpers.createLink(`css/custom_elements.css?${randomString(8)}`, 'custom-elements-css'));
    document.head.appendChild(DomHelpers.createLink(`css/code_editor_styles.css?${randomString(8)}`, 'custom-css'));
    document.body.appendChild(DomHelpers.createScript(`js/code_editor_scripts.js?${randomString(8)}`, 'custom-js'));
}

function replaceTempBaseUrl(html: string, replacement?: string) {
    // Use invalid base url to prevent execution of template js,
    // and modification of original template html via js, for example,
    // loader elements might be set to "display: none" via js
    // which will modify original template html and cause issues in the project
    return html.replace(this.tempBaseUrl, replacement || this.baseUrl);
}

const INTERNAL_ASSET_IDS = [
    'base', '#jquery', '#custom-css', '#custom-js', '#template-js', '[id^=library]', '#theme-css',
    '#template-css', '#framework-css', '#framework-js', '#preview-css', '#font-awesome', '#custom-elements-css',
    '#bootstrap-css', '#bootstrap-js', '.html2canvas-container',
];
