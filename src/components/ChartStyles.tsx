import { css, Theme } from "@emotion/react";

export const switchStyle = (theme: Theme) => css`
	position: absolute;
	top: 48px;
	right: 48px;
	margin: 4px 0;

	.MuiToggleButton-root {
		padding: 0 10px;
		font-size: 14px;
	}

	${theme.breakpoints.down("md")} {
		top: 24px;
		right: 24px;
	}

	${theme.breakpoints.down("sm")} {
		position: relative;
		top: -28px;
		right: auto;
		display: flex;
		justify-content: center;
	}
`;

export const valuesStyle = (theme: Theme) => css`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	justify-content: space-around;

	${theme.breakpoints.down("sm")} {
		display: block;
	}
`;

export const valueStyle = (theme: Theme) => css`
	min-width: 70px;

	${theme.breakpoints.down("sm")} {
		display: flex;
		max-width: 230px;
		margin: 0 auto;
	}
`;

export const valueTypeStyle = (theme: Theme) => css`
	margin-bottom: 8px;
	font-weight: 700;

	${theme.breakpoints.down("sm")} {
		flex: 1 1 auto;
	}
`;

export const separatorStyle = css`
	display: block;
	width: 1px;
	flex: 0 0 auto;
	background-color: rgba(0, 0, 0, .125);
`;

export const chartStyle = css`
	margin: 0 auto;
	margin-top: 32px;
`;

export const notFoundStyle = css`
	margin: 0 auto;
	max-width: 300px;
`;
