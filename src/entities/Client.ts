import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid4 } from "uuid";
import Data from "./Data";
import QueryMhRisk from "./QueryMhRisk";

@Entity("clients")
export default class Client {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column({ unique: true })
  subscription: string;

  @OneToOne(() => Data, { eager: true, nullable: false })
  @JoinColumn({ name: "data_id" })
  data: Data;

  @OneToMany(() => QueryMhRisk, (queriesMhRisk) => queriesMhRisk.client)
  queriesMhRisk: QueryMhRisk[];

  constructor() {
    if (!this.id) {
      this.id = uuid4();
    }
  }
}
