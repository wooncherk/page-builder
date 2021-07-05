import {Injectable} from '@angular/core';
import {HttpCacheClient} from '@common/core/http/http-cache-client';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {BuilderElement} from './builder-element';

@Injectable({
    providedIn: 'root'
})
export class ElementsApi {
    constructor(private http: HttpCacheClient) {}

    public getCustom(): BackendResponse<BuilderElement[]> {
        return this.http.getWithCache('elements/custom');
    }
}
