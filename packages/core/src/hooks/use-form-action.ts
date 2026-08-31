/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { type DefaultValues, type FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

/**
 * Form action hook with validation, error handling, and toast notifications.
 * 
 * Wraps `react-hook-form` with form submission logic, Zod validation (optional),
 * automatic success/error callbacks, and toast notifications for user feedback.
 * Handles optimistic updates and error recovery.
 * 
 * @template TFieldValues - Form data shape
 * @param options - Configuration object
 * @param options.action - Async function that handles form submission
 * @param options.schema - Optional Zod schema for validation
 * @param options.defaultValues - Default values for form fields
 * @param options.onSuccess - Callback on successful submission
 * @param options.onError - Callback on error (also triggers toast)
 * @returns Form hook object with handleSubmit, reset, and state
 * 
 * @example
 * ```ts
 * const result = useFormAction({
 *   action: async (_prev, data) => {
 *     await api.submit(data);
 *   },
 *   schema: UserSchema,
 *   onSuccess: (data) => {
 *     navigate("/dashboard");
 *   },
 * });
 * 
 * <form onSubmit={result.onSubmit} {...result.form} />
 * ```
 */

interface UseFormActionProps<TFieldValues extends FieldValues> {
  action: (prevState: any, data: any) => Promise<any>;
  schema?: z.ZodType<any, any, any>;
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

  const form = useForm<TFieldValues>({
    resolver: schema ? (zodResolver(schema as any) as any) : undefined,
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
    // Skip if still initial or if state hasn't changed
    if (state === null || state === lastProcessedStateRef.current) return;

    lastProcessedStateRef.current = state;

    if (state.error) {
      onErrorRef.current?.(state.error);
      toast.error(state.error);
    } else {
      // Trigger onSuccess whenever state changes and no error is present
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
