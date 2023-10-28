import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsEmail, IsNotEmpty, Length} from 'class-validator';
import { UserRoleEnum } from '../entities/user.role.enum';

@Entity()
export class CreateUserDto {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column()
  @Length(3, 255)
  @IsNotEmpty()
  public username!: string;
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  public email!: string;
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.Employee,
  })
  public role?: UserRoleEnum;
  @Column()
  @Length(8, 255)
  @IsNotEmpty()
  public password!: string;
}
