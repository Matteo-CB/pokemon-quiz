"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HeroButtons() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("HeroButtons");

  const handleDashboardClick = () => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="py-20 flex gap-3 md:gap-5 relative">
      <Button
        onClick={handleDashboardClick}
        variant="outline"
        className="bg-neutral-900 hover:text-neutral-50 hover:bg-neutral-950 cursor-pointer border-neutral-800 text-lg"
      >
        {t("dashboard")}
      </Button>

      <Link href={"/quiz"}>
        <Button
          variant="outline"
          className="bg-neutral-900 hover:text-neutral-50 hover:bg-neutral-950 border-neutral-800 text-lg cursor-pointer"
        >
          {t("quiz")}
        </Button>
      </Link>
    </div>
  );
}
