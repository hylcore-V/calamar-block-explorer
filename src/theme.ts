import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { css } from "@emotion/react";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#ff646d",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#14a1c0",
			contrastText: "#ffffff"
		}
	},
	typography: {
		fontFamily: "\"Open Sans\", sans-serif",
		button: {
			fontSize: 18,
			fontWeight: 700,
			textTransform: "none"
		}
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true
			},
			styleOverrides: {
				root: css`
					padding: 6px 32px;
				`
			}
		},
		MuiInputBase: {
			styleOverrides: {
				root: css`
					font-size: 18px;
				`,
				input: css`
					height: 24px;
					padding: 12px 16px;

					color: black;

					&::placeholder {
						color: #999999;
						opacity: 1;
					}
				`
			}
		},
		MuiSelect: {
			styleOverrides: {
				select: css`
					height: 24px;
					min-height: 24px;

					padding: 12px 24px;

					&& {
						padding-right: 40px;
					}
				`
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: css`
					border-radius: 8px;

					&:hover {
						.MuiOutlinedInput-notchedOutline {
							border-color: ${grey[400]};
						}
					}

					&.Mui-focused {
						.MuiOutlinedInput-notchedOutline {
							border-width: 1px;
							border-color: ${grey[600]};
						}
					}
				`,
				input: css`
					border-radius: inherit;
					background-color: ${grey[100]};
					height: 24px;
					padding: 12px 16px;

					&:focus {
						border-radius: inherit;
					}
				`,
				notchedOutline: css`
					border-color: ${grey[300]};
				`,
			}
		},
	}
});
