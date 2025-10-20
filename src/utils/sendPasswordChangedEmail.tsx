import { render } from "@react-email/render";
import PasswordChange from "@/emails/PasswordChanged";

export function renderPasswordChangedEmail() {
    return render(<PasswordChange />);
}