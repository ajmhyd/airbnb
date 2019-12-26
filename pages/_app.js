import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StoreProvider } from 'easy-peasy';
import theme from '../src/theme';
import store from '../store';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let user = null;
    if (ctx.req.session.passport.user) {
      user = ctx.req.session.passport.user;
    }
    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {},
      user,
    };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, user } = this.props;

    if (user) {
      store.getActions().user.setUser(user);
    }

    return (
      <>
        <Head>
          <title>airbnb</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <StoreProvider store={store}>
            <Component {...pageProps} />
          </StoreProvider>
        </ThemeProvider>
      </>
    );
  }
}
