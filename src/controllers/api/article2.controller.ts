// import { Controller } from "@nestjs/common";
// import { Crud, CrudController } from "@nestjsx/crud";
// import { Article2Service } from "src/services/article/article2.service";
// import { Article } from "src/entities/article.entity";

// @Crud({
//     model: {
//         type: Article
//     },
//     params: {
//         id: {
//             field: 'article_id',
//             type: 'number',
//             primary: true
//         }
//     },
//     query: {
//         join: {
//             category: {
//                 eager: true
//             },
//             articleFeatures: {
//                 eager: true
//             },
//             features: {
//                 eager: true
//             }
//         }
//     }
// })
// @Controller("api/article")
// export class Article2Controller implements CrudController<Article>{
//     constructor(public service: Article2Service){
        
//     }
// }