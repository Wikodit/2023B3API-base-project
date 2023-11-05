import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectUser } from '../../project-user/entities/project-user.entity';
import { IsOptional } from 'class-validator';
import { User } from '../../users/entities/user.entity';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column()
  public name!: string;
  @IsOptional()
  @Column()
  public description?: string | null;
  @ManyToOne(() => User, (user: User) => user.employeeReferring, {
    onDelete: 'SET NULL',
  })
  public referringEmployeeId!: string;
  @IsOptional()
  @OneToMany(
    () => ProjectUser,
    (projectUser: ProjectUser) => projectUser.projectId,
  )
  projectUser: ProjectUser[];
}
