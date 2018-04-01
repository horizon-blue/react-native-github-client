import { authFetch } from 'utils';

export const getNotification = (page = 1) =>
  authFetch('https://api.github.com/notifications', 'get', {
    params: {
      all: true,
      page,
    },
  });
