import { authFetch } from 'utils';

export const getEvent = (page = 1) =>
  authFetch('https://api.github.com/user', 'get').then(res =>
    authFetch(res.data.received_events_url, 'get', {
      params: { page, per_page: 10 },
    })
  );
