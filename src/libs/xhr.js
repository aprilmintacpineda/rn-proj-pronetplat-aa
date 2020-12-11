import { store } from 'fluxible-js';
import File from 'classes/File';
import { API_BASE_URL, USE_MOCK_RESPONSES } from 'env';
import mockResponses from 'mockResponses';

function clean (path) {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

function resolveUrl (path = '') {
  const cleanPath = clean(path);
  return `${API_BASE_URL}${cleanPath}`;
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

async function getMockResponse (args) {
  if (!USE_MOCK_RESPONSES) return null;

  // simulate latency
  await new Promise(resolve => {
    // fake latency from 1 to 3 seconds
    const min = 3000;
    const max = 5000;
    const latency = Math.floor(Math.random() * (max - min) + min);
    setTimeout(resolve, latency);
  });

  const { path, method } = args;
  const responseHandlers = mockResponses[`_${method}`];

  console.log('mockResponse handling:', path, method);

  const responseHandler = responseHandlers.find(({ isMatch }) => isMatch(path));

  if (!responseHandler) throw { status: 404 };

  const { handler } = responseHandler;
  const response = handler.constructor === Function ? handler(args) : handler;

  console.log('mockResponse response:', path, response);

  if (response.status < 200 || response.status >= 300) throw response;
  return response;
}

export async function xhr (path, { method = 'get', ...options } = {}) {
  if (USE_MOCK_RESPONSES) return getMockResponse({ path, method, ...options });

  const url = resolveUrl(path);
  const config = {
    ...options,
    method,
    headers: {
      ...options.headers,
      'content-type': 'application/json'
    }
  };

  if (store.credentials) {
    config.headers.accessToken = store.credentials.accessToken;
    config.headers.idToken = store.credentials.idToken;
  }

  if (options.body) config.body = JSON.stringify(options.body);
  const response = await fetch(url, config);
  if (response.status < 200 || response.status >= 300) throw response;
  return response;
}

export async function xhrUpload (path, { method = 'post', ...options } = {}) {
  if (USE_MOCK_RESPONSES) return getMockResponse({ path, method, ...options });

  const url = resolveUrl(path);
  const headers = {
    'content-type': 'multipart/form-data',
    ...options.headers
  };

  if (store.credentials) {
    config.headers.accessToken = store.credentials.accessToken;
    config.headers.idToken = store.credentials.idToken;
  }

  const body = new FormData();

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

    body.append(key, value);
  });

  const config = {
    ...options,
    method,
    headers,
    body
  };

  const response = await fetch(url, config);

  if (response.status < 200 || response.status >= 300) throw response;
  return response;
}
