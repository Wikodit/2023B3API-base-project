import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project.entity'
import { User } from './user.entity'

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column()
  startDate!: Date

  @Column()
  endDate!: Date

  @Column()
  projectId!: string

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'projectId' })
  project!: Project

  @Column()
  userId!: string

  @ManyToOne(() => User, { nullable: false, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}
