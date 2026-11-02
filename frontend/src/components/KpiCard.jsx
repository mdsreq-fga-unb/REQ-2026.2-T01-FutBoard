import React from "react";

export default function KpiCard({
  label,
  value,
  subtitle,
  badgeText,
  badgeVariant = "lime",
  secondaryMeta,
  onClick,
  active = false,
}) {
  const badgeClasses =
    badgeVariant === "lime"
      ? "bg-[#C6E96B] text-[#10281E]"
      : badgeVariant === "dark"
        ? "bg-[#0E3A29] text-[#FFFFFF]"
        : "bg-[#E4DFD2]/70 text-[#10281E]";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`fb-card relative flex min-h-[118px] flex-col justify-between p-5 ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "ring-2 ring-[#0E3A29] border-[#0E3A29]"
          : "border-[#E4DFD2] bg-[#FFFFFF]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#8A8D80]">
          {label}
        </span>

        {badgeText && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${badgeClasses}`}
          >
            {badgeVariant === "lime" && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E3A29]" />
            )}
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E]">
            {value}
          </span>
          {subtitle && (
            <span className="text-xs font-medium text-[#8A8D80]">{subtitle}</span>
          )}
        </div>

        {secondaryMeta && (
          <span className="font-mono text-[11px] font-medium text-[#0E3A29]">
            {secondaryMeta}
          </span>
        )}
      </div>
    </div>
  );
}
