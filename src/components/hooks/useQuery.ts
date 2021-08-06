import { useState, useEffect } from "react";

import { ajaxClient } from "../utils/ajaxClient";

type useQueryParams = {
  path: string;
  payload?: Object;
  skip?: boolean;
  interval?: number;
};

type UseQueryState<Type> = {
  data: Type | undefined;
  error: string | undefined;
  isLoading: boolean;
  queryTimestamp: string;
  skip?: boolean;
};

export const useQuery = <Type = any>(params: useQueryParams) => {
  const { path, payload, skip = false, interval } = params;

  const [state, setState] = useState<UseQueryState<Type>>({
    data: undefined,
    error: undefined,
    isLoading: false,
    queryTimestamp: Date.now().toString(),
  });

  useEffect(() => {
    if (skip) {
      return;
    }

    setState((prevState) => ({ ...prevState, isLoading: true }));

    ajaxClient
      .get({ path })
      .then(async (res) => {
        const resBody = await res.json();

        if (!res.ok) {
          const message = resBody.message;

          // eslint-disable-next-line no-throw-literal
          throw {
            status: res.status,
            message,
          };
        }

        setState((prevState) => ({
          ...prevState,
          data: resBody,
          isLoading: false,
        }));
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          error: err.status ? err.message : "Some unexpected error occurred !!",
          isLoading: false,
        }));
      });
  }, [path, skip, payload, state.queryTimestamp]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (interval) {
      timerId = setInterval(
        () =>
          setState((prevState) => ({
            ...prevState,
            queryTimestamp: Date.now().toString(),
          })),
        interval
      );
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  });

  return { data: state.data, error: state.error, isLoading: state.isLoading };
};
