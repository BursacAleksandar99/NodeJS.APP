import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'src/entities/administator.entity';
import { AdministatorService } from './services/administator/administator.service';
import { ArticleFeature } from 'src/entities/article-feature.entity';
import { ArticlePrice } from 'src/entities/article-price.entity';
import { Article } from 'src/entities/article.entity';
import { Cart } from 'src/entities/cart.entity';
import { CartArticle } from 'src/entities/cart-article.entity';
import { Category } from 'src/entities/category.entity';
import { Feature } from 'src/entities/feature.entity';
import { Order } from 'src/entities/order.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ArticleController } from './controllers/api/article.controller';
import { ArticleService } from './services/article/article.service';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';
import { FeatureService } from './services/feature/feature.service';
import { FeatureController } from './controllers/api/feature.controller';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { UserCartController } from './controllers/api/user.cart.controller';
import { OrderService } from './services/order/order.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from 'config/mail.configuration';
import { OrderMailer } from './services/order/order.mailer.service';
import { AdministratorOrderController } from './controllers/api/administrator.order.controller';
// import { Article2Service } from './services/article/article2.service';
// import { Article2Controller } from './controllers/api/article2.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator,
        ArticleFeature,
        ArticlePrice,
        Article,
        CartArticle,
        Cart,
        Category,
        Feature,
        Order,
        Photo,
        User
        ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
        ArticleFeature,
        ArticlePrice,
        Article,
        CartArticle,
        Cart,
        Category,
        Feature,
        Order,
        Photo,
        User
      
    ]),
    // MailerModule.forRoot({
    //   transport: 'smtps://' + MailConfig.username + ':' +
    //                           MailConfig.password + '@' +
    //                           MailConfig.hostname,
                              
    //   defaults: {
    //     from: MailConfig.senderEmail,
    //   },
      
    // }),
    MailerModule.forRoot({
      transport: {
        host: MailConfig.hostname,
        port: 465,
        secure: true,
        auth: {
          user: MailConfig.username,
          pass: MailConfig.password,
        },
      },
      defaults: {
        from: MailConfig.senderEmail,
      },
    })
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController,
    // Article2Controller,
    AuthController,
    FeatureController,
    UserCartController,
    AdministratorOrderController],
  providers: [
    AdministatorService,
    CategoryService,
    ArticleService,
    // Article2Service,
    PhotoService,
    FeatureService,
    UserService,
    CartService,
    OrderService,
    OrderMailer
    ],
    exports: [
      AdministatorService,
      UserService,
    ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .forRoutes('api/*');
  }
  
}
