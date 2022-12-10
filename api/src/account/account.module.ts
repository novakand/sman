import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AccountController } from './controller/account.controller';

import AccountEntity from './model/account.entity';
import { AccountService } from './service/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    forwardRef(() => UserModule),
    //AuthModule,
   // UserModule
],
//exports:[AccountModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {
  
}
