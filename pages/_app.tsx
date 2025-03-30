import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { ToastProvider } from "./components/ui/ToastContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ClerkProvider>
  );
}
