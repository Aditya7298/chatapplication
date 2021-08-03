import { useState, useEffect } from "react";

type useQueryParams = {
  url: string;
  method: string;
  payload?: Object;
  skip?: boolean;
};

export const useQuery = <Type>(params: useQueryParams) => {
  const { url, method, payload } = params;
  const skip = params.skip || false;

  const [data, setData] = useState<Type | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!skip);

  useEffect(() => {
    const options = { method };

    if (payload) {
      Object.assign(options, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!skip) {
      let serverFaliure = false;

      fetch(url, options)
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
  }, [url, skip, method, payload]);

  return { data, error, isLoading };
};
