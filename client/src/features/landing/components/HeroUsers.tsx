import { NumberTicker } from "@/shared/ui/NumberTicker";
import { Skeleton } from "@/shared/ui/skeleton";
import { memo, useState } from "react";

const StarIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="orange"
    stroke="orange"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-star h-5 w-5"
    aria-label="Star"
    role="img"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
));

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar = memo(({ src, alt }: AvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-background">
      {isLoading && <Skeleton className="absolute h-10 w-10 rounded-full" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </span>
  );
});

const avatars = [
  {
    src: "https://img.icons8.com/color/96/user-male-circle--v1.png",
    alt: "User avatar 1",
  },
  {
    src: "https://img.icons8.com/color/96/user-female-circle--v1.png",
    alt: "User avatar 2",
  },
  {
    src: "https://img.icons8.com/color/96/user-male-skin-type-5-circle--v1.png",
    alt: "User avatar 3",
  },
  {
    src: "https://img.icons8.com/color/96/user-female-skin-type-4-circle--v1.png",
    alt: "User avatar 4",
  },
];

const HeroUsers = () => (
  <div>
    <div className="mt-3 flex flex-col gap-4 lg:flex-row">
      <div className="flex justify-center -space-x-4">
        {avatars.map((avatar) => (
          <Avatar key={avatar.src} src={avatar.src} alt={avatar.alt} />
        ))}
      </div>

      <div className="flex flex-col justify-center">
        <span className="mt-1 flex justify-center gap-1 lg:justify-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          More than <NumberTicker value={50} />+ happy users
        </span>
      </div>
    </div>
  </div>
);

export default HeroUsers;
