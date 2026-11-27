export function RiverScene() {
  return (
    <svg
      viewBox="0 0 400 440"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="river-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--river-sky)" />
          <stop offset="1" stopColor="var(--river-sky-light)" />
        </linearGradient>
        <linearGradient id="river-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--river-shine)" />
          <stop offset="1" stopColor="var(--river)" />
        </linearGradient>
      </defs>

      <rect width="400" height="440" fill="url(#river-sky)" />
      <circle cx="52" cy="48" r="27" fill="var(--secondary)" className="river-sun" />
      <path d="M0 128 72 52 132 128 205 40 294 128 357 69 400 118V188H0Z" fill="var(--leaf-dark)" opacity=".72" />
      <path d="M0 155 85 95 150 158 224 84 310 159 365 112 400 143V440H0Z" fill="var(--leaf)" />
      <path d="M0 202C86 166 123 200 183 176S316 139 400 181V440H0Z" fill="var(--leaf-light)" />

      <path
        d="M285-25C305 54 199 65 207 131S346 177 293 228 113 231 129 304 260 349 186 474"
        fill="none"
        stroke="var(--river-deep)"
        strokeWidth="108"
        strokeLinecap="round"
      />
      <path
        d="M285-25C305 54 199 65 207 131S346 177 293 228 113 231 129 304 260 349 186 474"
        fill="none"
        stroke="url(#river-water)"
        strokeWidth="92"
        strokeLinecap="round"
      />
      <path
        d="M285-25C305 54 199 65 207 131S346 177 293 228 113 231 129 304 260 349 186 474"
        fill="none"
        stroke="var(--river-foam)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="15 26"
        className="river-current"
        opacity=".85"
      />

      <path d="M287 102C339 70 386 95 378 137S308 173 277 143" fill="var(--river-deep)" />
      <path d="M292 108C337 82 372 99 366 132S315 158 287 139" fill="var(--river-shine)" />
      <path d="M305 119C327 106 348 111 354 123" fill="none" stroke="var(--river-foam)" strokeWidth="4" strokeLinecap="round" />

      <ellipse cx="219" cy="314" rx="62" ry="27" fill="var(--river-sand)" opacity=".95" />
      <ellipse cx="219" cy="314" rx="43" ry="14" fill="var(--earth)" opacity=".48" />
      <circle cx="196" cy="311" r="4" fill="var(--secondary)" />
      <circle cx="219" cy="319" r="5" fill="var(--secondary)" />
      <circle cx="240" cy="308" r="4" fill="var(--secondary)" />

      <g className="canoe-bob">
        <text x="150" y="196" fontSize="48">🛶</text>
        <path d="M151 202Q174 214 199 199" fill="none" stroke="var(--river-foam)" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g fill="var(--secondary)" stroke="var(--secondary-foreground)" strokeWidth="1.5" className="mercury-drops">
        <circle r="7">
          <animateMotion dur="7s" repeatCount="indefinite" path="M329 48C310 87 211 73 207 131S333 177 293 228" />
        </circle>
        <circle r="6">
          <animateMotion dur="7s" begin="-2.4s" repeatCount="indefinite" path="M329 48C310 87 211 73 207 131S333 177 293 228" />
        </circle>
        <circle r="5">
          <animateMotion dur="7s" begin="-4.8s" repeatCount="indefinite" path="M329 48C310 87 211 73 207 131S333 177 293 228" />
        </circle>
      </g>

      <g className="river-tree">
        <path d="M49 242v42M74 224v46M349 275v46M38 371v42M325 382v38" stroke="var(--earth)" strokeWidth="9" strokeLinecap="round" />
        <g fill="var(--leaf-dark)">
          <circle cx="49" cy="232" r="25" /><circle cx="73" cy="213" r="27" />
          <circle cx="350" cy="262" r="29" /><circle cx="38" cy="359" r="27" />
          <circle cx="326" cy="369" r="27" />
        </g>
        <g fill="var(--leaf-light)">
          <circle cx="37" cy="226" r="15" /><circle cx="66" cy="202" r="15" />
          <circle cx="337" cy="251" r="16" /><circle cx="27" cy="349" r="15" />
          <circle cx="314" cy="359" r="15" />
        </g>
      </g>

      <g className="fish-swim" fill="var(--primary)" opacity=".65">
        <path d="M244 158q17-14 34 0-17 14-34 0l-13 10v-20Z" />
        <circle cx="269" cy="155" r="2" fill="var(--card)" />
        <path d="M120 348q17-14 34 0-17 14-34 0l-13 10v-20Z" />
        <circle cx="145" cy="345" r="2" fill="var(--card)" />
      </g>

      <g transform="translate(302 22)">
        <path d="M0 48 31 8 65 48Z" fill="var(--earth)" />
        <path d="M18 48V27h34v21" fill="var(--secondary-foreground)" />
        <path d="M13 28 35 12l23 16" fill="none" stroke="var(--destructive)" strokeWidth="7" strokeLinejoin="round" />
        <text x="27" y="45" fontSize="21">⛏️</text>
      </g>
    </svg>
  );
}
