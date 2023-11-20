import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('projectUser')
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'timestamp' })
  public startDate: Date;

  @Column({ type: 'timestamp' })
  public endDate: Date;

  @Column()
  public projectId: string;

  @Column()
  public userId: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, (project) => project.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
