import { authFetch } from 'utils';

export const getNotification = (page = 1) =>
  authFetch('https://api.github.com/notifications', 'get', {
    params: {
      all: true,
      before: new Date().toISOString(),
      page,
    },
  });

export const getSingleNotification = id =>
  authFetch(`https://api.github.com/notifications/threads/${id}`, 'get');
