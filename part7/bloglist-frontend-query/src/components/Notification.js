import { useNotificationValue } from "../NotificationContext";
import { Alert } from "@mui/material";

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification) return;
  const type = notification.type === "error" ? "error" : "success";

  return <Alert severity={type}>{notification.message}</Alert>;
};

export default Notification;
