import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Client, ClientKafkaProxy, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { IncomingMessage } from 'node:http';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  create() {
    this.orderService.create();
    return;
  }

  // Aync event handler
  // Fire and forget - does not need to return anything
  @EventPattern('order.created')
  async handleOrderCreatedAsync(@Payload() data: IncomingMessage, @Ctx() context: KafkaContext) {
    console.log(`Event Message: ${JSON.stringify(data)}`);
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();

    await consumer.commitOffsets([{ topic, partition, offset }]);
  }

  // request-response pattern
  // Needs to return a value
  @MessagePattern('order.created')
  async handleOrderCreatedSync(@Payload() message: any, @Ctx() context: KafkaContext) {
    console.log('Message received: ', message);
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();

    const items = [
      { id: 1, message: 'Order Creation Acknowledged' },
      { id: 2, message: 'Order Processing' },
    ];

    await consumer.commitOffsets([{ topic, partition, offset }]);

    return {
      items,
    };
  }
}
