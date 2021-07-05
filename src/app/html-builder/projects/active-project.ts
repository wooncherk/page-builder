import {Injectable} from '@angular/core';
import {BuilderDocument} from '../builder-document.service';
import * as html2canvas from 'html2canvas';
import {Toast} from '@common/core/ui/toast.service';
import {LocalStorage} from '@common/core/services/local-storage.service';
import {ProjectUrl} from '../../shared/projects/project-url.service';
import {Projects} from '../../shared/projects/projects.service';
import {Theme} from '../../shared/themes/Theme';
import {BuilderPage, BuilderProject, BuilderTemplate} from '../../shared/builder-types';
import {Templates} from '../../shared/templates/templates.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {debounceTime, share, switchMap, tap} from 'rxjs/operators';
import {Settings} from '@common/core/config/settings.service';
import {FileEntry} from '@common/uploads/types/file-entry';
import {isAbsoluteUrl} from '@common/core/utils/is-absolute-url';
import {getProductionHtml} from '../utils/parse-html-into-document';

@Injectable({
    providedIn: 'root'
})
export class ActiveProject {
    public activeTemplate: BuilderTemplate;
    public pages$ = new BehaviorSubject<BuilderPage[]>([]);
    public activePage$ = new BehaviorSubject<BuilderPage>(null);
    public project: BuilderProject;
    public saving = false;

    constructor(
        private settings: Settings,
        private builderDocument: BuilderDocument,
        public projectUrl: ProjectUrl,
        private projects: Projects,
        private templates: Templates,
        private toast: Toast,
        private localStorage: LocalStorage,
    ) {
        this.bindToBuilderDocumentChangeEvent();
    }

    public get(): BuilderProject {
        return this.project;
    }

    public save(options: {thumbnail?: boolean, params?: object} = {thumbnail: true}): Observable<{project: BuilderProject}> {
        this.saving = true;

        if (options.thumbnail) {
            this.createThumbnail();
        }

        if ( ! options.params) options.params = {};

        // update html of active page, so it's synced with the builder
        this.activePage$.value.html = this.builderDocument.getOuterHtml();

        const payload = Object.assign({}, options.params, {
            name: this.project.model.name,
            css: this.project.css,
            js: this.project.js,
            theme: this.project.model.theme,
            template: this.project.model.template,
            pages: this.pages$.value.map(page => {
                return {name: page.name, html: page.html};
            })
        });

        const request = this.projects.update(this.project.model.id, payload).pipe(share());

        request.subscribe(response => {
            this.project = response.project;
            this.saving = false;
        }, () => {
            this.saving = false;
            this.toast.open('Could not save project');
        });

        return request;
    }

    public setActivePage(pageName: string) {
        const page = this.pages$.value.find(curr => curr.name.toLowerCase() === pageName.toLowerCase());
        if (page) {
            this.activePage$.next(page);
        }
        return this;
    }

    public addPage(page: BuilderPage): Observable<any> {
        this.pages$.next([page, ...this.pages$.value]);
        this.activePage$.next(page);
        return this.updateBuilderDocument();
    }

    public updatePage(pageName: string, newPage: BuilderPage): ActiveProject {
        const pages = [...this.pages$.value];
        const i = pages.findIndex(page => page.name === pageName);
        pages[i] = newPage;
        this.pages$.next(pages);
        return this;
    }

    public removePage(page: BuilderPage) {
        const pages = [...this.pages$.value];
        const i = pages.findIndex(p => page.name === p.name);
        pages.splice(i, 1);
        this.pages$.next(pages);
        this.activePage$.next(pages[pages.length - 1]);
        this.updateBuilderDocument();
    }

    public setProject(project: BuilderProject) {
        this.project = project;
        this.pages$.next(project.pages);
        this.setActivePage('index');
        this.activeTemplate = project.template;
        this.builderDocument.setTemplate(this.activeTemplate);
    }

    public applyTemplate(name: string) {
        this.project.model.template = name;
        return this.templates.get(name).pipe(
            tap(response =>  {
                this.activeTemplate = response.template;
                const newPages = response.template.pages.map(page => {
                    return {
                        name: page.name,
                        html: getProductionHtml(page.html, this.activeTemplate.config),
                    };
                });
                this.pages$.next(newPages);
                this.setActivePage('index');
                this.updateBuilderDocument();
            }),
            switchMap(() => {
                return this.save({thumbnail: true})
                    .pipe(tap(() => {
                        this.builderDocument.document.body.scrollTop = 0;
                        this.builderDocument.document.location.reload();
                    }));
            }),
        );
    }

    public applyTheme(theme?: Theme): Observable<void> {
        this.project.model.theme = theme?.name || null;
        const request = this.save({thumbnail: false})
            .pipe(switchMap(() => this.updateBuilderDocument()), share());
        request.subscribe(() => this.toast.open('Theme applied'));
        return request;
    }

    public getBaseUrl(relative = false): string {
        if ( ! this.project) return '';
        return this.projectUrl.getBaseUrl(this.project.model, relative);
    }

    public getSiteUrl() {
        return this.projectUrl.getSiteUrl(this.project.model);
    }

    public getImageUrl(entry: FileEntry) {
        if (isAbsoluteUrl(entry.url)) {
            return entry.url;
        } else {
            const path = this.getBaseUrl(true) + 'images';
            // project will already have full project path as "base url", only need relative path from "images" folder
            return entry.url.replace(`storage/${path}`, 'images');
        }
    }

    public updateBuilderDocument(): Observable<void> {
        return this.builderDocument.update({
            html: this.activePage$.value.html,
            template: this.activeTemplate,
            source: 'activeProject',
            theme: !!this.project.model.theme,
        });
    }

    /**
     * Auto save and update project pages on builder document change event.
     */
    private bindToBuilderDocumentChangeEvent() {
        this.builderDocument.contentChanged.pipe(debounceTime(1000)).subscribe(source => {
            if (source === 'activeProject') return;

            this.activePage$.value.html = this.builderDocument.getOuterHtml();

            if (this.localStorage.get('settings.autoSave')) {
                this.save({thumbnail: false});
            }
        });
    }

    private createThumbnail() {
        const base = document.createElement('base');
        base.href = this.getBaseUrl();
        if ( ! this.builderDocument.document.head.querySelector('base')) {
            this.builderDocument.get().head.prepend(base);
        }
        (html2canvas as any)(this.builderDocument.get().documentElement, {svgRendering: true, height: 1000}).then(canvas => {
            base.remove();
            this.projects.generateThumbnail(this.project.model.id, canvas.toDataURL('image/png'))
                .subscribe(() => {}, () => {});
        });
    }
}
