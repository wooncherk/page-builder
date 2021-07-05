import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {Inspector} from '../inspector.service';
import {ActiveProject} from '../../projects/active-project';
import {InspectorDrawer} from '../inspector-drawer.service';
import {LocalStorage} from '@common/core/services/local-storage.service';

@Component({
    selector: 'settings-panel',
    templateUrl: './settings-panel.component.html',
    styleUrls: ['./settings-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsPanelComponent implements OnInit {
    public settings: {
        selectedBoxEnabled: boolean,
        hoverBoxEnabled: boolean,
        autoSave: boolean,
    };

    constructor(
        private overlay: Overlay,
        private inspector: Inspector,
        public activeProject: ActiveProject,
        private inspectorDrawer: InspectorDrawer,
        private localStorage: LocalStorage,
    ) {}

    ngOnInit() {
        this.hydrateModels();
    }

    public openTemplatesPanel() {
        this.inspectorDrawer.toggle('templates');
    }

    public openThemesPanel() {
        this.inspectorDrawer.toggle('themes');
    }

    public updateSettings() {
        for (const key in this.settings) {
            this.localStorage.set('settings.' + key, this.settings[key]);
        }
    }

    private hydrateModels() {
        this.settings = {
            hoverBoxEnabled: this.localStorage.get('settings.hoverBoxEnabled', true),
            selectedBoxEnabled: this.localStorage.get('settings.selectedBoxEnabled', true),
            autoSave: this.localStorage.get('settings.autoSave', false),
        };
    }
}
