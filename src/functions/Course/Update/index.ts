import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.updateCourseById`,
  events: [
    {
      http: {
        method: 'put',
        path: '/updateCourseById/{CourseID}',
        cors: true,
      },
    },
  ],
};
