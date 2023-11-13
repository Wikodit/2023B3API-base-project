import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ unique: true })
  public username!: string

  @Column({ unique: true })
  public email!: string

  @Column()
  public password!: string

  @Column({ enum: UserRole, default: UserRole.EMPLOYEE })
  public role!: UserRole
}
