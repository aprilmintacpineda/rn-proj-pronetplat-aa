import { store } from 'fluxible-js';
import File from 'classes/File';
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

export async function xhr (path, { method = 'get', ...options } = {}) {
  const url = resolveUrl(path);
  const config = {
    ...options,
    method,
    headers: {
      ...options.headers,
      'content-type': 'application/json'
    }
  };

  if (store.authToken) config.headers.Authorization = `Bearer ${store.authToken}`;
  if (options.body) config.body = JSON.stringify(options.body);
  const response = await fetch(url, config);
  if (response.status < 200 || response.status >= 300) throw response;
  return response;
}

export async function uploadFileToSignedUrl ({ signedUrl, file }) {
  const response = await fetch(signedUrl, {
    method: 'put',
    headers: {
      'Content-Type': file.mimeType
    },
    body: { uri: file.uri }
  });

  if (response.status !== 200) throw response;
  return response;
}

export async function xhrWithFile (path, { method = 'post', ...options } = {}) {
  const url = resolveUrl(path);
  const config = {
    ...options,
    method,
    headers: {
      'content-type': 'multipart/form-data',
      ...options.headers
    },
    body: new FormData()
  };

  if (store.authToken) config.headers.Authorization = `Bearer ${store.authToken}`;

  Object.keys(options.body).forEach(key => {
    let value = options.body[key];

    if (value) {
      if (value.constructor === File) {
        value = {
          uri: value.uri,
          type: value.mimeType,
          name: value.name
        };
      } else {
        value = value.toString();
      }
    }

    config.body.append(key, value);
  });

  const response = await fetch(url, config);
  if (response.status < 200 || response.status >= 300) throw response;
  return response;
}
