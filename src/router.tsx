import { Navigate, RouteObject, createBrowserRouter, redirect } from "react-router-dom";

import { ResultLayout } from "./components/ResultLayout";
import { getNetwork } from "./services/networksService";
import { encodeAddress } from "./utils/address";

import { AccountPage } from "./screens/account";
import { BlockPage } from "./screens/block";
import { CallPage } from "./screens/call";
import { ErrorPage } from "./screens/error";
import { EventPage } from "./screens/event";
import { ExtrinsicPage } from "./screens/extrinsic";
import { HomePage } from "./screens/home";
import { NetworkPage } from "./screens/network";
import { NotFoundPage } from "./screens/notFound";
import { SearchPage } from "./screens/search";
import { RuntimePage } from "./screens/runtime";

import { config } from "./config";

export const routes: RouteObject[] = [
	{
		path: "/",
		element: <HomePage />,
	},
	{
		element: <ResultLayout />,
		children: [
			{
				path: "search/:tab?",
				element: <SearchPage />,
				errorElement: <ErrorPage />,
			},
			{
				id: "network",
				path: ":network",
				loader: ({ params }) => {
					const { network: networkName } = params;

					try {
						const network = getNetwork(networkName as string);
						return { network };
					} catch (e) {
						throw new Response("Network not found", {status: 404});
					}
				},
				errorElement: <ErrorPage />,
				children: [
					{
						path: ":tab?",
						element: <NetworkPage />,
					},
					{
						path: "extrinsic/:id/:tab?",
						element: <ExtrinsicPage />,
					},
					{
						path: "block/:id/:tab?",
						element: <BlockPage />,
					},
					{
						path: "call/:id/:tab?",
						element: <CallPage />,
					},
					{
						path: "account/:address/:tab?",
						element: <AccountPage />,
						loader: ({ params }) => {
							const { network: networkName, address } = params;
							const network = networkName ? getNetwork(networkName, false) : undefined;

							if (!network || !address) {
								return null;
							}

							const encodedAddress = encodeAddress(address, network.prefix);
							if (address !== encodedAddress) {
								return redirect(`/${network.name}/account/${encodedAddress}`);
							}

							return null;
						}
					},
					{
						path: "event/:id",
						element: <EventPage />,
					},
					{
						path: "latest-extrinsics",
						element: <Navigate to=".." replace />,
					},
					{
						path: "runtime",
						element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
					},
					{
						path: "runtime/:specVersion",
						element: config.devtools.enabled ? <RuntimePage /> : <NotFoundPage />,
					},
					{
						path: "*",
						element: <NotFoundPage />,
					},
				],
			},
		]
	}
];

export const router = createBrowserRouter(routes, {
	basename: window.location.hostname === "localhost"
		? undefined
		: process.env.PUBLIC_URL
});
