import { UserEntity } from "src/user/models/user.entity";
import { User } from "src/user/models/user.interface";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class AccountEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @OneToMany(type => UserEntity, user => user.account,{
      eager: true,
      cascade: true
    })
    @JoinTable()
    users: any[];
    
}