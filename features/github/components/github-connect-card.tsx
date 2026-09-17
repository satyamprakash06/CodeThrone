"use client";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
  statusBadge,
  statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { disconnectGithubApp } from "../actions";

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function ArrowSquareOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function Plugs({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m8 12 4 4m-2-6 4 4m-9 5 3-3m5-5 3-3M6 7l11 11" />
    </svg>
  );
}

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
  return (
    <p className="text-xs text-muted-foreground">
      Installed for{" "}
      <span className="font-medium text-green-700 dark:text-green-400">
        @{accountLogin}
      </span>
      . The app can read repository metadata and post review comments on pull
      requests.
    </p>
  );
}

function DisconnectedDetails() {
  return (
    <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
      <li>Access public and private repositories you select</li>
      <li>Receive webhooks for pull request events</li>
      <li>Post AI-generated review comments on PRs</li>
    </ul>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button
        type="submit"
        variant="outline"
        className={statusButtonClass.danger}
      >
        <Plugs />
        Disconnect GitHub App
      </Button>
    </form>
  );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
  return (
    <Button asChild className={statusButtonClass.success}>
      <a href={installUrl}>
        <GithubLogo />
        Install GitHub App
        <ArrowSquareOut className="size-3 opacity-80" />
      </a>
    </Button>
  );
}

function ConnectionDetails({
  connected,
  accountLogin,
}: {
  connected: boolean;
  accountLogin: string | null;
}) {
  if (connected) {
    return <ConnectedDetails accountLogin={accountLogin} />;
  }

  return <DisconnectedDetails />;
}

function ConnectionActions({
  connected,
  installUrl,
}: {
  connected: boolean;
  installUrl: string;
}) {
  if (connected) {
    return <ConnectedActions />;
  }

  return <DisconnectedActions installUrl={installUrl} />;
}

export function GithubConnectCard({
  userId,
  installation,
}: GithubConnectCardProps) {
  const { connected, accountLogin } = installation;
  // Install URL encodes userId so the callback can associate the installation
  const installUrl = getGithubInstallUrl(userId);

  // Default to neutral styling; switch to green when connected
  let cardBorderClass = "border-border";
  let iconWrapperClass = "border-border bg-muted";
  let statusTone: "success" | "neutral" = "neutral";
  let statusLabel = "Not connected";

  if (connected) {
    cardBorderClass = "border-green-500/30";
    iconWrapperClass =
      "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400";
    statusTone = "success";
    statusLabel = "Connected";
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className={cn("max-w-2xl transition-colors", cardBorderClass)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-none border",
                  iconWrapperClass,
                )}
              >
                <GithubLogo className="size-5" />
              </span>
              <div>
                <CardTitle>GitHub App</CardTitle>
                <CardDescription>
                  Install the Chai reviewer app on your GitHub account or
                  organization to access public and private repositories.
                </CardDescription>
              </div>
            </div>
            <span className={statusBadge(statusTone)}>{statusLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConnectionDetails
            connected={connected}
            accountLogin={accountLogin}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <ConnectionActions connected={connected} installUrl={installUrl} />
        </CardFooter>
      </Card>
    </div>
  );
}
