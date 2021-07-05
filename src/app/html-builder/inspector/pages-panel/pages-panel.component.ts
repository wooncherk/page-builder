import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {ActiveProject} from '../../projects/active-project';
import {Toast} from '@common/core/ui/toast.service';
import {BuilderDocument} from '../../builder-document.service';
import {Projects} from '../../../shared/projects/projects.service';
import {getProductionHtml} from '../../utils/parse-html-into-document';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {BLANK_PAGE_SKELETON} from '../../../shared/crupdate-project-modal/blank-page-skeleton';

@Component({
    selector: 'pages-panel',
    templateUrl: './pages-panel.component.html',
    styleUrls: ['./pages-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesPanelComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public activePageControl = new FormControl('index');
    public pageForm = this.fb.group({
        name: [''],
        title: [''],
        description: [''],
        keywords: [''],
    });

    constructor(
        public activeProject: ActiveProject,
        private projects: Projects,
        private toast: Toast,
        private builderDocument: BuilderDocument,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.builderDocument.loaded$.subscribe(() => {
            this.activePageControl.valueChanges
                .subscribe(pageName => {
                    // initial "index" page will be already loaded,
                    // make sure to not reload it again needlessly
                    if (pageName !== this.activeProject.activePage$.value.name) {
                        this.activeProject.setActivePage(pageName);
                        this.activeProject.updateBuilderDocument();
                    }
                });

            this.activeProject.activePage$.subscribe(page => {
                if (page) {
                    this.activePageControl.setValue(page.name);
                    this.hydrateUpdateModel();
                }
            });
        });
    }

    public createNewPage() {
        this.loading$.next(true);

        let name = `page-${this.activeProject.pages$.value.length + 1}`;
        // make sure we don't duplicate page names
        if (this.activeProject.pages$.value.find(page => page.name === name)) {
            name += '-copy';
        }

        this.activeProject.addPage({name, html: getProductionHtml(BLANK_PAGE_SKELETON)})
            .subscribe(() => {
                this.hydrateUpdateModel();
                this.activeProject.save().subscribe(() => {
                    this.activePageControl.setValue(this.activeProject.activePage$.value.name);
                    this.loading$.next(false);
                    this.toast.open('Page created');
                });
            });
    }

    public canDeleteSelectedPage() {
        return this.activeProject.activePage$.value?.name?.toLowerCase() !== 'index' &&
            this.activeProject.pages$.value.length > 1;
    }

    public updateSelectedPage() {
        this.loading$.next(true);

        const pageValue = this.pageForm.getRawValue();
        this.builderDocument.setMetaTagValue('keywords', pageValue.keywords);
        this.builderDocument.setTitleValue(pageValue.title);
        this.builderDocument.setMetaTagValue('description', pageValue.description);
        this.builderDocument.contentChanged.next('builder');

        const newPage = {...pageValue, html: this.builderDocument.getOuterHtml()};

        this.activeProject.updatePage(this.activeProject.activePage$.value.name, newPage)
            .save({thumbnail: false})
            .subscribe(() => {
                this.loading$.next(false);
                this.toast.open('Page updated');
            });
    }

    public deleteSelectedPage() {
        this.loading$.next(true);

        this.activeProject.removePage(this.activeProject.activePage$.value);

        this.activeProject.save({thumbnail: false}).subscribe(() => {
            this.loading$.next(false);
            this.toast.open('Page deleted');
        });
    }

    public duplicateSelectedPage() {
        this.loading$.next(true);

        this.activeProject.addPage({
            name: this.activeProject.activePage$.value.name + '-copy',
            html: this.builderDocument.getOuterHtml(),
        });

        this.activeProject.save({thumbnail: false}).subscribe(() => {
            this.loading$.next(false);
            this.toast.open('Page duplicated');
        });
    }

    private hydrateUpdateModel() {
        const pageName = this.activeProject.activePage$.value.name;
        this.pageForm.patchValue({
            name: pageName,
            title: this.builderDocument.getTitleValue(),
            description: this.builderDocument.getMetaTagValue('description'),
            keywords: this.builderDocument.getMetaTagValue('keywords'),
        });
        if (pageName === 'index') {
            this.pageForm.get('name').disable();
        } else {
            this.pageForm.get('name').enable();
        }
    }
}
