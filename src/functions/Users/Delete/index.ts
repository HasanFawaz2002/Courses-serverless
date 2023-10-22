import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.deleteUserById`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/deleteUserById/{UserId}',
        cors: true,
      },
    },
  ],
};
