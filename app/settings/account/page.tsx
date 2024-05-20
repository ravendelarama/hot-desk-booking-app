import AccountSettings from "../_components/account-form";
import AvatarModal from "../_components/avatar-modal";
import ChangePassModal from "../_components/change-pass";

export default async function AccountSettingsPage() {
  return (
    <>
      <h2>Account Settings</h2>
      <AvatarModal />
      <AccountSettings />
      <ChangePassModal />
    </>
  );
}
