const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ServiceIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "websites":
      return (
        <svg {...base}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4M3 8h18" />
        </svg>
      );
    case "workflows":
      return (
        <svg {...base}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M7 6h10M6.2 7.8l4.6 8.4M17.8 7.8l-4.6 8.4" />
        </svg>
      );
    case "tracking":
      return (
        <svg {...base}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
          <circle cx="19" cy="8" r="1.2" />
        </svg>
      );
    default:
      return (
        <svg {...base}>
          <rect x="5" y="8" width="14" height="11" rx="3" />
          <path d="M12 4v4M9.5 13h.01M14.5 13h.01M9.5 16h5" />
          <path d="M2.5 12.5v2M21.5 12.5v2" />
        </svg>
      );
  }
};
