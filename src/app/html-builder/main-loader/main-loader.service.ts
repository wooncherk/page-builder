import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {delay, filter, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MainLoaderService {
    public loading$ = new BehaviorSubject(true);
    public loadedAtLeastOnce$ = new ReplaySubject(1);

    constructor() {
        // wait 500ms until loader animation is complete
        this.loading$.pipe(filter(loading => !loading), take(1), delay(500))
            .subscribe(() => this.loadedAtLeastOnce$.next(true));
    }
}
