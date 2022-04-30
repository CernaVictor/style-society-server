import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import Order from "./Orders";
import Comment from "./Comments";
import Rating from "./Ratings";

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: ["watches", "bracelets", "sunglasses", "perfume"],
    nullable: false,
  })
  type: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createDate: Date;

  @Column({ nullable: true })
  photo: string;

  @ManyToMany(() => Order)
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[];
}
