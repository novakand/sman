import { Body, Controller, Get, Post } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { AccountService } from '../service/account.service';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get()
    fundall(){
        return this.accountService.findAll();
    }

    @Post()
    create(@Body() user: User): Observable<any | Object> {

       
        return this.accountService.create(user).pipe(
            map((user: any) => user),
            catchError(err => of({ error: err.message }))
        );
    }
}
