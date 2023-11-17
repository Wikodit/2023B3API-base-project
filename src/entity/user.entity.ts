import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum UserRole {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
  PROJECT_MANAGER = 'ProjectManager'
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column({ unique: true, nullable: false })
  username!: string

  @Column({ unique: true, nullable: false })
  email!: string

  @Column({ nullable: false })
  password!: string

  @Column({ enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole
}
