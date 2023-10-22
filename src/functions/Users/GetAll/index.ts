import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getAllUsers`,
  events: [
    {
      http: {
        method: 'get',
        path: '/getAllUsers',
        cors: true,
      },
    },
  ],
};
