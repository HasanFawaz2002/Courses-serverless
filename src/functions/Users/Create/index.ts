import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createUserCourse`,
  events: [
    {
      http: {
        method: 'post',
        path: '/createUserCourse',
        cors: true,
      },
    },
  ],
};
