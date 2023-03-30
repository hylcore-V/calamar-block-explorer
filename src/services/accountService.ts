import { isAddress } from "@polkadot/util-crypto";

import { Account } from "../model/account";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { DataError } from "../utils/error";

import { decodeAddress } from "../utils/formatAddress";

export async function getAccount(network: string, address: string): Promise<Account|undefined> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	// if the address is encoded, decode it
	const decodedAddress = decodeAddress(address);

	if (decodedAddress) {
		address = decodedAddress;
	}

	const data = {
		id: address,
		address,
	};

	const account = await addRuntimeSpec(network, data, () => "latest");

	return account;
}
