"use client";
import { type FieldValues } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../components/forms/TextInput";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AccountFormWrapper from "./AccountFormWrapper";

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAccount();
  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    try {
      await forgotPassword.mutateAsync(data.email, {
        onSuccess: () => {
          toast.success("Password reset requested - please check your email");
          router.push("/login");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AccountFormWrapper
      title="Please enter your email address"
      icon={<LockOpen fontSize="large" />}
      submitButtonText="Request password reset link"
      onSubmit={onSubmit}
    >
      <TextInput
        rules={{ required: true }}
        label="Email address"
        name="email"
      />
    </AccountFormWrapper>
  );
}
