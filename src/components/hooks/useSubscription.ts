import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface useSubscriptionParams<Type> {
  subscriptionCallback: (data: Type) => void;
  url: string;
  interval?: number;
}

export const useSubscription = <Type = any>({
  subscriptionCallback,
  url,
  interval = 1000,
}: useSubscriptionParams<Type>) => {
  const [error, setError] = useState<string | undefined>();
  const [queryId, setQueryId] = useState(Date.now().toString());

  useEffect(() => {
    const timerId = setInterval(
      () => setQueryId(Date.now().toString()),
      interval
    );

    return () => clearInterval(timerId);
  });

  useEffect(() => {
    let serverFaliure = false;

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(BASE_URL + url, {
      signal,
    })
      .then((res) => {
        if (!res.ok) {
          serverFaliure = true;
        }

        return res.json();
      })
      .then((resBody) => {
        if (!serverFaliure) {
          subscriptionCallback(resBody);
        } else {
          setError(resBody);
        }
      })
      .catch((err) => {
        setError("Some unexpected error occurred !!");
      });

    return () => controller.abort();
  }, [queryId, url, subscriptionCallback]);

  return { error };
};
