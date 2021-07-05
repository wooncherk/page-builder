import {Project} from './projects/Project';

export interface BuilderPage {
    name: string;
    html: string;
    description?: string;
    keywords?: string;
    title?: string;
}

export interface BuilderProject {
    model: Project;
    pages: BuilderPage[];
    css: string;
    js: string;
    template: BuilderTemplate;
}

export interface BuilderTemplate {
    name: string;
    updated_at: string;
    thumbnail: string;
    pages: BuilderPage[];
    config: BuilderTemplateConfig;
}

export interface BuilderTemplateConfig extends HtmlParserConfig {
    name: string;
    color: string;
    category: string;
    theme: string;
}

export interface HtmlParserConfig {
    includeBootstrap?: boolean;
    includeFontawesome?: boolean;
    includeTheme?: boolean;
    nodesToRestore?: string[];
    classesToRemove?: string[];
}

export interface FtpDetails {
    host?: string;
    username?: string;
    password?: string;
    directory?: string;
    port?: number;
    ssl?: boolean;
}
