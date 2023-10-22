import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createCourse`,
  events: [
    {
      http: {
        method: 'post',
        path: '/createCourse',
        cors: true,
      },
    },
  ],
};
