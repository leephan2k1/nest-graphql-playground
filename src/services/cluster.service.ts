import { Injectable } from '@nestjs/common';
import cluster from 'cluster';
import * as os from 'os';

const numCPUs = os.availableParallelism();

@Injectable()
export class AppClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      console.info(`Master server started on ${process.pid}`);
      console.info(`Number CPUs: `, numCPUs);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.info(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.info(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
