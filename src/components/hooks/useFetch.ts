import { useState, useEffect } from "react";

export const useFetch = <Type>(url: string) => {
  const [data, setData] = useState<Type>({} as Type);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let serverFaliure = false;

    fetch(url)
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
          setError(resBody);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Some unexpected error occurred !!");
      });
  }, [url]);

  return { data, error, isLoading };
};
