const BASE_URL = process.env.REACT_APP_BASE_URL;

type fetchRequestBuilderParams = {
  path: string;
  payload?: object;
  method: string;
};

type ajaxClientParams = {
  path: string;
  payload?: object;
};

const fetchRequestBuilder = ({
  path,
  payload,
  method,
}: fetchRequestBuilderParams) => {
  const options = {
    method,
  };

  if (payload) {
    Object.assign(options, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  return fetch(BASE_URL + path, options);
};

export const ajaxClient = {
  get({ path }: ajaxClientParams) {
    return fetchRequestBuilder({ path, method: "GET" });
  },

  post({ path, payload }: ajaxClientParams) {
    return fetchRequestBuilder({ path, payload, method: "POST" });
  },

  patch({ path, payload }: ajaxClientParams) {
    return fetchRequestBuilder({ path, payload, method: "PATCH" });
  },
};
