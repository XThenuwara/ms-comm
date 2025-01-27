import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import * as common from 'common/dist';
import { UsersService, UserList } from 'common/protos/users'

@Injectable()
export class AuthService {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: common.protos.usersProtoPath,
    },
  })
  client: ClientGrpc;

  private usersService: UsersService;

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  async login(): Promise<UserList> {
   const data = await this.usersService.FindAll({});
   return data;
  }
}
