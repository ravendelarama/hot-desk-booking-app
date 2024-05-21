import ReminderNotification from "../_components/reminder-switch";

export default async function NotificationSettingsPage() {
  return (
    <div className="mt-16 space-y-6">
      <h2>Notification Settings</h2>
      <ReminderNotification />
    </div>
  );
}
