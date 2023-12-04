import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project.entity'
import { User } from './user.entity'

@Entity({ name: 'project_users' })
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column()
  startDate!: Date

  @Column()
  endDate!: Date

  @Column()
  projectId!: string

  @OneToOne(() => Project, { nullable: false, cascade: true })
  @JoinColumn({ name: 'projectId' })
  project!: Project

  @Column()
  userId!: string

  @OneToOne(() => User, { nullable: false, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}
