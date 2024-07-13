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

interface RootConnectWalletModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ConnectWalletModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const ConnectWalletModal = ({
  children,
  ...props
}: RootConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModal = isDesktop ? Dialog : Drawer;

  return <ConnectWalletModal {...props}>{children}</ConnectWalletModal>;
};

const ConnectWalletModalTrigger = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <ConnectWalletModalTrigger className={className} {...props}>
      {children}
    </ConnectWalletModalTrigger>
  );
};

const ConnectWalletModalClose = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <ConnectWalletModalClose className={className} {...props}>
      {children}
    </ConnectWalletModalClose>
  );
};

const ConnectWalletModalContent = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <ConnectWalletModalContent
      className={cn(
        "rounded-t-3xl sm:rounded-3xl md:max-w-[360px] [&>button]:right-[26px] [&>button]:top-[26px]",
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </ConnectWalletModalContent>
  );
};

const ConnectWalletModalDescription = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <ConnectWalletModalDescription className={className} {...props}>
      {children}
    </ConnectWalletModalDescription>
  );
};

const ConnectWalletModalHeader = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <ConnectWalletModalHeader
      className={cn("space-y-0 pb-6 md:pb-3", className)}
      {...props}
    >
      {children}
    </ConnectWalletModalHeader>
  );
};

const ConnectWalletModalTitle = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <ConnectWalletModalTitle
      className={cn("text-center", className)}
      {...props}
    >
      {children}
    </ConnectWalletModalTitle>
  );
};

const ConnectWalletModalBody = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  return (
    <ScrollArea
      className={cn(
        "h-[230px] max-h-[300px] px-6 md:-mr-4 md:h-full md:min-h-[260px] md:px-0 md:pr-4",
        className,
      )}
      {...props}
    >
      {children}
    </ScrollArea>
  );
};

const ConnectWalletModalFooter = ({
  className,
  children,
  ...props
}: ConnectWalletModalProps) => {
  const isDesktop = useMediaQuery(desktop);
  const ConnectWalletModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <ConnectWalletModalFooter
      className={cn("py-3.5 md:py-0", className)}
      {...props}
    >
      {children}
    </ConnectWalletModalFooter>
  );
};

export {
  ConnectWalletModal,
  ConnectWalletModalTrigger,
  ConnectWalletModalClose,
  ConnectWalletModalContent,
  ConnectWalletModalDescription,
  ConnectWalletModalHeader,
  ConnectWalletModalTitle,
  ConnectWalletModalBody,
  ConnectWalletModalFooter,
};

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
