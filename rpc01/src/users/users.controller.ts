import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { Metadata, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js';
import { UserList } from 'common/protos/users';

@Controller()
export class UsersController {
  private users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];

  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindOne')
  findOneById(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): any {
    return this.users.find(({ id }) => id === data.id);
  }

  @GrpcMethod('UsersService', 'FindAll')
  async findAll(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<UserList> {
    console.log("getting all users");
    return { data: this.users };
  }

  @GrpcMethod('UsersService', 'StreamAll')
  async streamAll(data: any, metadata: Metadata, call: ServerWritableStream<any, any>): Promise<any> {
    console.log("streaming all users");
    for (const user of this.users) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      call.write(user)
    }
    call.end();
    console.log("ended")
  }
}
