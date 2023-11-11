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
import { UserResponseDto } from '../../users/dto/user-response-dto';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column()
  public name!: string;
  @IsOptional()
  @Column()
  public description?: string | null;
  @Column()
  @ManyToOne(() => User, (user: User) => user.employeeReferring, {
    onDelete: 'SET NULL',
  })
  public referringEmployeeId!: string;
  public referringEmployee!: UserResponseDto;
  @IsOptional()
  @OneToMany(
    () => ProjectUser,
    (projectUser: ProjectUser) => projectUser.projectId,
  )
  projectUser?: ProjectUser[];
}
