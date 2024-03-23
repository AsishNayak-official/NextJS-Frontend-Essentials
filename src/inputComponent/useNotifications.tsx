"use client";
import { useSnackbar, type SnackbarKey, type SnackbarMessage } from "notistack";
import { type NotificationProps } from "./Notification";

export interface UseNotificationInstance {
    success: (
        message: SnackbarMessage,
        options?: NotificationProps
    ) => SnackbarKey;
    error: (message: SnackbarMessage, options?: NotificationProps) => SnackbarKey;
    warning: (
        message: SnackbarMessage,
        options?: NotificationProps
    ) => SnackbarKey;
    info: (message: SnackbarMessage, options?: NotificationProps) => SnackbarKey;
}

const useNotification = (): UseNotificationInstance => {
    const { enqueueSnackbar } = useSnackbar();

    const success = (
        message: SnackbarMessage,
        options?: NotificationProps
    ): number | string => {
        const id = enqueueSnackbar(message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 1500,
            ...options,
            variant: "success",
        });
        return id;
    };

    const error = (
        message: SnackbarMessage,
        options?: NotificationProps
    ): number | string => {
        const id = enqueueSnackbar(message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 1500,
            ...options,
            variant: "error",
        });
        return id;
    };

    const warning = (
        message: SnackbarMessage,
        options?: NotificationProps
    ): number | string => {
        const id = enqueueSnackbar(message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 1500,
            ...options,
            variant: "warning",
        });
        return id;
    };

    const info = (
        message: SnackbarMessage,
        options?: NotificationProps
    ): number | string => {
        const id = enqueueSnackbar(message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 1500,
            ...options,
            variant: "info",
        });
        return id;
    };

    return {
        info,
        error,
        warning,
        success,
    };
};

export default useNotification;
