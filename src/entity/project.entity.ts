import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user.entity'
import { Exclude } from 'class-transformer'
import { ProjectUser } from './project-user.entity'

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

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => ProjectUser, pu => pu.project, { nullable: false })
  members: ProjectUser[]
}
