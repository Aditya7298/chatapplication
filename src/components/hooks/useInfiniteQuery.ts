import { useState, useCallback, useEffect } from "react";

type UseInfiniteQueryParams<Type> = {
  fetchQuery: (pageParam: any) => Promise<Response>;
  getNextPageParam: (lastPage: Type[] | undefined) => any;
};

type UseInfiniteQueryState<Type> = {
  data: Type[] | undefined;
  pages: Type[][];
  error: string | undefined;
  status: "loading" | "rejected" | "fullfilled" | "idle";
  nextCursor: any;
};

export const useInfiniteQuery = <Type = any>(
  params: UseInfiniteQueryParams<Type>
) => {
  const { fetchQuery, getNextPageParam } = params;

  const [state, setState] = useState<UseInfiniteQueryState<Type>>({
    data: undefined,
    pages: [],
    error: undefined,
    status: "idle",
    nextCursor: undefined,
  });

  const fetchCall = useCallback(
    (nextPageParam: any) => {
      setState((prevState) => ({ ...prevState, status: "loading" }));

      fetchQuery(nextPageParam)
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
            pages: [...prevState.pages, resBody.data],
            data: prevState.data
              ? [...prevState.data, ...resBody.data]
              : [...resBody.data],
            status: "fullfilled",
            nextCursor: resBody.nextCursor,
          }));
        })
        .catch((err) => {
          setState((prevState) => ({
            ...prevState,
            error: err.status
              ? err.message
              : "Some unexpected error occurred !!",
            status: "rejected",
          }));
        });
    },
    [fetchQuery]
  );

  const fetchNextPage = useCallback(() => {
    if (!state.nextCursor) {
      return;
    }

    const lastPage =
      state.pages.length > 0 ? state.pages[state.pages.length - 1] : undefined;

    const nextPageParam = getNextPageParam(lastPage);

    fetchCall(nextPageParam);
  }, [getNextPageParam, fetchCall, state.pages, state.nextCursor]);

  useEffect(() => {
    fetchCall(undefined);
  }, [fetchCall]);

  const setQueryData = useCallback((newData) => {
    setState((prevState) => ({ ...prevState, data: newData }));
  }, []);

  return { ...state, fetchNextPage, setQueryData };
};
