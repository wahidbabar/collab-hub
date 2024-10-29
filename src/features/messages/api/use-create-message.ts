import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type RequestType = {
  body: string;
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  image?: Id<"_storage">;
  conversationId?: Id<"conversations">;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const UseCreateMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  const mutation = useMutation(api.messages.create);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, isPending, isError, isSuccess, isSettled };
};
