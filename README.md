# SimpleKit

Responsive connect wallet and account component built on top of Wagmi and shadcn/ui.

SimpleKit is the simplest way to integrate a connect wallet experience into your React.js web application. It is built on top of primitives where it's your components, your code. No more editing style/theme props.

![Demo](https://utfs.io/f/77740eed-6f9e-4379-a9c9-e7122ceea01f-bfjzn0.gif)

## Installation

### 1. Install Wagmi

Install Wagmi and its peer dependencies:

```bash
pnpm add wagmi viem@2.x @tanstack/react-query
```

- [Wagmi](https://wagmi.sh/) is a React Hooks library for Ethereum, this is the library you will use to interact with the connected wallet.
- [Viem](https://viem.sh/) is a TypeScript interface for Ethereum that performs blockchain operations.
- [TanStack](https://tanstack.com/query/v5) Query is an async state manager that handles requests, caching, and more.
- [TypeScript](https://wagmi.sh/react/typescript) is optional, but highly recommended.

### 2. API Keys

SimpleKit utilises [WalletConnect's](https://walletconnect.com/) SDK to help with connecting wallets. WalletConnect 2.0 requires a `projectId` which you can create quickly and easily for free over at [WalletConnect Cloud](https://cloud.walletconnect.com/).

### 3. Set up the `Web3Provider`: [web3-provider.tsx](src/components/web3-provider.tsx)

Make sure to replace the `projectId` with your own WalletConnect Project ID, if you wish to use WalletConnect (highly recommended)!

```tsx
"use client";

// 1. Import modules
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { SimpleKitProvider } from "@/components/simplekit";

// Make sure to replace the projectId with your own WalletConnect Project ID,
// if you wish to use WalletConnect (recommended)!
const projectId = "123...abc";

// 2. Define your Wagmi config
const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected({ target: "metaMask" }),
    coinbaseWallet(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

// 3. Initialize your new QueryClient
const queryClient = new QueryClient();

// 4. Create your Wagmi provider
export function Web3Provider(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SimpleKitProvider>{props.children}</SimpleKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

> :warning: When using a framework that doesn't support [React Server Components](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), you will need to remove the `"use client"` directive at the beginning of this file.

Now that you have your `Web3Provider` component, you can wrap your app with it

```tsx
import { Web3Provider } from "@/components/web3-provider";

const App = () => {
  return (
    <Web3Provider>
      ...
      {children}
      ...
    </Web3Provider>
  );
};
```

### 4. Install the `dialog`, `drawer`, `scroll-area`, and `button` components from shadcn/ui.

```bash
pnpm dlx shadcn-ui@latest add dialog drawer scroll-area button
```

> :warning: You will have to run the command below to initialize shadcn/ui if it is not already configured. Please see the official [shadcn/ui install](https://ui.shadcn.com/docs/installation) documentation if you are not using Next.js.

```bash
pnpm dlx shadcn-ui@latest init
```

Alternatively, if you are not using shadcn/ui cli, you can manually copy the components from [shadcn/ui](https://ui.shadcn.com/docs) or directly copy from [dialog.tsx](src/components/ui/dialog.tsx), [drawer.tsx](src/components/ui/drawer.tsx), [scroll-area.tsx](src/components/ui/scroll-area.tsx), and [button.tsx](src/components/ui/button.tsx).

If you copied the drawer component manually, make sure to install vaul.

```bash
pnpm add vaul
```

### 5. Copy the `simplekit-modal` component: [simplekit-modal.tsx](src/components/simplekit-modal.tsx)

This component is a modified version of the [Credenza](https://github.com/redpangilinan/credenza) component that combines the shadcn/ui `dialog` and `drawer`.

<details>
<summary>Click to show code</summary>

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BaseProps {
  children: React.ReactNode;
}

interface RootSimpleKitModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SimpleKitModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const SimpleKitModal = ({ children, ...props }: RootSimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModal = isDesktop ? Dialog : Drawer;

  return <SimpleKitModal {...props}>{children}</SimpleKitModal>;
};

const SimpleKitModalTrigger = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <SimpleKitModalTrigger className={className} {...props}>
      {children}
    </SimpleKitModalTrigger>
  );
};

const SimpleKitModalClose = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <SimpleKitModalClose className={className} {...props}>
      {children}
    </SimpleKitModalClose>
  );
};

const SimpleKitModalContent = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <SimpleKitModalContent
      className={cn(
        "rounded-t-3xl sm:rounded-3xl md:max-w-[360px] [&>button]:right-[26px] [&>button]:top-[26px]",
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </SimpleKitModalContent>
  );
};

const SimpleKitModalDescription = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <SimpleKitModalDescription className={className} {...props}>
      {children}
    </SimpleKitModalDescription>
  );
};

const SimpleKitModalHeader = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <SimpleKitModalHeader
      className={cn("space-y-0 pb-6 md:pb-3", className)}
      {...props}
    >
      {children}
    </SimpleKitModalHeader>
  );
};

const SimpleKitModalTitle = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <SimpleKitModalTitle className={cn("text-center", className)} {...props}>
      {children}
    </SimpleKitModalTitle>
  );
};

const SimpleKitModalBody = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  return (
    <ScrollArea
      className={cn(
        "h-[234px] max-h-[300px] px-6 md:-mr-4 md:h-full md:min-h-[260px] md:px-0 md:pr-4",
        className,
      )}
      {...props}
    >
      {children}
    </ScrollArea>
  );
};

const SimpleKitModalFooter = ({
  className,
  children,
  ...props
}: SimpleKitModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const SimpleKitModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <SimpleKitModalFooter
      className={cn("py-3.5 md:py-0", className)}
      {...props}
    >
      {children}
    </SimpleKitModalFooter>
  );
};

export {
  SimpleKitModal,
  SimpleKitModalTrigger,
  SimpleKitModalClose,
  SimpleKitModalContent,
  SimpleKitModalDescription,
  SimpleKitModalHeader,
  SimpleKitModalTitle,
  SimpleKitModalBody,
  SimpleKitModalFooter,
};

/*
 * Hook used to calculate the width of the screen using the
 * MediaQueryListEvent. This can be moved to a separate file
 * if desired (src/hooks/use-media-query.tsx).
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
```

</details>

> :warning: When using a framework that doesn't support [React Server Components](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), you will need to remove the `"use client"` directive at the beginning of this file.

### 6. Copy the `simplekit` component: [simplekit.tsx](src/components/simplekit.tsx)

<details>
<summary>Click to show code</summary>

```tsx
"use client";

import * as React from "react";

import {
  SimpleKitModal,
  SimpleKitModalBody,
  SimpleKitModalContent,
  SimpleKitModalDescription,
  SimpleKitModalFooter,
  SimpleKitModalHeader,
  SimpleKitModalTitle,
} from "@/components/simplekit-modal";
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

const SimpleKitContext = React.createContext<{
  pendingConnector: Connector | null;
  setPendingConnector: React.Dispatch<React.SetStateAction<Connector | null>>;
  isConnectorError: boolean;
  setIsConnectorError: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  pendingConnector: null,
  setPendingConnector: () => {},
  isConnectorError: false,
  setIsConnectorError: () => false,
  open: false,
  setOpen: () => false,
});

function SimpleKitProvider(props: { children: React.ReactNode }) {
  const { status, address } = useAccount();
  const [pendingConnector, setPendingConnector] =
    React.useState<Connector | null>(null);
  const [isConnectorError, setIsConnectorError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
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
    <SimpleKitContext.Provider
      value={{
        pendingConnector,
        setPendingConnector,
        isConnectorError,
        setIsConnectorError,
        open,
        setOpen,
      }}
    >
      {props.children}
      <SimpleKitModal open={open} onOpenChange={setOpen}>
        <SimpleKitModalContent>
          {isConnected ? <Account /> : <Connectors />}
        </SimpleKitModalContent>
      </SimpleKitModal>
    </SimpleKitContext.Provider>
  );
}

function ConnectWalletButton() {
  const simplekit = useSimpleKit();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <Button onClick={simplekit.toggleModal} className="rounded-xl">
      {simplekit.isConnected ? (
        <>
          {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
          {address && (
            <span>{ensName ? `${ensName}` : simplekit.formattedAddress}</span>
          )}
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: userBalance } = useBalance({ address });
  const context = React.useContext(SimpleKitContext);

  const formattedAddress = address?.slice(0, 6) + "•••" + address?.slice(-4);
  const formattedUserBalace = userBalance?.value
    ? parseFloat(formatEther(userBalance.value)).toFixed(4)
    : undefined;

  function handleDisconnect() {
    context.setOpen(false);
    setTimeout(() => {
      disconnect();
    }, MODAL_CLOSE_DURATION);
  }

  return (
    <>
      <SimpleKitModalHeader>
        <SimpleKitModalTitle>Connected</SimpleKitModalTitle>
        <SimpleKitModalDescription className="sr-only">
          Account modal for your connected Web3 wallet.
        </SimpleKitModalDescription>
      </SimpleKitModalHeader>
      <SimpleKitModalBody className="h-[280px]">
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
      </SimpleKitModalBody>
    </>
  );
}

function Connectors() {
  const context = React.useContext(SimpleKitContext);

  return (
    <>
      <SimpleKitModalHeader>
        <BackChevron />
        <SimpleKitModalTitle>
          {context.pendingConnector?.name ?? "Connect Wallet"}
        </SimpleKitModalTitle>
        <SimpleKitModalDescription className="sr-only">
          Connect your Web3 wallet or create a new one.
        </SimpleKitModalDescription>
      </SimpleKitModalHeader>
      <SimpleKitModalBody>
        {context.pendingConnector ? <WalletConnecting /> : <WalletOptions />}
      </SimpleKitModalBody>
      <SimpleKitModalFooter>
        <div className="h-0" />
      </SimpleKitModalFooter>
    </>
  );
}

function WalletConnecting() {
  const context = React.useContext(SimpleKitContext);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-9 md:pt-5">
      {context.pendingConnector?.icon && (
        <div className="size-[116px] relative flex items-center justify-center rounded-2xl border p-3">
          <img
            src={context.pendingConnector?.icon}
            alt={context.pendingConnector?.name}
            className="size-full overflow-hidden rounded-2xl"
          />
          <img />
          {context.isConnectorError ? <RetryConnectorButton /> : null}
        </div>
      )}

      <div className="space-y-3.5 px-3.5 text-center sm:px-0">
        <h1 className="text-xl font-semibold">
          {context.isConnectorError ? "Request Error" : "Requesting Connection"}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {context.isConnectorError
            ? "There was an error with the request. Click above to try again."
            : `Open the ${context.pendingConnector?.name} browser extension to connect your wallet.`}
        </p>
      </div>
    </div>
  );
}

function WalletOptions() {
  const context = React.useContext(SimpleKitContext);
  const { connectors, connect } = useConnectors();

  return (
    <div className="flex flex-col gap-3.5">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => {
            context.setIsConnectorError(false);
            context.setPendingConnector(connector);
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
  const context = React.useContext(SimpleKitContext);

  if (!context.pendingConnector) {
    return null;
  }

  function handleClick() {
    context.setIsConnectorError(false);
    context.setPendingConnector(null);
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
  const context = React.useContext(SimpleKitContext);
  const { connect } = useConnect({
    mutation: {
      onError: () => context.setIsConnectorError(true),
    },
  });

  function handleClick() {
    if (context.pendingConnector) {
      context.setIsConnectorError(false);
      connect({ connector: context.pendingConnector });
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

function useConnectors() {
  const context = React.useContext(SimpleKitContext);
  const { connect, connectors } = useConnect({
    mutation: {
      onError: () => context.setIsConnectorError(true),
    },
  });

  const sortedConnectors = React.useMemo(() => {
    let metaMaskConnector: Connector | undefined;
    let injectedConnector: Connector | undefined;

    const formattedConnectors = connectors.reduce(
      (acc: Array<Connector>, curr) => {
        console.log(curr.id);
        switch (curr.id) {
          case "metaMaskSDK":
            metaMaskConnector = {
              ...curr,
              icon: "https://utfs.io/f/be0bd88f-ce87-4cbc-b2e5-c578fa866173-sq4a0b.png",
            };
            return acc;
          case "metaMask":
            injectedConnector = {
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
      !formattedConnectors.find(
        ({ id }) =>
          id === "io.metamask" ||
          id === "io.metamask.mobile" ||
          id === "injected",
      )
    ) {
      return [metaMaskConnector, ...formattedConnectors];
    }

    if (injectedConnector) {
      const nonMetaMaskConnectors = formattedConnectors.filter(
        ({ id }) => id !== "io.metamask" && id !== "io.metamask.mobile",
      );
      return [injectedConnector, ...nonMetaMaskConnectors];
    }
    return formattedConnectors;
  }, [connectors]);

  return { connectors: sortedConnectors, connect };
}

/*
 * This hook can be moved to a separate file
 * if desired (src/hooks/use-simple-kit.tsx).
 */
function useSimpleKit() {
  const { address } = useAccount();
  const context = React.useContext(SimpleKitContext);

  const isModalOpen = context.open;
  const isConnected = address && !context.pendingConnector;
  const formattedAddress = address?.slice(0, 6) + "•••" + address?.slice(-4);

  function open() {
    context.setOpen(true);
  }

  function close() {
    context.setOpen(false);
  }

  function toggleModal() {
    context.setOpen((prevState) => !prevState);
  }

  return {
    isModalOpen,
    isConnected,
    formattedAddress,
    open,
    close,
    toggleModal,
  };
}

export {
  SimpleKitProvider,
  ConnectWalletButton,
  useSimpleKit,
  SimpleKitContext,
};
```

</details>

> :warning: When using a framework that doesn't support [React Server Components](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks), you will need to remove the `"use client"` directive at the beginning of this file.

### 7. Update the import paths based on your project structure.

## Usage

An example [connect wallet button](https://github.com/vaunblu/SimpleKit/blob/main/src/components/simplekit.tsx#L87) component is exported from `simplekit` and can be used as follows

```tsx
import { ConnectWalletButton } from "@/components/simplekit";
```

```tsx
<ConnectWalletButton />
```

A [useSimpleKit](https://github.com/vaunblu/SimpleKit/blob/main/src/components/simplekit.tsx#L430) hook is also exported from `simplekit` and can be used to trigger the SimpleKit modal from any component. Below is an example of a custom component that opens the SimpleKit modal.

```tsx
"use client";

import { useSimpleKit } from "@/components/simplekit";
import { Button } from "@/components/ui/button";

export function OpenModalButton() {
  const simplekit = useSimpleKit();

  return <Button onClick={simplekit.open}>Open SimpleKit Modal</Button>;
}
```

## Additional Build Tooling Setup

### Next.js support and using SSR with the app router

SimpleKit uses [WalletConnect's](https://walletconnect.com/) SDK to help with connecting wallets. WalletConnect 2.0 pulls in Node.js dependencies that Next.js does not support by default. You can mitigate this by adding the following to your `next.config.js` file:

```js
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};
```

If you are looking to use SimpleKit with the Next.js app router, you can follow the official [Wagmi SSR](https://wagmi.sh/react/guides/ssr) documentation or change the following:

1. Copy the `wagmi-config` file: [wagmi-config.ts](src/lib/wagmi-config.ts)

The config needs to be separate from the WagmiProvider given that is a client component with the `"use client"` directive.

```ts
import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// Make sure to replace the projectId with your own WalletConnect Project ID,
// if you wish to use WalletConnect (recommended)!
const projectId = "123...abc";

export function getConfig() {
  return createConfig({
    chains: [mainnet],
    connectors: [
      injected({ target: "metaMask" }),
      coinbaseWallet(),
      walletConnect({ projectId }),
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(),
    },
  });
}

export const config = getConfig();
```

This version of the config sets the `ssr` config property to `true` and uses Wagmi's `createStorage` to initialize a `cookieStorage` on the `storage` config property.

2. Hydrate your cookie in Layout

In our [layout.tsx](src/app/layout.tsx) file (a Server Component), we will need to extract the cookie from the `headers` function and pass it to `cookieToInitialState`.

We use the `getConfig()` helper from [wagmi-config.ts](src/lib/wagmi-config) to pass in `cookieToInitialState`.

```tsx
import { Web3Provider } from "@/components/web3-provider";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/wagmi-config";
...

export default function Layout() {
  ...
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie"),
  );

  return (
    <Web3Provider initialState={initialState}>
      ...
      {children}
      ...
    </Web3Provider>
  );
}
```

3. Replace the contents of `web3-provider` with the content from the `web3-provider-ssr` component: [web3-provider-ssr.tsx](src/components/web3-provider-ssr.tsx)

```tsx
"use client";

// 1. Import modules
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, State } from "wagmi";
import { getConfig } from "@/lib/wagmi-config";
import { SimpleKitProvider } from "@/components/simplekit";

// 2. Define your Wagmi config
const config = getConfig();

// 3. Initialize your new QueryClient
const queryClient = new QueryClient();

// 4. Create your Wagmi provider
export function Web3Provider(props: {
  initialState: State | undefined;
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <SimpleKitProvider>{props.children}</SimpleKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

The two changes here are we use `getConfig()` to initialize our Wagmi config and our `WagmiProvider` consumes the `initialState` we passed from our Layout.

---

### Vaul background scaling

If you want to enable background scaling, wrap your app with the `vaul-drawer-wrapper`.

```html
<div vaul-drawer-wrapper="" className="bg-background">{children}</div>
```

See my implementation at [layout.tsx](src/app/layout.tsx). Make sure to update the background color to match your project's theme.

---

### Local connector icons

Imported Wagmi connectors do not have their own icons. I provided URLs to hosted files so you don't need to worry about them. However, if you want to self host your icons you can copy the files in the [icons](public/icons) directory into your `public` folder.

Then change the following code in your `simplekit` component:

```tsx
const formattedConnectors = connectors.reduce((acc: Array<Connector>, curr) => {
  switch (curr.id) {
    case "metaMaskSDK":
      metaMaskConnector = {
        ...curr,
        icon: "/icons/metamask-icon.png",
      };
      return acc;
    case "injected":
      injectedConnector = {
        ...curr,
        icon: "/icons/metamask-icon.png",
      };
      return acc;
    case "safe":
      acc.push({
        ...curr,
        icon: "/icons/gnosis-safe-icon.png",
      });
      return acc;
    case "coinbaseWalletSDK":
      acc.push({
        ...curr,
        icon: "coinbase-icon.png",
      });
      return acc;
    case "walletConnect":
      acc.push({
        ...curr,
        icon: "wallet-connect-icon.png",
      });
      return acc;
    default:
      acc.unshift(curr);
      return acc;
  }
}, []);
```

## Credits

- [shadcn/ui](https://github.com/shadcn-ui/ui) by [shadcn](https://github.com/shadcn)
- [Vaul](https://github.com/emilkowalski/vaul) by [emilkowalski](https://github.com/emilkowalski)
- [Credenza](https://github.com/redpangilinan/credenza) by [redpangilinan](https://github.com/redpangilinan)
- [ConnectKit](https://docs.family.co/connectkit) by [Family](https://family.co/)
