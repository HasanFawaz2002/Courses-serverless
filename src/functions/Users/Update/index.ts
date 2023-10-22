import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.updateUserById`,
  events: [
    {
      http: {
        method: 'put',
        path: '/updateUserById/{UserId}',
        cors: true,
      },
    },
  ],
};
