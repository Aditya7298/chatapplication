import { useState, useEffect } from "react";
const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(BASE_URL);

type useQueryParams = {
  url: string;
  method: string;
  payload?: Object;
  skip?: boolean;
};

export const useQuery = <Type>(params: useQueryParams) => {
  const { url, method, payload, skip = false } = params;

  const [data, setData] = useState<Type | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(!skip);

  useEffect(() => {
    const options = { method };
    const controller = new AbortController();

    if (payload) {
      Object.assign(options, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
    }

    if (!skip) {
      setIsLoading(true);

      let serverFaliure = false;

      console.log(BASE_URL + url);

      fetch(BASE_URL + url, options)
        .then((res) => {
          if (!res.ok) {
            serverFaliure = true;
          }

          return res.json();
        })
        .then((resBody) => {
          if (!serverFaliure) {
            setData(resBody);
          } else {
            setError(resBody.message);
          }

          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setError("Some unexpected error occurred !!");
        });
    }

    return () => controller.abort();
  }, [url, skip, method, payload]);

  return { data, error, isLoading };
};
