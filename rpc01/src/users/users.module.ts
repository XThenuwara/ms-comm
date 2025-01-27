import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as common from 'common/dist';

console.log("common output", common);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: common.protos.usersProtoPath,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
