import { PrismaClient, User } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLevelFromScore } from "@/lib/leveling-system";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShineBorder } from "@/components/ui/shine-border";
import { BorderBeam } from "@/components/ui/border-beam";
import { Medal } from "lucide-react";

const prisma: PrismaClient = new PrismaClient();

type PageProps = {
  params: { locale: string };
};

type LeaderboardUser = User & {
  level: number;
};

const getRankStyle = (rankIndex: number) => {
  if (rankIndex === 0) {
    return {
      bg: "bg-gradient-to-r from-yellow-800/50 to-neutral-900",
      border: "border-yellow-500/50",
      shine: ["#FFD700", "#FDE047"],
      shadow: "shadow-lg shadow-yellow-500/20",
    };
  }
  if (rankIndex === 1) {
    return {
      bg: "bg-gradient-to-r from-slate-700/50 to-neutral-900",
      border: "border-slate-400/50",
      shine: ["#C0C0C0", "#E5E7EB"],
      shadow: "shadow-lg shadow-slate-400/20",
    };
  }
  if (rankIndex === 2) {
    return {
      bg: "bg-gradient-to-r from-orange-800/50 to-neutral-900",
      border: "border-orange-600/50",
      shine: ["#CD7F32", "#E29A55"],
      shadow: "shadow-lg shadow-orange-700/20",
    };
  }
  if (rankIndex < 10) {
    return {
      bg: "bg-gradient-to-r from-purple-900/50 to-neutral-900",
      border: "border-purple-600/50",
      shine: ["#A000FF", "#E060FF"],
      shadow: "shadow-lg shadow-purple-600/10",
    };
  }
  if (rankIndex < 50) {
    return {
      bg: "bg-gradient-to-r from-blue-900/50 to-neutral-900",
      border: "border-blue-700/50",
      shine: null,
      shadow: "",
    };
  }
  return {
    bg: "bg-neutral-900",
    border: "border-neutral-800",
    shine: null,
    shadow: "",
  };
};

const getLevelStyle = (level: number) => {
  if (level >= 180) {
    return {
      badgeBorder: "border-fuchsia-400",
      badgeBg: "bg-neutral-900",
      beamFrom: "#FF00FF",
      beamTo: "#00FFFF",
      textShadow: "0 0 10px #FF00FF, 0 0 20px #00FFFF",
    };
  }
  if (level >= 160) {
    return {
      badgeBorder: "border-purple-400",
      badgeBg: "bg-purple-950/80",
      beamFrom: "#A000FF",
      beamTo: "#E060FF",
      textShadow: "0 0 10px #A000FF",
    };
  }
  if (level >= 140) {
    return {
      badgeBorder: "border-cyan-400",
      badgeBg: "bg-cyan-950/80",
      beamFrom: "#22D3EE",
      beamTo: "#06B6D4",
      textShadow: "0 0 10px #22D3EE",
    };
  }
  if (level >= 120) {
    return {
      badgeBorder: "border-red-400",
      badgeBg: "bg-red-950/80",
      beamFrom: "#F87171",
      beamTo: "#DC2626",
      textShadow: "0 0 10px #F87171",
    };
  }
  if (level >= 100) {
    return {
      badgeBorder: "border-pink-400",
      badgeBg: "bg-pink-950/80",
      beamFrom: "#EC4899",
      beamTo: "#F472B6",
      textShadow: "0 0 10px #EC4899",
    };
  }
  if (level >= 80) {
    return {
      badgeBorder: "border-yellow-400",
      badgeBg: "bg-yellow-950/80",
      beamFrom: "#FDE047",
      beamTo: "#FFD700",
      textShadow: "0 0 10px #FDE047",
    };
  }
  if (level >= 60) {
    return {
      badgeBorder: "border-emerald-400",
      badgeBg: "bg-emerald-950/80",
      beamFrom: "#34D399",
      beamTo: "#A7F3D0",
      textShadow: "0 0 10px #34D399",
    };
  }
  if (level >= 40) {
    return {
      badgeBorder: "border-blue-400",
      badgeBg: "bg-blue-950/80",
      beamFrom: "#3B82F6",
      beamTo: "#60A5FA",
      textShadow: "0 0 10px #3B82F6",
    };
  }
  if (level >= 20) {
    return {
      badgeBorder: "border-gray-400",
      badgeBg: "bg-gray-950/80",
      beamFrom: "#9CA3AF",
      beamTo: "#E5E7EB",
      textShadow: "0 0 10px #9CA3AF",
    };
  }
  return {
    badgeBorder: "border-orange-400",
    badgeBg: "bg-orange-950/80",
    beamFrom: "#F97316",
    beamTo: "#FB923C",
    textShadow: "0 0 10px #F97316",
  };
};

function LeaderboardCard({
  user,
  rank,
}: {
  user: LeaderboardUser;
  rank: number;
}): React.JSX.Element {
  const style = getRankStyle(rank);
  const levelStyle = getLevelStyle(user.level);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 shadow-xl",
        style.bg,
        style.border,
        style.shadow
      )}
    >
      {style.shine && (
        <ShineBorder shineColor={style.shine} className="rounded-2xl" />
      )}

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-md overflow-hidden shrink-0",
            levelStyle.badgeBorder,
            levelStyle.badgeBg
          )}
        >
          <BorderBeam
            colorFrom={levelStyle.beamFrom}
            colorTo={levelStyle.beamTo}
            duration={7}
            borderWidth={2}
            className="rounded-full"
          />
          <span
            className="relative text-white text-3xl font-extrabold"
            style={{ textShadow: levelStyle.textShadow }}
          >
            {user.level}
          </span>
        </div>

        <Avatar className="w-16 h-16 bg-neutral-800 border-2 border-neutral-700 shrink-0">
          <AvatarImage src={user.profilePicture} alt={user.name ?? ""} />
          <AvatarFallback>
            {(user.name ?? "??").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-xl font-semibold truncate text-white">
            {user.name}
          </p>
          {user.bio && (
            <p className="text-sm italic text-neutral-400 mt-1 line-clamp-1">
              {user.bio}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-white">
            {user.score.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-400">Score</div>
        </div>
      </div>
    </div>
  );
}

export default async function LeaderboardPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations("LeaderboardPage");

  const users = await prisma.user.findMany({
    orderBy: { score: "desc" },
    take: 100,
  });

  const usersWithLevel: LeaderboardUser[] = users.map((user) => ({
    ...user,
    level: getLevelFromScore(user.score),
  }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-4xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-10  bg-clip-text text-neutral-50">
        <Medal className="inline-block h-12 w-12 mr-2 text-yellow-400" />
        {t("title")}
      </h1>

      <div className="space-y-4">
        {usersWithLevel.map((user, index) => (
          <LeaderboardCard key={user.id} user={user} rank={index} />
        ))}
      </div>
    </div>
  );
}
