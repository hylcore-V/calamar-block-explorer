/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";
import { CircularProgress, Tab, TableBody, TableCell, TableRow, Tabs, Tooltip } from "@mui/material";

import CrossIcon from "../assets/cross-icon.png";
import CheckIcon from "../assets/check-icon.png";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import InfoTable from "../components/InfoTable";
import ParamsTable from "../components/ParamsTable";

import { useExtrinsic } from "../hooks/useExtrinsic";
import { useEvents } from "../hooks/useEvents";

import {
	convertTimestampToTimeFromNow,
	formatDate,
} from "../utils/convertTimestampToTimeFromNow";
import { encodeAddress } from "../utils/formatAddress";
import { Link } from "../components/Link";
import { CallsTable } from "../components/calls/CallsTable";
import { useCalls } from "../hooks/useCalls";
import { tabsStyle, tabStyle, tabsWrapperStyle } from "../styled/tabs";
import { ReactElement, useEffect, useState } from "react";

type ExtrinsicPageParams = {
	network: string;
	id: string;
};

function ExtrinsicPage() {
	const { network, id } = useParams() as ExtrinsicPageParams;
	const [tab, setTab] = useState<string | undefined>(undefined);

	const [extrinsic, { loading }] = useExtrinsic(network, { id_eq: id });
	const events = useEvents(network, { extrinsic: { id_eq: id } }, "id_ASC");
	const calls = useCalls(network, { extrinsic: { id_eq: id } }, "id_ASC");

	const tabHandles: ReactElement[] = [];
	const tabPanes: ReactElement[] = [];

	if (events.loading || events.items.length > 0) {
		tabHandles.push(
			<Tab
				key="events"
				css={tabStyle}
				label={
					<>
						<span>Events</span>
						{events.loading && <CircularProgress size={14} />}
					</>
				}
				value="events"
			/>
		);

		tabPanes.push(
			<EventsTable
				key="events"
				loading={events.loading}
				items={events.items}
				network={network}
				pagination={events.pagination}
			/>
		);
	}

	if (calls.loading || calls.items.length > 0) {
		tabHandles.push(
			<Tab
				key="calls"
				css={tabStyle}
				label={
					<>
						<span>Calls</span>
						{calls.loading && <CircularProgress size={14} />}
					</>
				}
				value="calls"
			/>
		);

		tabPanes.push(
			<CallsTable
				key="calls"
				loading={calls.loading}
				items={calls.items}
				network={network}
				pagination={calls.pagination}
			/>
		);
	}

	useEffect(() => {
		if (events.items.length > 0) {
			setTab("events");
		} else if (calls.items.length > 0) {
			setTab("calls");
		}
	}, [events, calls]);

	return (
		<>
			<Card>
				<CardHeader>Extrinsic #{id}</CardHeader>
				<InfoTable
					item={extrinsic}
					loading={loading}
					noItemMessage="No extrinsic found"
				>
					{extrinsic && (
						<TableBody>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>{extrinsic.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Hash</TableCell>
								<TableCell>
									{extrinsic.hash}
									<CopyToClipboardButton value={extrinsic.hash} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Block time</TableCell>
								<TableCell>
									<Tooltip
										arrow
										placement="top"
										title={formatDate(extrinsic.block.timestamp)}
									>
										<span>
											{convertTimestampToTimeFromNow(extrinsic.block.timestamp)}
										</span>
									</Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Block hash</TableCell>
								<TableCell>
									<Link to={`/${network}/block/${extrinsic.block.id}`}>
										{extrinsic.block.hash}
									</Link>
									<CopyToClipboardButton value={extrinsic.block.hash} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>{extrinsic.call.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Is signed</TableCell>
								<TableCell>
									<img src={extrinsic.signature ? CheckIcon : CrossIcon} />
								</TableCell>
							</TableRow>
							{extrinsic.signature?.address && (
								<TableRow>
									<TableCell>Account</TableCell>
									<TableCell>
										<Link
											to={`/${network}/account/${extrinsic.signature.address}`}
										>
											{encodeAddress(network, extrinsic.signature?.address) ||
												extrinsic.signature?.address}
										</Link>
										<CopyToClipboardButton
											value={
												encodeAddress(
													network,
													extrinsic.signature?.address
												) || extrinsic.signature?.address
											}
										/>
									</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>Index in block</TableCell>
								<TableCell>{extrinsic.indexInBlock}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Success</TableCell>
								<TableCell>
									<img src={extrinsic.success ? CheckIcon : CrossIcon} />
								</TableCell>
							</TableRow>
							{extrinsic.tip !== null && (
								<TableRow>
									<TableCell>Tip</TableCell>
									<TableCell>{extrinsic.tip}</TableCell>
								</TableRow>
							)}
							{extrinsic.fee !== null && (
								<TableRow>
									<TableCell>Fee</TableCell>
									<TableCell>{extrinsic.fee}</TableCell>
								</TableRow>
							)}
							{extrinsic.error !== null && (
								<TableRow>
									<TableCell>Error</TableCell>
									<TableCell>{JSON.stringify(extrinsic.error)}</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>Version</TableCell>
								<TableCell>{extrinsic.version}</TableCell>
							</TableRow>
							{extrinsic.call.args && (
								<TableRow>
									<TableCell>Parameters</TableCell>
									<TableCell>
										<ParamsTable args={extrinsic.call.args} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
				</InfoTable>
			</Card>
			{extrinsic && (
				<Card>

					<div css={tabsWrapperStyle}>
						<Tabs
							css={tabsStyle}
							onChange={(_, tab) => setTab(tab)}
							value={tab || tabHandles[0]!.props.value}
						>
							{tabHandles}
						</Tabs>
						{tab ? tabPanes.find((it) => it.key === tab) : tabPanes[0]}
					</div>
				</Card>

			)}
		</>
	);
}

export default ExtrinsicPage;
