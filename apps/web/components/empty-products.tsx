import { FolderCodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyProducts() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Fileboxes Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any fileboxes yet. Get started by creating
          your first filebox.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex items-center justify-center">
          <Button>Create Filebox</Button>
        </div>
      </EmptyContent>
      {/* <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button> */}
    </Empty>
  );
}
