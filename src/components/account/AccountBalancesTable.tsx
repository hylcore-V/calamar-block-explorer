/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from "react";
import { Alert } from "@mui/material";
import { css } from "@emotion/react";
import Decimal from "decimal.js";

import { AccountBalance } from "../../model/accountBalance";
import { PageInfo } from "../../model/pageInfo";
import { PaginationOptions } from "../../model/paginationOptions";
import { Resource } from "../../model/resource";
import { SortDirection } from "../../model/sortDirection";
import { SortOrder } from "../../model/sortOrder";
import { SortProperty } from "../../model/sortProperty";
import { UsdRates } from "../../model/usdRates";

import { compareProps } from "../../utils/compare";

import { Currency } from "../Currency";
import { ErrorMessage } from "../ErrorMessage";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";

import { AccountAddress } from "./AccountAddress";

const networkStyle = css`
	display: flex;
	align-items: center;
`;

const prefixStyle = css`
	font-size: 15px;
	opacity: .75;
`;

const networkIconStyle = css`
	width: 42px;
	height: 42px;
	object-fit: contain;
	margin-right: 16px;
	float: left;
`;

type AccountBalanceWithUsdRate = AccountBalance & {
	usdRate?: Decimal
};

function balanceSort(balance: AccountBalanceWithUsdRate, type: "total"|"free"|"reserved") {
	if (balance.balance) {
		// defined balance on top
		return [
			// positive with usd rate first, positive without usd rate second, zero third
			balance.balance[type].greaterThan(0) ? (balance.usdRate ? 3 : 2) : 1,
			balance.balance[type].mul(balance.usdRate || 0)
		];
	}

	// undefined balance on bottom, errors on top
	return [undefined, (balance.error ? 1 : undefined)];
}

const SortProperties = {
	NAME: (balance: AccountBalanceWithUsdRate) => balance.network.displayName,
	PREFIX: (balance: AccountBalanceWithUsdRate) => balance.network.prefix,
	TOTAL: (balance: AccountBalanceWithUsdRate) => balanceSort(balance, "total"),
	FREE: (balance: AccountBalanceWithUsdRate) => balanceSort(balance, "free"),
	RESERVED: (balance: AccountBalanceWithUsdRate) => balanceSort(balance, "reserved")
};

export type AccountBalancesTableProps = {
	balances: Resource<AccountBalance[]>;
	usdRates: Resource<UsdRates>;
	pagination: PaginationOptions;
	onPageChange?: (page: number) => void;
}

const AccountBalancesTableAttribute = ItemsTableAttribute<AccountBalance, SortProperty<AccountBalance>, [UsdRates|undefined]>;

export const AccountBalancesTable = (props: AccountBalancesTableProps) => {
	const { balances, usdRates, pagination, onPageChange } = props;

	const [sort, setSort] = useState<SortOrder<SortProperty<AccountBalanceWithUsdRate>>>({
		property: SortProperties.TOTAL,
		direction: SortDirection.DESC
	});

	const data = useMemo(() => {
		return balances.data
			?.map(it => ({
				...it,
				usdRate: usdRates.data?.[it.network.name]
			}))
			.sort((a, b) =>
				compareProps(a, b, sort.property, sort.direction)
					|| compareProps(a, b, SortProperties.NAME, SortDirection.ASC)
			) || [];
	}, [balances, usdRates, sort]);

	const pageData = useMemo(() => {
		return data?.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize);
	}, [data, pagination.page, pagination.pageSize]);

	const pageInfo = useMemo<PageInfo>(() => ({
		page: pagination.page,
		pageSize: pagination.pageSize,
		hasNextPage: pagination.page * pagination.pageSize < data.length,
		totalPageCount: Math.ceil(data.length / pagination.pageSize)
	}), [data, pagination]);

	const handleSortSelected = useCallback((value: SortOrder<SortProperty<AccountBalance>>) => {
		console.log("set sort", value);
		setSort(value);
		onPageChange?.(0);
	}, [onPageChange]);

	return (
		<div>
			<ItemsTable
				data={pageData}
				additionalData={[usdRates.data]}
				loading={balances.loading || usdRates.loading}
				error={balances.error}
				pageInfo={pageInfo}
				onPageChange={onPageChange}
				sort={sort}
				data-test="account-balances-table"
			>
				<AccountBalancesTableAttribute
					label="Network"
					sortable
					sortOptions={[
						{value: {property: SortProperties.NAME, direction: SortDirection.ASC}, label: "Name"},
						{value: {property: SortProperties.NAME, direction: SortDirection.DESC}, label: "Name"},
						{value: {property: SortProperties.PREFIX, direction: SortDirection.ASC}, label: "Prefix"},
						{value: {property: SortProperties.PREFIX, direction: SortDirection.DESC}, label: "Prefix"}
					]}
					onSortChange={handleSortSelected}
					render={(balance) => (
						<div css={networkStyle}>
							<img src={balance.network.icon} css={networkIconStyle} />
							<div>
								<div>{balance.network.displayName}</div>
								{balance.encodedAddress &&
									<>
										<div>
											<AccountAddress
												address={balance.encodedAddress}
												network={balance.network}
												icon={false}
												shorten
												copyToClipboard="small"
											/>
										</div>
										<div css={prefixStyle}>prefix: {balance.network.prefix}</div>
									</>
								}
							</div>
						</div>
					)}
				/>
				<AccountBalancesTableAttribute
					label="Total"
					sortable
					sortProperty={SortProperties.TOTAL}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance, usdRates) => (
						<>
							{balance.balanceSupported && !balance.error && balance.balance &&
								<Currency
									amount={balance.balance.total}
									currency={balance.network.symbol}
									decimalPlaces="optimal"
									usdRate={usdRates?.[balance.network.name]}
									showFullInTooltip
									showUsdValue
									data-test={`${balance.network.name}-balance-total`}
								/>
							}
							{!balance.balanceSupported &&
								<Alert severity="warning">
									Account balance for this network is not currently supported.
								</Alert>
							}
							{balance.error &&
								<ErrorMessage
									data-test={`${balance.network.name}-balance-error`}
									message="Unexpected error occured while fetching data"
									details={balance.error}
									report
								/>
							}
						</>
					)}
					colSpan={(balance) => (!balance.balanceSupported || balance.error) ? 3 : 1}
				/>
				<AccountBalancesTableAttribute
					label="Free"
					sortable
					sortProperty={SortProperties.FREE}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance, usdRates) => balance.balance &&
						<Currency
							amount={balance.balance.free}
							currency={balance.network.symbol}
							decimalPlaces="optimal"
							usdRate={usdRates?.[balance.network.name]}
							showFullInTooltip
							showUsdValue
							data-test={`${balance.network.name}-balance-free`}
						/>
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
				<AccountBalancesTableAttribute
					label="Reserved"
					sortable
					sortProperty={SortProperties.RESERVED}
					startDirection={SortDirection.DESC}
					onSortChange={handleSortSelected}
					render={(balance, usdRates) => balance.balance &&
						<Currency
							amount={balance.balance.reserved}
							currency={balance.network.symbol}
							decimalPlaces="optimal"
							usdRate={usdRates?.[balance.network.name]}
							showFullInTooltip
							showUsdValue
							data-test={`${balance.network.name}-balance-reserved`}
						/>
					}
					hide={(balance) => !balance.balanceSupported || balance.error}
				/>
			</ItemsTable>
		</div>
	);
};
