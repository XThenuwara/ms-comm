import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  Client,
  ClientKafkaProxy,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { IncomingMessage } from 'node:http';
import { KafkaService } from '../kafka/kafka.service';


@Injectable()
export class OrderService implements OnModuleInit {
  private kafkaOrderClient: ClientKafkaProxy;
  constructor(private kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.kafkaService.configure({
      clientId: 'order',
      groupId: 'order-consumer',
    })
    await this.kafkaService.connect();
    await this.kafkaService.subscribe('order.created');
    this.kafkaOrderClient = this.kafkaService.client;
    console.log('OrderService connected to Kafka');
  }

  async create() {
    try {
      // Async Fire and Forget Pattern
      const eventResponse = await this.kafkaOrderClient.emit('order.created', {
        id: 1,
        name: 'Order 1',
      });
      eventResponse.forEach((info) => console.log("Event Info:", info));


      // request-response pattern
      const response = await this.kafkaOrderClient.send('order.created', {
         id: 1,
         name: 'Order 1',
      })

     response.forEach((msg) => console.log("Message Reply: ", msg));
    } catch (error) {
      console.error(error);
    }
  }
}
