import React, { useState } from "react";

export default function CampoAutenticacao({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  obrigatorio = false,
  erro = "",
}) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const ehSenha = type === "password";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-[#10281E]"
      >
        {label} {obrigatorio && <span className="span">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={ehSenha && senhaVisivel ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`w-full rounded-xl border bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50 ${
            ehSenha ? "pr-11" : ""
          } ${erro ? "border-red-200" : "border-[#E4DFD2]"}`}
        />

        {/* Mostrar ou ocultar a senha */}
        {ehSenha && (
          <button
            type="button"
            onClick={() => setSenhaVisivel((visivel) => !visivel)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-[#8A8D80] transition hover:text-[#10281E]"
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
              />
              <circle cx="12" cy="12" r="3" />
              {senhaVisivel && (
                <path strokeLinecap="round" d="M4 4l16 16" />
              )}
            </svg>
          </button>
        )}
      </div>

      {erro && (
        <p
          id={`${id}-erro`}
          className="mt-1.5 text-[11px] font-medium text-red-700"
        >
          {erro}
        </p>
      )}
    </div>
  );
}
