import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
