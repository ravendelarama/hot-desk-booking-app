import AccountSettings from "../_components/account-form";
import AvatarModal from "../_components/avatar-modal";
import ChangePassModal from "../_components/change-pass";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AccountSettingsPage() {
  return (
    <div className="mt-16 space-y-6 w-fit">
      <h2>Account Settings</h2>
      <AvatarModal />
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AccountSettings />
          <ChangePassModal />
        </CardContent>
      </Card>
    </div>
  );
}
