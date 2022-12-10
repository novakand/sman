import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../models/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AccountService } from 'src/account/service/account.service';
import AccountEntity from 'src/account/model/account.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService,
        private accountService: AccountService
    ) { }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                //new
                // newUser.account = new AccountEntity();
                // newUser.account.id = 1;
                // newUser.account.users = []
                // newUser.account.users.push(newUser);

               // this.accountService.create(newUser);

                //  this.accountService.create(newUser).pipe(
                //     tap((data) => newUser.account = data));


                return from(this.userRepository.save(newUser)).pipe(

                    map((user: User) => {
                        // user.account ={ name:'1',id}

                        const { password, ...result } = user;
                        return newUser;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({ id }, { relations: ['blogEntries'] })).pipe(
            map((user: User) => {
                const { password, ...result } = user;
                return result;
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.password });
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(function (v) { delete v.password });
                return usersPageable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
        // return from(this.userRepository.findAndCount({
        //     skip: Number(options.page) * Number(options.limit) || 0,
        //     take: Number(options.limit) || 10,
        //     order: { id: "ASC" },
        //     select: ['id', 'name', 'username', 'email', 'role','companyEntries'],
        //     where: [
        //         { username: Like(`%${user.username}%`) }
        //     ]
        // })).pipe(
        //     map(([users, totalUsers]) => {
        //         const usersPageable: Pagination<User> = {
        //             items: users,
        //             links: {
        //                 first: options.route + `?limit=${options.limit}`,
        //                 previous: options.route + ``,
        //                 next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
        //                 last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
        //             },
        //             meta: {
        //                 currentPage: Number(options.page),
        //                 itemCount: users.length,
        //                 itemsPerPage: Number(options.limit),
        //                 totalItems: totalUsers,
        //                 totalPages: Math.ceil(totalUsers / Number(options.limit))
        //             }
        //         };
        //         return usersPageable;
        //     })
        // )

        return null;
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => JSON.stringify({ access_token: jwt, user })));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(this.userRepository.findOne({ email }, { select: ['id', 'password', 'name', 'username', 'email', 'role', 'profileImage'] })).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ email }));
    }
}
