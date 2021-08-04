import { useState, useCallback } from "react";

type MutationFunctionType = (...args: any[]) => Promise<Response>;

export const useMutation = <Type>(mutationFunction: MutationFunctionType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Type | undefined>();
  const [error, setError] = useState<string | undefined>();

  const mutate = useCallback(
    async (data: any) => {
      setIsLoading((prevState) => !prevState);

      const response = await mutationFunction(data);
      const resBody = await response.json();

      if (!response.ok) {
        setError(resBody.message);
      } else {
        setData(resBody);
      }

      setIsLoading((prevState) => !prevState);
    },
    [mutationFunction]
  );

  return { mutate, isLoading, data, error };
};
