import { useState, useCallback } from "react";

type MutationFunctionType = (...args: any[]) => Promise<Response>;

export const useMutation = (mutationFunction: MutationFunctionType) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "fullfiled" | "rejected"
  >("idle");

  const mutate = useCallback(
    async (data: any, mutationSideEffects = {}) => {
      setStatus("loading");

      const res = await mutationFunction(data);
      const resBody = await res.json();

      if (!res.ok) {
        setStatus("rejected");
        if (mutationSideEffects.onError) {
          mutationSideEffects.onError(resBody.message);
        }
      } else {
        setStatus("fullfiled");
        if (mutationSideEffects.onSuccess) {
          mutationSideEffects.onSuccess(resBody);
        }
      }
    },
    [mutationFunction]
  );

  return {
    mutate,
    status,
  };
};
