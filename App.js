import React, { useState, useEffect } from "react";

/**
 * expo-status-bar gives you a component and imperative interface to control the
 * app status bar to change its text color, background color, hide it, make it
 * translucent or opaque, and apply animations to any of these changes. Exactly
 * what you are able to do with the StatusBar component depends on the platform
 * you're using.
 * Web browser support: there is no API available on the web for controlling the
 * operating system status bar, so expo-status-bar will noop (it will do
 * nothing, it will also not error).
 */
import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import AsyncStorage from "@react-native-community/async-storage";
import { persistCache } from "apollo3-cache-persist";

/**
 * expo-app-loading tells expo-splash-screen to keep the splash screen visible
 * while the AppLoading component is mounted. This is useful to download and
 * cache fonts, logos, icon images and other assets that you want to be sure the
 * user has on their device for an optimal experience.
 */
import { AppLoading } from "expo";

import HomeScreen from "./src/HomeScreen";
import ChapterScreen from "./src/ChapterScreen";
import { screenOptions } from "./src/styles";

// *-------------------------------------------------------=> APUNTES DE ESTUDIO

/**
 * https://reactnavigation.org/docs/stack-navigator/
 *
 * createStackNavigator:
 * Provides a way for your app to transition between screens where each new
 * screen is placed on top of a stack.
 */

const Stack = createStackNavigator();


/**
 * https://www.apollographql.com/docs/react/caching/cache-configuration/
 * 
 * Apollo Client stores the results of its GraphQL queries in a normalized,
 * in-memory cache. This enables your client to respond to future queries for
 * the same data without sending unnecessary network requests.
 */
const cache = new InMemoryCache();

/**
 * One of the key features that sets Apollo Client apart from other data
 * management solutions is its normalized cache. Apollo Client includes an
 * intelligent cache out of the box, that requires very little configuration to
 * get started with.
 * 
 * watchQuery(options):
 * This watches the cache store of the query according to the options specified
 * and returns an ObservableQuery. We can subscribe to this ObservableQuery and
 * receive updated results through a GraphQL observer when the cache store
 * changes.
 * fetchPolicy specifies the FetchPolicy to be used for this query.
 */
const client = new ApolloClient({
  uri: "https://api.graphql.guide/graphql",
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
});

export default function App() {
  const [loadingCache, setLoadingCache] = useState(true);

  /**
   * persistCache:
   * Simple persistence for all Apollo Client 3.0 cache implementations,
   * including InMemoryCache and Hermes. Supports web and React Native.
   * If you would like to persist and rehydrate your Apollo Cache from a storage
   * provider like AsyncStorage or localStorage, you can use
   * apollo3-cache-persist. apollo3-cache-persist works with all Apollo caches,
   * including InMemoryCache & Hermes, and a variety of different storage
   * providers.
   */
  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return <AppLoading />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "📖 The GraphQL Guide" }}
          />
          <Stack.Screen
            name="Chapter"
            component={ChapterScreen}
            options={({
              route: {
                params: {
                  chapter: { number, title },
                },
              },
            }) => ({
              title: number ? `Chapter ${number}: ${title}` : title,
              gestureResponseDistance: { horizontal: 500 },
            })}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ApolloProvider>
  );
}
