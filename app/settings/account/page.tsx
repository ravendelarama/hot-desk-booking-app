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
import MFASwitch from "../_components/mfa-switch";
import { getCurrentUser } from "@/actions/user";

export default async function AccountSettingsPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="mt-16 space-y-6 w-fit">
      <h2>Account Settings</h2>
      <AvatarModal />
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* @ts-ignore */}
          <AccountSettings user={currentUser!} />
          <ChangePassModal />
          {/* @ts-ignore */}
          <MFASwitch user={currentUser!} />
        </CardContent>
      </Card>
    </div>
  );
}
