import { store } from 'fluxible-js';
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

export function xhrWithParams (url, params = {}) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(field => {
    const value = params[field];
    if (value) searchParams.append(field, value);
  });

  const search = searchParams.toString();
  const cleanPath = clean(url);

  return xhr(`/${cleanPath}${search ? `?${search}` : ''}`);
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
  const response = await fetch(url, config);

  if (response.status < 200 || response.status >= 300)
    throw response;

  return response;
}

export async function uploadFileToSignedUrl ({ signedUrl, file }) {
  const response = await fetch(signedUrl, {
    method: 'put',
    headers: {
      'Content-Type': file.type
    },
    body: { uri: file.uri }
  });

  if (response.status !== 200) throw response;
  return response;
}
