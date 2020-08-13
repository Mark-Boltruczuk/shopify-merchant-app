import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App, { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";
import translations from "@shopify/polaris/locales/en.json";
import fetch from "isomorphic-unfetch";

import { getCookies } from "../helpers/Utils";
import "@shopify/polaris/styles.css";
import "../assets/custom.css";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    const cookies = getCookies(ctx.req.headers.cookie);
    const res = await fetch(
      `${HOST}/api/initials?shopOrigin=${cookies.shopOrigin}`
    );
    let json = await res.json();

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.merchant = json.merchant;
    pageProps.milestones = json.milestones;

    return {
      pageProps,
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get("shopOrigin");

    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </AppProvider>
    );
  }
}

export default MyApp;
