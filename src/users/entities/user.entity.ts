import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min } from 'class-validator';
import { UserRoleEnum } from './user.role.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: string; //au format uuidv4
  @Column()
  public username!: string;
  @Column()
  @Min(8)
  public email!: string;
  @Column()
  public password!: string;
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.Employee,
  })
  role?: UserRoleEnum;
}
