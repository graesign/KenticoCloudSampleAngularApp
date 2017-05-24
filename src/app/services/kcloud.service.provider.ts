// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { KCloudConfig } from '../kentico-cloud/config/kcloud.config';
import { TypeResolver } from '../kentico-cloud/models/type-resolver.class';

// services
import { KCloudService } from '../kentico-cloud/services/kcloud.service';

// models
import { Author } from './code-example/author.class';
import { Category } from './code-example/category.class';
import { CodeExample } from './code-example/code-example.class';


export function KCloudServiceFactory (http: Http) {

    let apiUrl = 'https://deliver.kenticocloud.com';
    let projectId = 'b52fa0db-84ec-4310-8f7c-3b94ed06644d';

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("code_example", () => new CodeExample(null, null, null, null, null)),
        new TypeResolver("category", () => new Category(null, null, null)),
        new TypeResolver("author", () => new Author(null, null, null, null)),
    ];

    return new KCloudService(
        http,
        new KCloudConfig(apiUrl, projectId, typeResolvers)
    )
};

export var KCloudServiceProvider =
    {
        provide: KCloudService,
        useFactory: KCloudServiceFactory,
        deps: [Http]
    };

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        KCloudService,
    ],
})
export class KenticoCloudModule { }