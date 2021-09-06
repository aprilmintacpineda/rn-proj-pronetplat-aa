import { store } from 'fluxible-js';
import config from 'react-native-config';
import { logEvent } from './logging';
import { sleep } from './time';
import Timer from 'classes/Timer';

function clean (path) {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

const cleanAPiBaseUrl = clean(config.API_BASE_URL);

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
  {
    method = 'get',
    headers,
    deviceToken,
    body: _body,
    ...options
  } = {}
) {
  const url = resolveUrl(path);
  const config = {
    ...options,
    method,
    headers: {
      ...headers,
      'device-token': deviceToken || store.deviceToken || '',
      'content-type': 'application/json'
    }
  };

  const authToken = store.authToken || deviceToken;

  if (authToken)
    config.headers.Authorization = `Bearer ${authToken}`;

  if (_body) {
    const body = Object.keys(_body).reduce(
      (accumulator, current) => {
        let value = _body[current];
        value = value === undefined ? '' : value;

        if (value.constructor === Date)
          accumulator[current] = value.toISOString();
        else accumulator[current] = value;

        return accumulator;
      },
      {}
    );

    config.body = JSON.stringify(body);
  }

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

export async function waitForPicture (url) {
  let isSuccess = false;

  do {
    await sleep(1);

    try {
      const response = await fetch(url, { method: 'head' });
      isSuccess = response.status === 200;
    } catch (error) {
      console.log('waitForPicture', error);
    }
  } while (!isSuccess);

  return true;
}
