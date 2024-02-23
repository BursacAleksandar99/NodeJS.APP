import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ArticleFeature } from "./article-feature.entity";
import { ArticlePrice } from "./article-price.entity";
import { CartArticle } from "./cart-article.entity";
import { Photo } from "./photo.entity";

@Index("FK_article_category", ["categoryId"], {})
@Entity("article")
export class Article {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "article_id", 
    unsigned: true })
    articleId: number;

  @Column({ 
    type: "varchar",
    name: "name",
    length: 128,})
    name: string;

  @Column( { 
    type: "int",
    name: "category_id", 
    unsigned: true })
    categoryId: number;

  @Column({ 
    type: "varchar", 
    name: "excerpt", 
    length: 255 })
    excerpt: string;

  @Column({ 
    type: "text", 
    name: "description" })
    description: string;

  @Column( {
    type: "enum",
    name: "status",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  status: "available" | "visible" | "hidden";

  @Column( {
    type: "tinyint",
    name: "is_promoted",
    unsigned: true })
  isPromoted: number;

  @Column( { 
    type: "timestamp", 
    name: "created_at", 
    default: () => "'now()'" })
    createdAt: Date;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => ArticleFeature, (articleFeature) => articleFeature.article)
  articleFeatures: ArticleFeature[];

  @OneToMany(() => ArticlePrice, (articlePrice) => articlePrice.article)
  articlePrices: ArticlePrice[];

  @OneToMany(() => CartArticle, (cartArticle) => cartArticle.article)
  cartArticles: CartArticle[];

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];
}
