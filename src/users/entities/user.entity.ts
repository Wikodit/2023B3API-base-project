import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from './user.role.enum';
import { Exclude } from 'class-transformer';
import { ProjectUser } from '../../project-user/entities/project-user.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ unique: true })
  public username!: string;
  @Column({ unique: true })
  public email!: string;
  @Exclude()
  @Column()
  public password!: string;
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.Employee,
  })
  role?: UserRoleEnum;
  @OneToMany(
    () => ProjectUser,
    (projectUser: ProjectUser) => projectUser.userId,
  )
  projectUser: ProjectUser[];
}
