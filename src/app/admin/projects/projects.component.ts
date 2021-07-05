import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Projects} from '../../shared/projects/projects.service';
import {Project} from '../../shared/projects/Project';
import {ProjectUrl} from '../../shared/projects/project-url.service';
import {CrupdateProjectModalComponent} from '../../shared/crupdate-project-modal/crupdate-project-modal.component';
import {DatatableService} from '../../../common/datatable/datatable.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    providers: [DatatableService],
    encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent implements OnInit {
    public projects$ = this.datatable.data$ as Observable<Project[]>;
    constructor(
        public datatable: DatatableService<Project>,
        private projects: Projects,
        private modal: Modal,
        private projectUrl: ProjectUrl,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.datatable.init({
            uri: Projects.BASE_URI,
        });
    }

    public maybeDeleteSelectedProjects() {
        this.datatable.confirmResourceDeletion('projects')
            .subscribe(() => {
                this.projects.delete({ids: this.datatable.selectedRows$.value}).subscribe(() => {
                    this.datatable.reset();
                });
            });
    }

    public showCrupdateProjectModal(project?: Project) {
        this.datatable.openCrupdateResourceModal(CrupdateProjectModalComponent, {project, showExtraConfig: true})
            .subscribe();
    }

    public getProjectThumbnail(project: Project) {
        return this.projectUrl.getBaseUrl(project) + 'thumbnail.png';
    }
}
