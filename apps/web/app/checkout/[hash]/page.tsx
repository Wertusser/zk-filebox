"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FileSignature } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export default function CheckoutPage() {
  const { address, isConnecting, chainId } = useAccount();
  const [bundleId, setBundleId] = useState("");
  const [priceEth, setPriceEth] = useState("0.01");
  const [note, setNote] = useState("");
  const [signing, setSigning] = useState(false);
  const [status, setStatus] = useState("");

  const isReady = useMemo(
    () => !!address && !!bundleId && !!priceEth,
    [address, bundleId, priceEth]
  );

  const signBid = async () => {};

  return (
    <main className="px-4">
      <div className="mx-auto max-w-3xl py-12">
        <div className="space-y-6 rounded-lg border border-zinc-900 bg-zinc-950 p-6">
          <h1 className="text-xl font-semibold">Purchase</h1>
          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">bundleId</Label>
              <Input
                value={bundleId}
                onChange={(e) => setBundleId(e.target.value.trim())}
                placeholder="paste bundleId"
                className="bg-black border-zinc-800 text-zinc-200 font-mono"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Price (PYUSD)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={priceEth}
                  onChange={(e) => setPriceEth(e.target.value)}
                  className="bg-black border-zinc-800 text-zinc-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Note (optional)</Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="delivery email or pubkey, etc."
                  className="bg-black border-zinc-800 text-zinc-200"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={signBid}
              disabled={!isReady || signing}
              className="bg-emerald-500 hover:bg-emerald-400 text-black"
            >
              <FileSignature className="mr-2 h-4 w-4" />
              Create signed bid
            </Button>
            <div className="text-xs text-zinc-500">{status}</div>
          </div>
          <div className="rounded border border-zinc-900 bg-black p-4 font-mono text-xs text-zinc-400">
            {"//"} Your wallet signs a human‑readable message. Share the
            downloaded bid.json with the seller offchain.
          </div>
        </div>
      </div>
    </main>
  );
}
