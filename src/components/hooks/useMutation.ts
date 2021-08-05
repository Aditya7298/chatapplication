import { useState, useCallback } from "react";

type MutationFunctionType = (...args: any[]) => Promise<Response>;

export const useMutation = <Type>(mutationFunction: MutationFunctionType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Type | undefined>();
  const [error, setError] = useState<string | undefined>();

  const mutate = useCallback(
    async (data: any, mutationSideEffects = {}) => {
      setIsLoading(true);

      const response = await mutationFunction(data);
      const resBody = await response.json();

      if (!response.ok) {
        setError(resBody.message);
        if (mutationSideEffects.onError) {
          mutationSideEffects.onError();
        }
      } else {
        setData(resBody);
        if (mutationSideEffects.onSuccess) {
          mutationSideEffects.onSuccess();
        }
      }

      setIsLoading(false);
    },
    [mutationFunction]
  );

  return {
    mutate,
    isLoading,
    data,
    error,
  };
};
