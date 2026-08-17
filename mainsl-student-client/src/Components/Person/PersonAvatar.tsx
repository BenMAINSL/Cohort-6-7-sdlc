import type { IPerson } from "../../Models/IPerson";
import { resolveImageUrl } from "../../utils/image";

interface Props {
  person: Pick<IPerson, "firstName" | "lastName" | "imageUrl">;
  className: string;
  previewUrl?: string | null;
}

export default function PersonAvatar({ person, className, previewUrl }: Props) {
  const src = previewUrl ?? resolveImageUrl(person.imageUrl);

  const initials =
    `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className={className}>
      {src ? (
        <img
          className="avatar-img"
          src={src}
          alt={`${person.firstName} ${person.lastName}`}
          loading="lazy"
        />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
