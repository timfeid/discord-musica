import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm';

@Entity()
export class City extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  shortName!: string
}