import { useState, useEffect, useCallback } from "react";

import { ajaxClient } from "../utils/ajaxClient";

type useQueryParams = {
  path: string;
  skip?: boolean;
  queryInterval?: number;
};

type UseQueryState<Type> = {
  data: Type | undefined;
  error: string | undefined;
  status: "loading" | "rejected" | "fullfilled" | "idle";
  skip?: boolean;
};

export const useQuery = <Type = any>(params: useQueryParams) => {
  const { path, skip = false, queryInterval } = params;

  const [state, setState] = useState<UseQueryState<Type>>({
    data: undefined,
    error: undefined,
    status: "idle",
  });

  const fetchCall = useCallback(() => {
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
  }, [path]);

  useEffect(() => {
    if (!skip) {
      fetchCall();
    }
  }, [fetchCall, skip]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (queryInterval) {
      timerId = setInterval(() => fetchCall(), queryInterval);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  });

  return { data: state.data, error: state.error, status: state.status };
};
