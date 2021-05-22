import { store } from 'fluxible-js';
import { logEvent } from './logging';
import Timer from 'classes/Timer';
import { API_BASE_URL } from 'env';

function clean (path) {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

const cleanAPiBaseUrl = clean(API_BASE_URL);

function resolveUrl (path = '') {
  if (/https?:\/\/w?w?w?\.?/gim.test(path)) return path;
  const cleanPath = clean(path);
  return `${cleanAPiBaseUrl}/${cleanPath}`;
}

export function xhrWithParams (url, params = {}, options) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(field => {
    const value = params[field];
    if (value) searchParams.append(field, encodeURIComponent(value));
  });

  const search = searchParams.toString();
  const cleanPath = clean(url);

  return xhr(`/${cleanPath}${search ? `?${search}` : ''}`, options);
}

export async function xhr (
  path,
  { method = 'get', ...options } = {}
) {
  const url = resolveUrl(path);
  const config = {
    ...options,
    method,
    headers: {
      ...options.headers,
      'device-token': store.deviceToken,
      'content-type': 'application/json'
    }
  };

  if (store.authToken)
    config.headers.Authorization = `Bearer ${store.authToken}`;

  if (options.body) config.body = JSON.stringify(options.body);

  logEvent('apiCall', {
    path,
    method,
    step: 'request'
  });

  const timer = new Timer();
  timer.reset();
  const response = await fetch(url, config);

  logEvent('apiCall', {
    path,
    method,
    step: 'response',
    timeTaken: timer.lap(),
    responseStatus: response.status
  });

  if (response.status < 200 || response.status > 299) throw response;
  return response;
}

export async function uploadFileToSignedUrl ({ signedUrl, file }) {
  logEvent('s3Upload', { step: 'request' });

  const timer = new Timer();
  timer.reset();

  const response = await fetch(signedUrl, {
    method: 'put',
    headers: {
      'Content-Type': file.type
    },
    body: { uri: file.uri }
  });

  logEvent('s3Upload', {
    step: 'response',
    timeTaken: timer.lap(),
    responseStatus: response.status
  });

  if (response.status !== 200) throw response;
  return response;
}
