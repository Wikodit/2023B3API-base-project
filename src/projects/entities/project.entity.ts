import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column()
  public name!: string;
  @Column()
  public referringEmployeeId!: string;
}
