import type { FormState } from "@/types/form";

type FormMessageProps = {
  state: FormState;
};

export function FormMessage({ state }: FormMessageProps) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="rounded-md border border-green-700/25 bg-green-50 px-3 py-2 text-sm text-green-800">
        {state.success}
      </p>
    );
  }
  return null;
}
