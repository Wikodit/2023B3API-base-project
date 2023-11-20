import {
  Column,
  Entity,
  JoinColumn,
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

  @Column()
  public referringEmployeeId: string;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'referringEmployeeId' })
  referringEmployee!: UserResponseDto;

  @IsOptional()
  @OneToMany(
    () => ProjectUser,
    (projectUser: ProjectUser) => projectUser.projectId,
  )
  projectUser?: ProjectUser[];
}
