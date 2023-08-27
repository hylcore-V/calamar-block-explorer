/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { isEthereumAddress } from "@polkadot/util-crypto";

import { Account } from "../../model/account";
import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { encodeAddress } from "../../utils/formatAddress";

import {InfoTable, InfoTableAttribute } from "../InfoTable";

export type AccountInfoTableProps = HTMLAttributes<HTMLDivElement> & {
	network: Network;
	account: Resource<Account>;
}

const AccountInfoTableAttribute = InfoTableAttribute<Account>;

export const AccountInfoTable = (props: AccountInfoTableProps) => {
	const {network, account, ...tableProps} = props;

	return (
		<InfoTable
			data={account.data}
			loading={account.loading}
			notFound={account.notFound}
			notFoundMessage="Account doesn't exist"
			error={account.error}
			{...tableProps}
		>
			<AccountInfoTableAttribute
				label={`${network.displayName} address`}
				render={(data) => encodeAddress(data.address, network.prefix)}
				copyToClipboard={(data) => encodeAddress(data.address, network.prefix)}
				hide={(data) => isEthereumAddress(data.address)}
			/>
			<AccountInfoTableAttribute
				label="Substrate address"
				render={(data) => encodeAddress(data.address, 42)}
				copyToClipboard={(data) => encodeAddress(data.address, 42)}
				hide={(data) => isEthereumAddress(data.address)}
			/>
			<AccountInfoTableAttribute
				label={(data) => isEthereumAddress(data.address) ? "Address" : "Public key"}
				render={(data) => data.address}
				copyToClipboard={(data) => data.address}
			/>
		</InfoTable>
	);
};
