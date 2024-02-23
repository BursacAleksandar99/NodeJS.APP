import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./article.entity";

@Index("fk_photo_article_id", ["articleId"], {})
@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Entity("photo")
export class Photo {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "photo_id", 
    unsigned: true })
    photoId: number;

  @Column({ 
    type: "int", 
    name: "article_id", 
    unsigned: true})
    articleId: number;

  @Column({
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128})
  imagePath: string;

  @ManyToOne(() => Article, (article) => article.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;
}
