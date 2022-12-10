import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToOne, JoinTable, ManyToMany } from "typeorm";
import { UserRole } from "./user.interface";
import { BlogEntryEntity } from "src/blog/model/blog-entry.entity";
import AccountEntity from "src/account/model/account.entity";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column({nullable: true})
    profileImage: string;

    @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author,)
    blogEntries: BlogEntryEntity[];

    @ManyToMany(type => AccountEntity, user => user.users,{
        // eager: true,
        // cascade: true
      })
    @JoinTable()
    account: AccountEntity;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}