"use client";

import { useActionState } from "react";

import { signIn, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const INITIAL_STATE: LoginState = { error: null, email: "" };

type LoginFormProps = {
  next: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL_STATE);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-white/15 bg-night-deep/85 p-6 shadow-2xl">
      <input type="hidden" name="next" value={next} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        tone="dark"
        defaultValue={state.email}
      />
      <TextField label="Mật khẩu" name="password" type="password" autoComplete="current-password" required tone="dark" />
      {state.error && (
        <p role="alert" className="rounded-md border border-grana-light/40 bg-grana/25 px-3 py-2 text-sm text-chalk">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>
    </form>
  );
}
