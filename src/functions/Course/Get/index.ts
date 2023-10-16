import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getCourseById`,
  events: [
    {
      http: {
        method: 'get',
        path: '/getCourseById/{CourseID}',
        
      },
    },
  ],
};
