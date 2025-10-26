"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { redirect } from "next/navigation";

type Bid = {
  bundleId: string;
  buyer: `0x${string}`;
  priceEth: string;
  note?: string;
  timestamp: number;
  chainId?: number;
};

type Product = {
  cid: string;
  price: string;
  name: string;
  description: string;
  previewUrl: string;
};

export default function CheckoutPage() {
  const { address, chainId } = useAccount();
  const [note, setNote] = useState("");
  const [signing, setSigning] = useState(false);
  const [status, setStatus] = useState("");

  const [product_, setProduct] = useState<Product | null>(null);

  // Product data - in production this would come from URL params or props
  const product: Product = {
    name: "Premium Dataset Bundle",
    description:
      "High-quality encrypted dataset containing comprehensive market analysis, research data, and proprietary algorithms. Instant delivery upon purchase verification.",
    cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    price: "14.99",
    previewUrl: `https://i.imgur.com/Eo4o6MR.png`,
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cid = params.get("cid");
    if (cid) {
      fetch(`https://ipfs.io/ipfs/${cid}`)
        .then((x) => x.json())
        .then((x) => {
          console.log(x);
        });
      // Update product data based on CID
    } else {
      redirect("/");
    }
  }, []);

  const isReady = useMemo(() => !!address, [address]);

  const signBid = async () => {
    // try {
    //   const bid: Bid = {
    //     bundleId: product.cid,
    //     buyer: address,
    //     priceEth: product.price,
    //     note: note || undefined,
    //     timestamp: Date.now(),
    //     chainId,
    //   };
    //   const message = `BID\nbundleId:${bid.bundleId}\nbuyer:${bid.buyer}\npriceEth:${bid.priceEth}\ntimestamp:${bid.timestamp}${bid.note ? `\nnote:${bid.note}` : ""}${bid.chainId ? `\nchainId:${bid.chainId}` : ""}`;
    //   setSigning(true);
    //   setStatus("Requesting signature...");
    //   const signature: string = await (window as any).ethereum.request({
    //     method: "personal_sign",
    //     params: [message, address],
    //   });
    //   setStatus("Saving bid...");
    //   const out = {
    //     bid,
    //     signature,
    //     message,
    //   };
    //   const blob = new Blob([JSON.stringify(out, null, 2)], {
    //     type: "application/json",
    //   });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `bid-${address.slice(0, 6)}-${bid.bundleId.slice(0, 8)}.json`;
    //   a.click();
    //   URL.revokeObjectURL(url);
    //   setStatus("Purchase bid created! Share bid.json with the seller.");
    // } catch (e) {
    //   console.error(e);
    //   alert("Failed to sign bid. See console.");
    //   setStatus("");
    // } finally {
    //   setSigning(false);
    // }
  };

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Product Details */}
          <div className="lg:col-span-3">
            <Card className="border-zinc-900 bg-zinc-950">
              <CardContent className="p-0">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-zinc-900">
                  <img
                    src={product?.previewUrl || "/placeholder.svg"}
                    alt={product?.name || "-"}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-emerald-400 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">
                          {product?.name ?? "..."}
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {product?.description ?? "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Bundle CID</span>
                      <code className="text-emerald-400 font-mono text-xs bg-zinc-900 px-2 py-1 rounded">
                        {product?.cid.slice(0, 12)}...{product?.cid.slice(-8)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Chain</span>
                      <code className="text-zinc-400 font-mono text-xs">
                        Sepolia
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Type</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-700 text-emerald-400 text-xs"
                      >
                        Poseidon Cipher Encrypted
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-2">
            <Card className="border-zinc-900 bg-zinc-950 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Checkout</CardTitle>
                <CardDescription className="text-zinc-500">
                  Sign a purchase bid with your wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-zinc-400">Price</span>
                    <div className="text-right">
                      <div className="text-3xl font-semibold text-emerald-400">
                        {product?.price} PYUSD
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-zinc-800" />
                </div>

                {!address ? (
                  <div className="space-y-3">
                    <ConnectButton />
                    <p className="text-xs text-center text-zinc-500">
                      Connect your wallet to create a signed purchase bid
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-zinc-800 bg-black p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Wallet</span>
                        <code className="text-zinc-300 font-mono text-xs">
                          {address.slice(0, 6)}...{address.slice(-4)}
                        </code>
                      </div>
                      {chainId && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">Network</span>
                          <span className="text-zinc-300 text-xs">
                            Chain ID: {chainId}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-zinc-400 text-sm">
                        Arbiter (optional)
                      </Label>
                      <Input
                        id="note"
                        value={note}
                        disabled
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="wallet address of arbiter"
                        className="bg-black border-zinc-800 text-zinc-200 text-sm"
                      />
                      <p className="text-xs text-zinc-500">
                        Provide wallet info of the arbiter to add aditional
                        insurance for a purchase
                      </p>
                    </div>

                    <Button
                      onClick={signBid}
                      disabled={!isReady || signing}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {signing ? "Signing..." : "Purchase"}
                    </Button>

                    {status && (
                      <div className="text-xs text-center text-emerald-400 animate-in fade-in font-medium">
                        {status}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
                <div className="flex items-start gap-2 w-full">
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    Your wallet signs a purchase bid. Share the generated{" "}
                    <code className="text-emerald-400">bid.json</code> with the
                    seller offchain for license delivery.
                  </p>
                </div>
              </CardFooter>
            </Card>

            <div className="mt-4 rounded-lg border border-zinc-900 bg-zinc-950 p-4 font-mono text-xs text-zinc-400">
              <p>{"//"} No onchain transaction required</p>
              <p className="mt-1">
                {"//"} Settlement happens offchain via signed bids
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
