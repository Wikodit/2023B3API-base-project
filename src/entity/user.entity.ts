import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Project } from './project.entity'
import { Exclude } from 'class-transformer'

export enum UserRole {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
  PROJECT_MANAGER = 'ProjectManager'
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column({ unique: true, nullable: false })
  username!: string

  @Column({ unique: true, nullable: false })
  email!: string

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  password!: string

  @Column({ enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole

  @OneToMany(() => Project, p => p.referringEmployee, { nullable: false })
  projects!: Project[]
}
