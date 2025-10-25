import { ArrowUpRightIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyIdentity() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>No Identity Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t verified your identity yet. Get started by verifing
          your indenity through Self.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex items-center justify-center">
          <Button>Create Filebox</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}
