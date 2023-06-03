import Queue from 'bull';
import taskHandlers from './tasks';

import config from '../config/redisConfig';


const taskQueue = new Queue('airtime', config.AIRTIME_REDIS_URI);

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

// started job
taskQueue.on('active', (jobId) => {
  console.log(`[QUEUE][GOAL]: Job Started!`);
});

// complete jobs that we (our process) started are resolved
taskQueue.on('completed', (jobId:any, result) => {
  console.log(`[QUEUE][GOAL]: Job Completed!`);
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  const resultData = JSON.parse(result);
  localJob.resolve(resultData);
});

// failed jobs that we (our process) started are rejected
taskQueue.on('failed', (jobId:any, err) => {
  console.log(`[QUEUE][GOAL]: Job Failed!`);
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  localJob.reject(err);
});

// start task workers
function startWorkers() {
  console.log('[QUEUE][GOAL]: Queue Started! Awaiting Jobs...');
  const _taskHandlers: any = taskHandlers;
  for (const name in _taskHandlers) {
    console.log(_taskHandlers)
    const handler = _taskHandlers[name];
    taskQueue.process(name, handler);
  }
}

// exports.taskQueue = taskQueue;
// exports.tasks = tasks;
// exports.startedJobs = startedJobs;
export default {
  taskQueue,
  tasks,
  startedJobs,
  startWorkers 
};
