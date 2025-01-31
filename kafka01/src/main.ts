import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaStatus, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get('kafka.brokers') || ['localhost:9092'],
        logLevel:4
      },
      run: {
        autoCommit: false
      }
    }
  });


  microservice.status.subscribe((status: KafkaStatus) => {
    console.log("KAFKA Status: ", status);
  });

  await app.startAllMicroservices();
  await microservice.listen();
  await app.listen(3000);
}
bootstrap();
