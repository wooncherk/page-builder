import {Component, Inject, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {HttpCacheClient} from '@common/core/http/http-cache-client';
import {FormControl} from '@angular/forms';
import {BuilderDocument} from '../../../../builder-document.service';
import {Settings} from '@common/core/config/settings.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {OverlayPanelRef} from '../../../../../../common/core/ui/overlay-panel/overlay-panel-ref';
import {SelectedElement} from '../../../../live-preview/selected-element.service';

@Component({
    selector: 'google-fonts-panel',
    templateUrl: './google-fonts-panel.component.html',
    styleUrls: ['./google-fonts-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GoogleFontsPanelComponent implements OnInit {

    public loading = false;

    public originalFonts = [];
    public filteredFonts = [];

    public searchControl = new FormControl();

    public fontPage = 0;

    constructor(
        private http: HttpCacheClient,
        private builderDocument: BuilderDocument,
        private settings: Settings,
        private selectedElement: SelectedElement,
        @Inject(OverlayPanelRef) @Optional() public overlayRef: OverlayPanelRef,
    ) {}

    ngOnInit() {
        this.getAll();
        this.bindToSearchQuery();
    }

    public close() {
        this.overlayRef.close();
    }

    public nextPage() {
        const nextPage = this.fontPage + 1;
        if (this.filteredFonts.length > nextPage) {
            this.fontPage++;
            this.loadIntoDom();
        }
    }

    public previousPage() {
        const previousPage = this.fontPage - 1;
        if (previousPage > 0) {
            this.fontPage--;
            this.loadIntoDom();
        }
    }

    public applyFont(fontFamily: string) {
        this.loadIntoDom([fontFamily], this.builderDocument.document.head);
        this.builderDocument.actions.applyStyle(this.selectedElement.node, 'fontFamily', fontFamily);
    }

    private getAll() {
        const key = this.settings.get('builder.google_fonts_api_key');
        this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + key)
            .subscribe(response => {
                this.originalFonts = this.createPaginator(response['items']);
                this.filteredFonts = this.originalFonts.slice();
                this.loadIntoDom();
            });
    }

    /**
     * Chunk array into 15 item chunks.
     */
    private createPaginator(fonts: any[]) {
        const paginator = [];

        while (fonts.length > 0) {
            paginator.push(fonts.splice(0, 15));
        }

        return paginator;
    }

    /**
     * Perform a search when user types into search input.
     */
    private bindToSearchQuery() {
        this.searchControl.valueChanges
            .pipe(debounceTime(100), distinctUntilChanged())
            .subscribe(query => {
                if ( ! query) this.filteredFonts = this.originalFonts;

                const filtered = [];
                this.originalFonts.forEach(page => {
                    page.forEach(font => {
                        if (font.family.toLowerCase().indexOf(query) > -1) {
                            filtered.push(font);
                        }
                    });
                });

                this.filteredFonts = this.createPaginator(filtered);
            });
    }

    /**
     * Load given google fonts into the DOM.
     */
    private loadIntoDom(names: any[] = null, context: HTMLHeadElement = null) {
        let head = context || document.head;
        this.loading = true;

        // make a list of fonts to load
        if ( ! names) {
            names = this.filteredFonts[this.fontPage].map(font => font.family);
        }

        // load fonts either to main window or iframe
        if ( ! context) {
            const link = head.querySelector('#dynamic-fonts');
            link && link.remove();
        }

        const gFontsLink = head.querySelector('#dynamic-fonts') as HTMLLinkElement;
        let compiled = names.join('|').replace(/ /g, '+');

        if (gFontsLink) {
            gFontsLink.href += '|' + compiled;
        } else {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css?family='+compiled;
            link.id = 'dynamic-fonts';

            head.appendChild(link);
        }

        this.loading = false;
    }
}
