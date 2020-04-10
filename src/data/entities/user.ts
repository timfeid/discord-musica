import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm';

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
}