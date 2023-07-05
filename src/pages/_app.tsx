import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
