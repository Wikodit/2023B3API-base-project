import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column({ nullable: false })
  name!: string

  @Column()
  referringEmployeeId!: string

  @ManyToOne(() => User, (u) => u.projects, { nullable: false, cascade: true })
  referringEmployee!: User
}
