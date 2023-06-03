import Queue from 'bull';
import taskHandlers from './tasks';

import config from '../config/redisConfig';

const taskQueue = new Queue('mobile-data', config.MOBILE_DATA_REDIS_URI);

const tasks: any = {};
const startedJobs: any = {};

// initializes proxy functions for all consumers (workers) from "./tasks.js"
async function init() {
  for (const name in taskHandlers) {
    tasks[name] = async (data:any) => {
      const job = await taskQueue.add(name, data);

      return new Promise((resolve, reject) => {
        startedJobs[job.id] = { resolve, reject };
      });
    };
  }
}
init();

// complete jobs that we (our process) started are resolved
taskQueue.on('global:completed', (jobId, result) => {
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  const resultData = JSON.parse(result);
  localJob.resolve(resultData);
});

// failed jobs that we (our process) started are rejected
taskQueue.on('global:failed', (jobId, err) => {
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  localJob.reject(err);
});

// start task workers
function startWorkers() {
  console.log('[QUEUE][MOBILE-DATA]: Queue Started! Awaiting Jobs...');
  const _taskHandlers:any = taskHandlers
  for (const name in _taskHandlers) {
    const handler = _taskHandlers[name];
    taskQueue.process(name, handler);
  }
}

export default {
  tasks, startedJobs, startWorkers
}
