import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import AccountEntity from '../model/account.entity';

@Injectable()
export class AccountService {

    constructor(
        @InjectRepository(AccountEntity) private readonly accountRepository: Repository<AccountEntity>,

    ) { }

    findAll(): Observable<AccountEntity[]> {
        return from(this.accountRepository.find({ relations: ['users'] }));
    }

    create(user: any): Observable<AccountEntity> {
       const newUser = new AccountEntity();
       newUser.name = user.name;
       newUser.id = user.id;
       newUser.users = [];
   // return from(this.accountRepository.findOne(10));
        newUser.users.push(user)
       return from(this.accountRepository.save(newUser));
    }

}
