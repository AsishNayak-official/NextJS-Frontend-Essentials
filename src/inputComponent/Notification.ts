import { useSnackbar, type SnackbarKey, type SnackbarMessage, SnackbarOrigin } from "notistack";

export interface NotificationProps {
    header?: string;
    action?: React.ReactElement;
    persist?: boolean;
    className?: string;
    style?: React.CSSProperties;
    anchorOrigin?: SnackbarOrigin;
    autoHideDuration?: number | null;
    variant?: 'error' | 'success' | 'warning' | 'info';
    hideIconVariant?: boolean;
    id?: SnackbarKey;
    message?: SnackbarMessage;
    iconVariant?: Record<string, React.ReactNode>;

}