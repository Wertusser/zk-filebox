"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal, Wallet2, Package, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="px-4">
      <section className="mx-auto max-w-5xl pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-emerald-700/40 bg-emerald-950/20 px-3 py-1 text-emerald-400 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5" />
              {"$"} zkFilebox — encrypt. sell. onchain.
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-100">
              zkFilebox
            </h1>
            <p className="max-w-prose text-zinc-400 leading-relaxed">
              Encrypt your data locally, distribute offchain, settle onchain. A
              minimal, hacker‑style static service for creators and data
              vendors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/manage">Start selling</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Feature
              icon={<Shield className="h-4 w-4 text-emerald-400" />}
              title="Privacy-first"
              desc="All encryption and key exchanges happen locally. No trackers, no leaks - only buyer and seller know what’s exchanged."
            />
            <Feature
              icon={<Wallet2 className="h-4 w-4 text-emerald-400" />}
              title="Fully Decentralized"
              desc="No servers, no custodians. Everything - from encryption to delivery - is handled client-side and verifiable with ZKP."
            />
            <Feature
              icon={<Package className="h-4 w-4 text-emerald-400" />}
              title="Sell onchain, distribute offchain"
              desc="Content is shared via IPFS or P2P while payments and proofs are settled trustlessly onchain."
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl pb-20">
        <ol className="grid gap-4 rounded-lg border border-zinc-900 bg-zinc-950 p-4 md:grid-cols-3">
          <li className="space-y-1">
            <div className="text-emerald-400 font-mono text-sm">01</div>
            <div className="font-semibold">Create Identity</div>
            <p className="text-zinc-400 text-sm">
              Connect EOA and generate mnemonic for your private identity.
            </p>
          </li>
          <li className="space-y-1">
            <div className="text-emerald-400 font-mono text-sm">02</div>
            <div className="font-semibold">Bundle</div>
            <p className="text-zinc-400 text-sm">
              Encrypt and upload your digital file to create a secure bundle,
              ready for private distribution.
            </p>
          </li>
          <li className="space-y-1">
            <div className="text-emerald-400 font-mono text-sm">03</div>
            <div className="font-semibold">Purchase & Exchange</div>
            <p className="text-zinc-400 text-sm">
              Buyers sign encrypted bids; sellers verify and privately exchange
              decryption keys—no intermediaries, no data leaks.
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}

function Feature(props: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const { icon, title, desc } = props;
  return (
    <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="mt-1 text-sm text-zinc-400">{desc}</p>
    </div>
  );
}
