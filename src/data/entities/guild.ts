import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm'

@Entity()
export class Guild extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  name!: string

  @Column({default: '.'})
  prefix!: string

  @Column({default: 25})
  volume!: number
}