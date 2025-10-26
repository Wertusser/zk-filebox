import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Terminal } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-900 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-100"
          >
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-mono">zkFilebox</span>
          </Link>
          <Link href="/manage" className="text-zinc-400 hover:text-zinc-200">
            manage
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
