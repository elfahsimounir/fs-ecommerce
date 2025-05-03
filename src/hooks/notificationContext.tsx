"use client"
import Confirm from "@/components/Table/confirm";
import { CircleCheckBig, icons } from "lucide-react";
import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { toast } from "sonner";


type NotificationType = "info" | "success" | "error";

interface Notification {
    message: string;
    type: NotificationType;
}

interface Confirmation {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

interface NotificationContextType {
    showNotification: (message: string, type?: NotificationType, duration?: number) => void;
    showConfirmation: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
    
// Show notification
const showNotification = useCallback(
    (message: string, type: NotificationType = "info", duration: number = 3000) => {
        // Use the appropriate toast method based on the type
        switch (type) {
            case "success":
                toast.success(message, { duration });
                break;
            case "error":
                toast.error(message, { duration });
                break;
            case "info":
            default:
                toast.info(message, { duration });
                break;
        }
    },
    []
);

    // Show confirmation
    const showConfirmation = useCallback(
        (message: string, onConfirm: () => void, onCancel?: () => void) => {
            setConfirmation({ message, onConfirm, onCancel: onCancel || (() => {}) });
        },
        []
    );

    // Handle confirm actions
    const handleConfirm = () => {
        confirmation?.onConfirm();
        setConfirmation(null);  
    };

    // Handle cancel actions
    const handleCancel = () => {
        confirmation?.onCancel();
        setConfirmation(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirmation }}>
            {children}
            {/* Notification Component */}
            {/* {notification && 
            toast({title:notification.message,type:notification.type})
            } */}
            {/* Confirmation Alert Component */}
            {confirmation && (  
              <Confirm
              message={confirmation.message}
              handleConfirm={handleConfirm}
              handleCancel={handleCancel}
              />          
            )}
        </NotificationContext.Provider>
    );
};

// Custom hook to use the context
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
