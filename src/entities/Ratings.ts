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
export default class Rating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: [1, 2, 3, 4, 5],
    default: 3,
  })
  value: number;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => Product, (product) => product)
  product: Product;
}
