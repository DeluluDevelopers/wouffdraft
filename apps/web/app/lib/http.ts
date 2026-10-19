// Browser-side JSON client for our own API. The session cookie rides along
// automatically; errors carry the API message and any field errors.

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: FieldErrors = {},
  ) {
    super(message);
  }
}

type ApiBody<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { path: string; message: string }[];
};

export async function api<T = unknown>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...rest } = init;
  const res = await fetch(path, {
    credentials: "same-origin",
    ...rest,
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let json: ApiBody<T> | null = null;
  try {
    json = (await res.json()) as ApiBody<T>;
  } catch {
    // Non-JSON error page
  }

  if (!res.ok || !json?.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of json?.errors ?? []) {
      if (issue.path && !fieldErrors[issue.path]) fieldErrors[issue.path] = issue.message;
    }
    const firstFieldMessage = Object.values(fieldErrors)[0];
    throw new ApiError(
      firstFieldMessage && json?.message === "Validation failed"
        ? firstFieldMessage
        : json?.message || "Something went wrong. Please try again.",
      res.status,
      fieldErrors,
    );
  }

  return json.data as T;
}
