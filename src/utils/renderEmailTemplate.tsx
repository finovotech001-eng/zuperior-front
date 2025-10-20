import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/WelcomeEmail";

export function renderWelcomeEmail() {
  return render(<WelcomeEmail />);
}