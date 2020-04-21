import {Entity, Column, PrimaryColumn, BaseEntity, ManyToMany, JoinTable} from 'typeorm';

@Entity()
export class Stat extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  description!: string
}