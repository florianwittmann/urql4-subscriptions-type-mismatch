import { createClient } from "graphql-ws";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  cacheExchange,
  Client,
  fetchExchange,
  subscriptionExchange,
  Provider as UrqlProvider,
} from "urql";
import "./index.css";

const wsClient = createClient({
  //works for both, http and https, if we have a https the http part is repalced with ws and is becoming wss
  url: "ws://localhost/graphql",
});

const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (request) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(request, sink),
        }),
      }),
    }),
  ],
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <UrqlProvider value={urqlClient}>
      <div>Some App</div>
    </UrqlProvider>
  </StrictMode>
);
