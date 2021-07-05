import {User} from '@common/core/types/models/User';
import {CustomDomain} from '@common/custom-domain/custom-domain';
import {BuilderPage} from '../builder-types';

export interface Project {
    id: number;
    name: string;
    slug: string;
    published: boolean;
    uuid?: string;
    theme: string;
    template: string;
    users?: User[];
    pages?: BuilderPage[];
    domain?: CustomDomain;
    created_at?: string;
    updated_at?: string;
}
