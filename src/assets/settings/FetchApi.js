import React from 'react';
import {hostName} from './Host.json';
export const FetchApi = (url, token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };
  return fetch(hostName + '/api' + url, options);
};
export const FetchFormApi = (url, token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: data,
  };
  return fetch(hostName + '/api' + url, options);
};
export default null;
