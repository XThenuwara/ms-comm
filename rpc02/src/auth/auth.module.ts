import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as common from 'common/dist';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users', 
          protoPath: common.protos.usersProtoPath
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
