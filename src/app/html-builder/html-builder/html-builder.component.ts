import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Elements} from '../elements/elements.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveProject} from '../projects/active-project';
import {MatDrawer} from '@angular/material/sidenav';
import {InspectorDrawer} from '../inspector/inspector-drawer.service';
import {DragVisualHelperComponent} from '../live-preview/drag-and-drop/drag-visual-helper/drag-visual-helper.component';
import {DragVisualHelper} from '../live-preview/drag-and-drop/drag-visual-helper/drag-visual-helper.service';
import {CodeEditor} from '../live-preview/code-editor/code-editor.service';
import {Inspector} from '../inspector/inspector.service';
import {InlineTextEditor} from '../live-preview/inline-text-editor/inline-text-editor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {LivePreview} from '../live-preview.service';
import {ElementsApi} from '../elements/elements-api.service';
import {BuilderDocument} from '../builder-document.service';
import {forkJoin} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Projects} from '../../shared/projects/projects.service';
import {OverlayPanel} from '../../../common/core/ui/overlay-panel/overlay-panel.service';
import {LinkEditor} from '../live-preview/link-editor/link-editor.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {ContextMenu} from '../../../common/core/ui/context-menu/context-menu.service';
import {LayoutPanel} from '../inspector/layout-panel/layout-panel.service';
import {MainLoaderService} from '../main-loader/main-loader.service';
import {InspectorFloatingPanel} from '../inspector/inspector-floating-panel.service';
import {UndoManager} from '../undo-manager/undo-manager.service';
import {CurrentUser} from '../../../common/auth/current-user';

@Component({
    selector: 'html-builder',
    templateUrl: './html-builder.component.html',
    styleUrls: ['./html-builder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ActiveProject,
        LivePreview,
        BuilderDocument,
        Modal,
        OverlayPanel,
        LinkEditor,
        CodeEditor,
        ContextMenu,
        InlineTextEditor,
        LayoutPanel,
        MainLoaderService,
        InspectorFloatingPanel,
        UndoManager
    ],
    animations: [
        trigger('bodyExpansion', [
            state('false', style({height: '0px', visibility: 'hidden'})),
            state('true', style({height: '*', visibility: 'visible'})),
            transition('true <=> false',
                animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
        ])
    ]
})
export class HtmlBuilderComponent implements OnInit, OnDestroy {
    @ViewChild('inspectorDrawer', {static: true}) drawer: MatDrawer;
    @ViewChild('dragHelper', {static: true}) dragHelper: DragVisualHelperComponent;
    @ViewChild('loaderEl', {static: true}) loaderEl: ElementRef;
    public inspectorHidden = false;

    constructor(
        private elements: Elements,
        private elementsApi: ElementsApi,
        private route: ActivatedRoute,
        private activeProject: ActiveProject,
        public inspectorDrawer: InspectorDrawer,
        private dragVisualHelper: DragVisualHelper,
        private codeEditor: CodeEditor,
        private inspector: Inspector,
        private inlineTextEditor: InlineTextEditor,
        private breakpoints: BreakpointsService,
        private builderDocument: BuilderDocument,
        private projectApi: Projects,
        private livePreview: LivePreview,
        public mainLoader: MainLoaderService,
        private currentUser: CurrentUser,
        private router: Router,
    ) {}

    ngOnInit() {
        forkJoin([
            this.projectApi.get(this.route.snapshot.params.id).pipe(tap(response => {
                this.activeProject.setProject(response.project);
                this.livePreview.init();
            })),
            this.elementsApi.getCustom().pipe(tap(r => this.elements.init(r))),
            this.builderDocument.loaded$,
        ]).subscribe(() => {
            if ( ! this.canOpenProjectInBuilder()) {
                this.router.navigate(['/dashboard']);
            }
            this.mainLoader.loading$.next(false);
            this.inspectorDrawer.setDrawer(this.drawer);
            this.dragVisualHelper.setComponent(this.dragHelper);
        });
        this.inspectorHidden = this.breakpoints.isMobile$.value;
    }

    private canOpenProjectInBuilder(): boolean {
        return this.currentUser.hasPermission('projects.update') ||
            !!this.activeProject.project.model.users.find(u => u.id === this.currentUser.get('id'));
    }

    ngOnDestroy() {
        this.codeEditor.close();
        this.inspector.reset();
        this.inlineTextEditor.close();
    }

    public getInspectorDrawerPanel(): string {
        return this.inspectorDrawer.activePanel;
    }

    public toggleInspector() {
        this.inspectorHidden = !this.inspectorHidden;
    }
}
