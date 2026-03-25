interface StoreLogoProps {
  storeName: string;
  size?: number;
}

function getStoreColor(name: string): string {
  switch (name.toLowerCase()) {
    case 'kaufland':
      return '#E30613'; // Kaufland red
    case 'lidl':
      return '#0050AA'; // Lidl blue
    case 'mega image':
    case 'megaimage':
      return '#E2001A'; // Mega Image red
    case 'carrefour':
      return '#0066CC'; // Carrefour blue
    case 'auchan':
      return '#E30613'; // Auchan red
    case 'penny':
      return '#E2001A'; // Penny red
    case 'profi':
      return '#00A651'; // Profi green
    default:
      // Simple hash to color for unknown stores
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
      return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}

function getStoreInitials(name: string): string {
  const words = name.split(' ').filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return name.substring(0, 1).toUpperCase() || '?';
}

export function StoreLogo({ storeName, size = 40 }: StoreLogoProps) {
  const backgroundColor = getStoreColor(storeName);
  const initials = getStoreInitials(storeName);

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full shadow-sm"
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}
    >
      <span
        className="font-bold text-white"
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </span>
    </div>
  );
}
