import { Server } from 'http';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GracefulShutdown {
  private server: Server;

  private signals = ['SIGTERM', 'SIGINT'];
  private connections = new Set<any>();

  public init(server: Server): void {
    this.server = server;
    this.signals.forEach((signal) => {
      process.on(signal, () => {
        console.info(`Received ${signal}. Starting graceful shutdown.`);
        this.shutdown();
      });
    });

    this.server.on('connection', (connection: any) => {
      this.connections.add(connection);
      connection.on('close', () => this.connections.delete(connection));
    });
  }

  private async shutdown(): Promise<void> {
    console.info('Closing http server.');
    await new Promise((resolve) => this.server.close(resolve));

    for (const connection of this.connections) {
      connection.destroy();
    }
  }
}
