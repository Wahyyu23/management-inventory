import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Access Denied
          </h1>

          <p className="text-sm text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
