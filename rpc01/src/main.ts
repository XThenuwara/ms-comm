import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';
import * as common from 'common/dist';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: common.protos.usersProtoPath,
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });

  await app.listen();
}
bootstrap();
