import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ActiveProject} from '../../../projects/active-project';
import {Toast} from '@common/core/ui/toast.service';
import {InspectorDrawer} from '../../inspector-drawer.service';
import {BuilderTemplate} from '../../../../shared/builder-types';
import {Templates} from '../../../../shared/templates/templates.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {finalize} from 'rxjs/operators';
import {MainLoaderService} from '../../../main-loader/main-loader.service';

@Component({
    selector: 'templates-panel',
    templateUrl: './templates-panel.component.html',
    styleUrls: ['./templates-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TemplatesPanelComponent implements OnInit {
    public templates: BuilderTemplate[] = [];

    constructor(
        private templatesApi: Templates,
        private settings: Settings,
        private activeProject: ActiveProject,
        private modal: Modal,
        private toast: Toast,
        private inspectorDrawer: InspectorDrawer,
        public mainLoader: MainLoaderService,
    ) {}

    ngOnInit() {
        this.templatesApi.all({perPage: 25}).subscribe(response => {
            this.templates = response.pagination.data;
        });
    }

    public applyTemplate(template: BuilderTemplate) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Apply Template',
            body: 'Are you sure you want to apply this template?',
            bodyBold: 'This will erase all the current contents of your project.',
            ok: 'Apply'
        }).afterClosed().subscribe(result => {
            if ( ! result) return;
            this.mainLoader.loading$.next(true);
            this.inspectorDrawer.close();

            this.activeProject.applyTemplate(template.name)
                .pipe(finalize(() => this.mainLoader.loading$.next(false)))
                .subscribe(() => {
                    this.toast.open('Template applied');
                });
        });
    }

    /**
     * Get absolute url for specified template's thumbnail.
     */
    public getThumbnailUrl(template: BuilderTemplate) {
        return this.settings.getBaseUrl(true) + template.thumbnail;
    }
}
