import { useState, useCallback } from "react";

type MutationFunctionType = (...args: any[]) => Promise<Response>;

type UseMutationState = {
  status: "idle" | "loading" | "fullfiled" | "rejected";
  error: string | undefined;
};

export const useMutation = (mutationFunction: MutationFunctionType) => {
  const [state, setState] = useState<UseMutationState>({
    status: "idle",
    error: undefined,
  });

  const mutate = useCallback(
    async (data: any, mutationSideEffects = {}) => {
      setState({ status: "loading", error: undefined });

      try {
        const res = await mutationFunction(data);
        const resBody = await res.json();

        if (!res.ok) {
          setState({ status: "rejected", error: resBody.message });
          if (mutationSideEffects.onError) {
            mutationSideEffects.onError();
          }
        } else {
          setState({ status: "fullfiled", error: undefined });
          if (mutationSideEffects.onSuccess) {
            mutationSideEffects.onSuccess(resBody);
          }
        }
      } catch (err) {
        setState({
          status: "rejected",
          error: "Unable to connect to server, please try again.",
        });
        if (mutationSideEffects.onError) {
          mutationSideEffects.onError();
        }
      }
    },
    [mutationFunction]
  );

  return {
    mutate,
    status: state.status,
    error: state.error,
  };
};
