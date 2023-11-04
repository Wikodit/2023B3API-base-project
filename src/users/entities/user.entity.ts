import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from './user.role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ unique: true })
  public username!: string;
  @Column({ unique: true })
  public email!: string;
  @Exclude()
  @Column()
  public password!: string;
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.Employee,
  })
  role?: UserRoleEnum;
}
