/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { Card, CardHeader, CardRow } from "../components/Card";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useNetworks } from "../hooks/useNetworks";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useStats } from "../hooks/useStats";
import { StatsInfoTable } from "../components/stats/StatsInfoTable";
import { StatsChart } from "../components/stats/StatsChart";
import { useUsdRates } from "../hooks/useUsdRates";

type ChainDashboardPageParams = {
	network: string;
};

function ChainDashboardPage() {
	const { network } = useParams() as ChainDashboardPageParams;

	const extrinsics = useExtrinsicsWithoutTotalCount(network, undefined, "id_DESC");
	const blocks = useBlocks(network, undefined, "id_DESC");
	const transfers = useTransfers(network, undefined, "id_DESC");
	const topHolders = useBalances(network, undefined, "total_DESC");

	const stats = useStats(network, undefined);

	const usdRates = useUsdRates();

	useDOMEventTrigger("data-loaded", !extrinsics.loading && !blocks.loading && !transfers.loading && !topHolders.loading && !usdRates.loading);

	const networks = useNetworks();
	const networkData = networks.find((item) => item.name === network);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<CardRow>
				<Card>
					<CardHeader>
						{networkData?.displayName} dashboard
					</CardHeader>
					{hasSupport(network, "stats-squid") &&
						<StatsInfoTable stats={stats} />
					}
				</Card>
				{hasSupport(network, "stats-squid") &&
					<Card>
						<CardHeader>
							{networkData?.displayName} statistics
						</CardHeader>
						<StatsChart stats={stats} networkName={network} />
					</Card>
				}
			</CardRow>


			<Card>
				<TabbedContent>
					<TabPane
						label="Extrinsics"
						count={extrinsics.pagination.totalCount}
						loading={extrinsics.loading}
						error={extrinsics.error}
						value="extrinsics"
					>
						<ExtrinsicsTable network={network} extrinsics={extrinsics} showAccount showTime />
					</TabPane>
					<TabPane
						label="Blocks"
						count={blocks.pagination.totalCount}
						loading={blocks.loading}
						error={blocks.error}
						value="blocks"
					>
						<BlocksTable network={network} blocks={blocks} showValidator showTime />
					</TabPane>


					{hasSupport(network, "main-squid") &&
						<TabPane
							label="Transfers"
							count={transfers.pagination.totalCount}
							loading={transfers.loading}
							error={transfers.error}
							value="transfers"
						>
							<TransfersTable network={network} transfers={transfers} showTime />
						</TabPane>
					}
					{hasSupport(network, "balances-squid") &&
						<TabPane
							label="Top holders"
							count={topHolders.pagination.totalCount}
							loading={topHolders.loading}
							error={topHolders.error}
							value="top-holders"
						>
							<BalancesTable network={network} balances={topHolders} usdRates={usdRates} />
						</TabPane>
					}
				</TabbedContent>
			</Card>
		</>
	);
}

export default ChainDashboardPage;
