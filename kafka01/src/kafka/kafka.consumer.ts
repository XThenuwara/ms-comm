import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(private readonly kafkaClient: ClientKafka) {}
  
  async sendMessage(topic: string, message: any) {
    return await this.kafkaClient.send(topic, message);
  }

  async emitMessage(topic: string, message: any) {
    return await this.kafkaClient.emit(topic, message);
  }

  async connect() {
    await this.kafkaClient.connect();
  }

  async close() {
    await this.kafkaClient.close();
  }
}