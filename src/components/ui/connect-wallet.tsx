"use client";

import * as React from "react";

import {
  ConnectWalletModal,
  ConnectWalletModalBody,
  ConnectWalletModalContent,
  ConnectWalletModalDescription,
  ConnectWalletModalFooter,
  ConnectWalletModalHeader,
  ConnectWalletModalTitle,
  ConnectWalletModalTrigger,
} from "@/components/ui/connect-wallet-modal";
import { Button } from "@/components/ui/button";
import {
  type Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
} from "wagmi";
import { formatEther } from "viem";
import { Check, ChevronLeft, Copy, RotateCcw } from "lucide-react";

const MODAL_CLOSE_DURATION = 320;

const ConnectWalletContext = React.createContext<{
  pendingConnector: Connector | null;
  setPendingConnector: React.Dispatch<React.SetStateAction<Connector | null>>;
  isConnectorError: boolean;
  setIsConnectorError: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  pendingConnector: null,
  setPendingConnector: () => { },
  isConnectorError: false,
  setIsConnectorError: () => false,
  open: false,
  setOpen: () => false,
});

export function ConnectWallet() {
  const { status, address } = useAccount();
  const [pendingConnector, setPendingConnector] =
    React.useState<Connector | null>(null);
  const [isConnectorError, setIsConnectorError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const formattedAddress = address?.slice(0, 6) + "•••" + address?.slice(-4);
  const isConnected = address && !pendingConnector;

  React.useEffect(() => {
    if (status === "connected" && pendingConnector) {
      setOpen(false);

      const timeout = setTimeout(() => {
        setPendingConnector(null);
        setIsConnectorError(false);
      }, MODAL_CLOSE_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [status, setOpen, pendingConnector, setPendingConnector]);

  return (
    <ConnectWalletContext.Provider
      value={{
        pendingConnector,
        setPendingConnector,
        isConnectorError,
        setIsConnectorError,
        open,
        setOpen,
      }}
    >
      <ConnectWalletModal open={open} onOpenChange={setOpen}>
        <ConnectWalletModalTrigger asChild>
          {isConnected ? (
            <Button className="rounded-xl">
              {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
              {address && (
                <span>{ensName ? `${ensName}` : formattedAddress}</span>
              )}
            </Button>
          ) : (
            <Button className="rounded-xl">Connect Wallet</Button>
          )}
        </ConnectWalletModalTrigger>

        <ConnectWalletModalContent>
          {isConnected ? <Account /> : <Connectors />}
        </ConnectWalletModalContent>
      </ConnectWalletModal>
    </ConnectWalletContext.Provider>
  );
}

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: userBalance } = useBalance({ address });
  const { setOpen } = React.useContext(ConnectWalletContext);

  const formattedAddress = address?.slice(0, 6) + "•••" + address?.slice(-4);
  const formattedUserBalace = userBalance?.value
    ? parseFloat(formatEther(userBalance.value)).toFixed(4)
    : undefined;

  function handleDisconnect() {
    setOpen(false);
    setTimeout(() => {
      disconnect();
    }, MODAL_CLOSE_DURATION);
  }

  return (
    <>
      <ConnectWalletModalHeader>
        <ConnectWalletModalTitle>Connected</ConnectWalletModalTitle>
        <ConnectWalletModalDescription className="sr-only">
          Account modal for your connected Web3 wallet.
        </ConnectWalletModalDescription>
      </ConnectWalletModalHeader>
      <ConnectWalletModalBody className="h-[280px]">
        <div className="flex w-full flex-col items-center justify-center gap-8 md:pt-5">
          <div className="size-24 flex items-center justify-center">
            <img
              className="rounded-full"
              src={`https://avatar.vercel.sh/${address}?size=150`}
              alt="User gradient avatar"
            />
          </div>

          <div className="space-y-1 px-3.5 text-center sm:px-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-semibold">
                <div>{ensName ? `${ensName}` : formattedAddress}</div>
              </h1>
              <CopyAddressButton />
            </div>
            <p className="text-balance text-sm text-muted-foreground">
              {`${formattedUserBalace ?? "0.00"} ETH`}
            </p>
          </div>

          <Button className="w-full rounded-xl" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      </ConnectWalletModalBody>
    </>
  );
}

function Connectors() {
  const { pendingConnector } = React.useContext(ConnectWalletContext);

  return (
    <>
      <ConnectWalletModalHeader>
        <BackChevron />
        <ConnectWalletModalTitle>
          {pendingConnector?.name ?? "Connect Wallet"}
        </ConnectWalletModalTitle>
        <ConnectWalletModalDescription className="sr-only">
          Connect your Web3 wallet or create a new one.
        </ConnectWalletModalDescription>
      </ConnectWalletModalHeader>
      <ConnectWalletModalBody>
        {pendingConnector ? <WalletConnecting /> : <WalletOptions />}
      </ConnectWalletModalBody>
      <ConnectWalletModalFooter>
        <div className="h-0" />
      </ConnectWalletModalFooter>
    </>
  );
}

function WalletConnecting() {
  const { isConnectorError, pendingConnector } =
    React.useContext(ConnectWalletContext);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-9 md:pt-5">
      {pendingConnector?.icon && (
        <div className="size-[116px] relative flex items-center justify-center rounded-2xl border p-3">
          <img
            src={pendingConnector?.icon}
            alt={pendingConnector?.name}
            className="size-full overflow-hidden rounded-2xl"
          />
          <img />
          {isConnectorError ? <RetryConnectorButton /> : null}
        </div>
      )}

      <div className="space-y-3.5 px-3.5 text-center sm:px-0">
        <h1 className="text-xl font-semibold">
          {isConnectorError ? "Request Error" : "Requesting Connection"}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {isConnectorError
            ? "There was an error with the request. Click above to try again."
            : `Open the ${pendingConnector?.name} browser extension to connect your wallet.`}
        </p>
      </div>
    </div>
  );
}

function WalletOptions() {
  const { setIsConnectorError, setPendingConnector } =
    React.useContext(ConnectWalletContext);
  const { connect, connectors } = useConnect({
    mutation: {
      onError: () => setIsConnectorError(true),
    },
  });

  const sortedConnectors = React.useMemo(() => {
    let metaMaskConnector: Connector | undefined;

    const formattedConnectors = connectors.reduce(
      (acc: Array<Connector>, curr) => {
        switch (curr.id) {
          case "metaMaskSDK":
            metaMaskConnector = {
              ...curr,
              icon: "https://utfs.io/f/be0bd88f-ce87-4cbc-b2e5-c578fa866173-sq4a0b.png",
            };
            return acc;
          case "safe":
            acc.push({
              ...curr,
              icon: "https://utfs.io/f/164ea200-3e15-4a9b-9ce5-a397894c442a-awpd29.png",
            });
            return acc;
          case "coinbaseWalletSDK":
            acc.push({
              ...curr,
              icon: "https://utfs.io/f/53e47f86-5f12-404f-a98b-19dc7b760333-chngxw.png",
            });
            return acc;
          case "walletConnect":
            acc.push({
              ...curr,
              icon: "https://utfs.io/f/5bfaa4d1-b872-48a7-9d37-c2517d4fc07a-utlf4g.png",
            });
            return acc;
          default:
            acc.unshift(curr);
            return acc;
        }
      },
      [],
    );

    if (
      metaMaskConnector &&
      !formattedConnectors.find(({ id }) => id === "io.metamask")
    ) {
      return [metaMaskConnector, ...formattedConnectors];
    }

    return formattedConnectors;
  }, [connectors]);

  return (
    <div className="flex flex-col gap-3.5">
      {sortedConnectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => {
            setIsConnectorError(false);
            setPendingConnector(connector);
            connect({ connector });
          }}
        />
      ))}
    </div>
  );
}

function WalletOption(props: { connector: Connector; onClick: () => void }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await props.connector.getProvider();
      setReady(!!provider);
    })();
  }, [props.connector]);

  return (
    <Button
      disabled={!ready}
      onClick={props.onClick}
      size="lg"
      variant="secondary"
      className="justify-between rounded-xl px-4 py-7 text-base font-semibold"
    >
      <p>{props.connector.name}</p>
      {props.connector.icon && (
        <img
          src={props.connector.icon}
          alt={props.connector.name}
          className="size-8 overflow-hidden rounded-[6px]"
        />
      )}
    </Button>
  );
}

function CopyAddressButton() {
  const { address } = useAccount();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [copied, setCopied]);

  async function handleCopy() {
    setCopied(true);
    await navigator.clipboard.writeText(address!);
  }

  return (
    <button className="text-muted-foreground" onClick={handleCopy}>
      {copied ? (
        <Check className="size-4" strokeWidth={4} />
      ) : (
        <Copy className="size-4" strokeWidth={4} />
      )}
    </button>
  );
}

function BackChevron() {
  const { pendingConnector, setIsConnectorError, setPendingConnector } =
    React.useContext(ConnectWalletContext);

  if (!pendingConnector) {
    return null;
  }

  function handleClick() {
    setIsConnectorError(false);
    setPendingConnector(null);
  }

  return (
    <button
      className="absolute left-[26px] top-[42px] z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:top-[26px]"
      onClick={handleClick}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Cancel connection</span>
    </button>
  );
}

function RetryConnectorButton() {
  const { pendingConnector, setIsConnectorError } =
    React.useContext(ConnectWalletContext);
  const { connect } = useConnect({
    mutation: {
      onError: () => setIsConnectorError(true),
    },
  });

  function handleClick() {
    if (pendingConnector) {
      setIsConnectorError(false);
      connect({ connector: pendingConnector });
    }
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className="group absolute -bottom-2 -right-2 rounded-full bg-muted p-1.5 shadow"
      onClick={handleClick}
    >
      <RotateCcw className="size-4 transition-transform group-hover:-rotate-45" />
    </Button>
  );
}
