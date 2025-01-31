export interface PubSubService {
  configure(config: any): void;
  sendMessage(topic: string, message: any): Promise<void>;
  emitMessage(topic: string, message: any): Promise<void>;
  connect(): Promise<void>;
  close(): Promise<void>;
}

