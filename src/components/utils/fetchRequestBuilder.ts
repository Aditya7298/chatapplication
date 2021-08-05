const BASE_URL = process.env.REACT_APP_BASE_URL;

type fetchRequestBuilderParams = {
  path: string;
  payload?: object;
  method: string;
};

export const fetchRequestBuilder = ({
  path,
  payload,
  method,
}: fetchRequestBuilderParams) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    Object.assign(options, { body: JSON.stringify(payload) });
  }

  return { url: BASE_URL + path, options };
};
