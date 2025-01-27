import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private usersService: UsersService;

  constructor(@Inject('USERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  getHero() {
   // return this.usersService.findOne(1);
   
  }
  
}
