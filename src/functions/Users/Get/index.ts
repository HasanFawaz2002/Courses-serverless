import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getUserById`,
  events: [
    {
      http: {
        method: 'get',
        path: '/getUserById/{UserId}',
        cors: true,
      },
    },
  ],
};
