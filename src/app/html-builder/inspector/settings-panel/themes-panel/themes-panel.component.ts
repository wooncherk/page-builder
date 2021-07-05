import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Themes} from '../../../themes.service';
import {InspectorDrawer} from '../../inspector-drawer.service';
import {ActiveProject} from '../../../projects/active-project';
import {Theme} from '../../../../shared/themes/Theme';
import {Settings} from '../../../../../common/core/config/settings.service';
import {Toast} from '../../../../../common/core/ui/toast.service';
import {MainLoaderService} from '../../../main-loader/main-loader.service';

@Component({
    selector: 'themes-panel',
    templateUrl: './themes-panel.component.html',
    styleUrls: ['./themes-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ThemesPanelComponent implements OnInit {
    public themes: Theme[] = [];

    constructor(
        private themesApi: Themes,
        public mainLoader: MainLoaderService,
        private inspectorDrawer: InspectorDrawer,
        private activeProject: ActiveProject,
        private toast: Toast,
        private settings: Settings,
    ) {}

    ngOnInit() {
        this.themesApi.all().subscribe(response => {
            this.themes = response.themes;
        });
    }

    public applyTheme(theme?: Theme) {
        this.mainLoader.loading$.next(true);
        this.inspectorDrawer.close();
        this.activeProject.applyTheme(theme).subscribe(() => {
            this.mainLoader.loading$.next(false);
        });
    }

    /**
     * Get absolute url for specified theme's thumbnail.
     */
    public getThumbnailUrl(theme: Theme) {
        return this.settings.getBaseUrl(true) + '/' + theme.thumbnail;
    }

    /**
     * Check if specified theme is currently active.
     */
    public themeIsActive(theme?: Theme) {
        // check if any theme is active
        if ( ! theme) return this.activeProject.get().model.theme;

        // check if specified theme is active
        return this.activeProject.get().model.theme === theme.name;
    }
}
