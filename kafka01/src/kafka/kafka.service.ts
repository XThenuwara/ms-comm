import { Injectable } from '@nestjs/common';
import { ClientKafka, KafkaOptions, Transport } from '@nestjs/microservices';
import { PubSubService } from '@/lib/Interface/PubSubService.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements PubSubService {
  public client: ClientKafka;

  constructor(private configService: ConfigService) {}

  configure(config: any): void {
    const kafkaOptions: Required<KafkaOptions>['options'] = {
      client: {
        clientId: config.clientId || 'default-client',
        brokers: config.brokers || this.configService.get('kafka.brokers') || ['localhost:9092'],
      },
      consumer: {
        groupId: config.groupId || 'default-consumer-group',
      },
    };

    this.client = new ClientKafka(kafkaOptions['options']);
  }

  async subscribe(topic: string): Promise<void> {
    try {
      await this.client.subscribeToResponseOf(topic);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
      throw error;
    }
  }

  // Sync Request-Reply Pattern
  async sendMessage(topic: string, message: any, callback?: (res) => void): Promise<void> {
    try {
      const response = await this.client.send(topic, message);
      if (callback) {
        response.forEach((msg) => callback(msg));
      }
    } catch (error) {
      console.error(`Error sending message to topic ${topic}:`, error);
      throw error;
    }
  }

  // Async Fire and Forget Pattern
  async emitMessage(topic: string, message: any): Promise<void> {
    try {
      await this.client.emit(topic, message);
    } catch (error) {
      console.error(`Error emitting message to topic ${topic}:`, error);
      throw error;
    }
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Kafka client connected');
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.close();
      console.log('Kafka client closed');
    } catch (error) {
      console.error('Error closing Kafka client:', error);
      throw error;
    }
  }
}
