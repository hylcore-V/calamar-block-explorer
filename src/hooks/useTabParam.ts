import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export type UseTabParamOptions = {
	paramName?: string;
	preserveQueryParams?: string[];
}

export function useTabParam(options: UseTabParamOptions = {}) {
	const [qs] = useSearchParams();
	const params = useParams();

	const navigate = useNavigate();

	const currentTab = params[options.paramName || "tab"];

	const setTab = useCallback((newTab: string) => {
		const path = currentTab ? `./../${newTab}` : newTab;
		const newQs = new URLSearchParams();

		for (const param of options.preserveQueryParams || []) {
			for (const values of qs.getAll(param)) {
				newQs.append(param, values);
			}
		}

		navigate({
			pathname: path,
			search: newQs.toString()
		}, {replace: !currentTab});
	}, [currentTab, navigate]);

	return [currentTab, setTab] as const;
}
