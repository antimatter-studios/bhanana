"use client";

import { useActionState } from "react";

type LoginState = {
  error?: string;
};

const initialState: LoginState = {};

export default function LoginForm({
  action,
}: {
  action: (_state: LoginState, formData: FormData) => Promise<LoginState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Username</label>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
          placeholder="admin"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-(--accent-strong)"
      >
        Sign in
      </button>
    </form>
  );
}
