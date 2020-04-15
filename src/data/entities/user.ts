import {Entity, Column, PrimaryColumn, BaseEntity, ManyToMany, JoinTable, OneToOne, RelationId, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import { City } from './city';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column({ default: 1000 })
  cash!: number

  @Column({ default: 10, type: 'float' })
  reputation!: number

  @Column({ default: 0, type: 'float' })
  heat!: number

  @Column({ nullable: true, type: 'datetime' })
  outOfJailAt!: Date | null

  @ManyToOne(() => City, {eager: true})
  currentCity!: City
}