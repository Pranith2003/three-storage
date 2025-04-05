"use client";
import { Button } from "@/components/ui/button";
import { useSDK } from "@metamask/sdk-react";
import { formatAddress } from "@/lib/wallet-utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Wallet } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { accountIdAtom } from "@/lib/atom";
import { useAtom } from "jotai";

export const ConnectWalletButton = () => {
  const router = useRouter();
  const [id, setId] = useAtom(accountIdAtom);
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const idExists = async () => {
    const response = await axios.get(`/api/user?user_account_id=${account}`);
    if (response.status === 200) {
      console.log(response.data.user);
      if (response.data.user === "User not found") {
        router.push("/register");
      } else {
        router.push("/dashboard");
      }
    } else {
      console.log("User not found, creating new user...");
    }
  };

  useEffect(() => {
    if (connected && account) {
      setId(account);
      idExists();
    }
  }, [sdk, connected, account]);

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
      router.push("/");
    }
  };

  console.log(account);

  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <Button onClick={disconnect} className="w-full" variant="outline">
              Disconnect
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};
