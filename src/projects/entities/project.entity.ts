import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectUser } from '../../project-user/entities/project-user.entity';
import { IsOptional } from 'class-validator';
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
  public referringEmployeeId!: string;
  @IsOptional()
  @OneToMany(
    () => ProjectUser,
    (projectUser: ProjectUser) => projectUser.projectId,
  )
  projectUser: ProjectUser[];
}
