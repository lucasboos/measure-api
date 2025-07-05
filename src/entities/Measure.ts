import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";
import { MeasureType } from '../types/measure';

@Entity()
export class Measure extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  customer_code!: string;

  @Column({ type: "float" })
  measure_value!: number;

  @Column({
    type: "enum",
    enum: MeasureType,
  })
  measure_type!: MeasureType;

  @Column()
  measure_datetime!: Date;

  @Column({ default: false })
  has_confirmed!: boolean;

  @Column()
  image_url!: string;

  @CreateDateColumn()
  created_at!: Date;
}