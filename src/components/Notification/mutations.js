import { authFetch } from 'utils';

export const markAsRead = id =>
  authFetch(`https://api.github.com/notifications/threads/${id}`, 'patch');
