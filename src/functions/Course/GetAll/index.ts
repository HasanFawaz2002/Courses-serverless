import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getAllCourses`,
  events: [
    {
      http: {
        method: 'get',
        path: '/getAllCourses',
        cors: true,
      },
    },
  ],
};
