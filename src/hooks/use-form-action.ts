/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { type DefaultValues, type FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UseFormActionProps<TFieldValues extends FieldValues> {
  action: (prevState: any, data: any) => Promise<any>;
  schema?: z.ZodType<any, any, any> | any;
  defaultValues?: DefaultValues<TFieldValues> | any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useFormAction<TFieldValues extends FieldValues = FieldValues>({
  action,
  schema,
  defaultValues,
  onSuccess,
  onError,
}: UseFormActionProps<TFieldValues>) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Determine which resolver to use
  const resolver =
    schema instanceof z.ZodType
      ? zodResolver(schema as z.ZodType<any, any, any>)
      : yupResolver(schema as any);

  const form = useForm<TFieldValues>({
    resolver: schema ? (resolver as any) : undefined,
    defaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit = (data: any) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const lastProcessedStateRef = useRef<any>(state);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!state || state === lastProcessedStateRef.current) return;

    lastProcessedStateRef.current = state;

    if (state.error) {
      onErrorRef.current?.(state.error);
      toast.error(state.error);
    } else {
      onSuccessRef.current?.(state);
    }
  }, [state]);

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isPending,
    reset,
    state,
  };
}
