import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import Product from "./Products";
import User from "./Users";

@Entity()
export default class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => Product, (product) => product)
  product: Product;
}
