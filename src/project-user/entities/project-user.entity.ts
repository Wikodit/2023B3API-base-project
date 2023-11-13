import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @ManyToOne(() => User, (user) => user.projectUser, { onDelete: 'SET NULL' })
  userId: string;
  @Column()
  @ManyToOne(() => Project, (project) => project.projectUser, {
    onDelete: 'SET NULL',
  })
  projectId: string;
}
