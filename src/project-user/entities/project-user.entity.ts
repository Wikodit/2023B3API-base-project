import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('projectUser')
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ type: 'timestamp' }) //, default: () => 'CURRENT_TIMESTAMP'
  public startDate: Date;
  @Column({ type: 'timestamp' }) //, default: () => 'CURRENT_TIMESTAMP'
  public endDate: Date;
  //@JoinColumn({ name: 'userId' })
  @Column()
  @ManyToOne(() => User, (user) => user.projectUser, { onDelete: 'SET NULL' })
  userId: string;
  //@JoinColumn({ name: 'projectId' })
  @Column()
  @ManyToOne(() => Project, (project) => project.projectUser, {
    onDelete: 'SET NULL',
  })
  projectId: string;
}
