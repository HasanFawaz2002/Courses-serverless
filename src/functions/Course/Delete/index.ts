import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.deleteCourseById`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/deleteCourseById/{CourseID}',
        
      },
    },
  ],
};
