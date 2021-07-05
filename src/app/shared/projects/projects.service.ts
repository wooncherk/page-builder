import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BuilderProject, FtpDetails} from '../builder-types';
import {Project} from './Project';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';

@Injectable({
    providedIn: 'root'
})
export class Projects {
    static BASE_URI = 'projects';
    constructor(private http: AppHttpClient) {}

    /**
     * Get all available projects.
     */
    public all(params?: {user_id?: number, per_page?: number}): PaginatedBackendResponse<Project> {
        return this.http.get(Projects.BASE_URI, params);
    }

    /**
     * Get project matching specified id.
     */
    public get(id: number): BackendResponse<{project: BuilderProject}> {
        return this.http.get(`${Projects.BASE_URI}/${id}`);
    }

    /**
     * Create a new project.
     */
    public create(params: object): BackendResponse<{project: BuilderProject}> {
        return this.http.post(Projects.BASE_URI, params);
    }

    /**
     * Update project matching specified id.
     */
    public update(id: number, params: object): BackendResponse<{project: BuilderProject}> {
        return this.http.put(`${Projects.BASE_URI}/${id}`, params);
    }

    public toggleState(id: number, published: boolean): BackendResponse<{project: BuilderProject}> {
        return this.http.put(`${Projects.BASE_URI}/${id}`, {published});
    }

    /**
     * Delete project matching specified id.
     */
    public delete(params: {ids: number[]}): BackendResponse<void> {
        return this.http.delete(Projects.BASE_URI, params);
    }

    /**
     * Create or update specified project's thumbnail image.
     */
    public generateThumbnail(projectId: number, dataUrl: string): BackendResponse<void> {
        return this.http.post(`${Projects.BASE_URI}/${projectId}/generate-thumbnail`, {dataUrl});
    }

    /**
     * Publish specified project to FTP.
     */
    public publish(projectId: number, params: FtpDetails): BackendResponse<{project: BuilderProject}> {
        return this.http.post(`${Projects.BASE_URI}/${projectId}/publish`, params);
    }
}
