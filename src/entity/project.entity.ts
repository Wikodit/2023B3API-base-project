import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ProjectUser } from './project-user.entity'
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
  @JoinColumn({ name: 'referringEmployeeId' })
  referringEmployee!: User
}
