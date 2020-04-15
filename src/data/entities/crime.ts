import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm';

@Entity()
export class Crime extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  shortName!: string
}