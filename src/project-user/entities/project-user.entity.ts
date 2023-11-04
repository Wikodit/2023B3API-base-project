import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_user')
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public startDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public endDate: Date;

  @ManyToOne(() => User, (user) => user.projectUser, { onDelete: 'SET NULL' })
  userId: User;

  @ManyToOne(() => Project, (project) => project.projectUser, {
    onDelete: 'CASCADE',
  })
  projectId: Project;
}

/*
public projectId!: string; //au format uuidv4

Employé, je veux pouvoir voir uniquement la
liste de tous les projets de l'entreprise dans lesquels je suis impliqué.
 */
