import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'projects' })
export class Project {

  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  referringEmployeeId!: string
}