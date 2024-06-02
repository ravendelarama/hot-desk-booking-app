import { getCurrentUser } from "@/actions/user";
import ReminderNotification from "../_components/reminder-switch";

export default async function NotificationSettingsPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="mt-16 space-y-6">
      <h2>Notification Settings</h2>
      {/* @ts-ignore */}
      <ReminderNotification user={currentUser!} />
    </div>
  );
}
