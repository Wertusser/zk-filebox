import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="self-end mt-auto border-t border-zinc-900 bg-black py-8 px-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} zkFilebox</span>
          <span className="text-zinc-700">•</span>
          <span className="text-emerald-400 font-mono text-xs">
            Built for ETHOnline 2025
          </span>
        </div>
        <a
          href="https://github.com/Wertusser/zk-filebox"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>View on GitHub</span>
        </a>
      </div>
    </footer>
  );
}
