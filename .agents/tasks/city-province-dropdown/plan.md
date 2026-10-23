# Implementation Plan: Province-dependent City dropdown

Replace the free-text "City / Town" input with a `<select>` dropdown that populates
from a hardcoded `SA_CITIES` lookup based on the selected province, in both the
signup form (two copies in `auth/page.tsx`) and the profile edit drawer
(`profile/page.tsx`). No API, no new packages.

## Context discovered during exploration

- Path alias `@/*` maps to `./src/*` (`tsconfig.json`). Existing shared modules
  live in `src/lib/` and are imported with named exports, e.g.
  `import { auth, db } from "@/lib/firebase"` and `import { useProfile } from "@/lib/ProfileContext"`.
  So a new shared module follows the same convention.
- Build command: `npm run build` (`next build`), which runs TypeScript type
  checking plus Next's lint. This is the verification gate.
- `ProfileData` type (in `src/lib/ProfileContext.tsx`) already has `province` and
  `city` string fields, so no type changes are needed.

### Naming policy decision (recorded, used verbatim by the coder)
The original user request says people "struggle to spell out their cities names",
so the dropdown's whole purpose is recognisability. Names below use the
everyday, locally-recognised spelling (which remains a correctly-spelled, valid
name), favouring what residents say over a few recent official renames. This is
intentional so rural youth find their own town. Do not "correct" them to newer
official names during implementation.

- [ ] 1. Create the shared SA_CITIES lookup module `src/lib/sa-cities.ts`.
      Export a single named constant `SA_CITIES: Record<string, string[]>` mapping
      each of the 9 provinces to 15-20 cities/towns. Follow the `export const`
      style used by `src/lib/firebase.ts`. Keys MUST exactly match the strings in
      the existing `SA_PROVINCES` arrays: "Eastern Cape", "Free State",
      "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West",
      "Northern Cape", "Western Cape". Use the object below verbatim.
      Files: src/lib/sa-cities.ts (create)
      Verify: `npx tsc --noEmit` passes with no errors; the file compiles.
      Note: leave the existing local `SA_PROVINCES` arrays in both pages in place
      (do not refactor them into this module) to keep the change focused.

      ```ts
      export const SA_CITIES: Record<string, string[]> = {
        "Eastern Cape": [
          "Port Elizabeth", "East London", "Mdantsane", "Duncan Village",
          "Uitenhage", "Mthatha", "Grahamstown", "Queenstown",
          "King William's Town", "KwaNobuhle", "Bhisho", "Butterworth",
          "Fort Beaufort", "Cradock", "Graaff-Reinet", "Port Alfred",
          "Stutterheim", "Aliwal North", "Lusikisiki", "Port St Johns",
        ],
        "Free State": [
          "Bloemfontein", "Botshabelo", "Thaba Nchu", "Mangaung", "Welkom",
          "Sasolburg", "Kroonstad", "Bethlehem", "Ladybrand", "Ficksburg",
          "Phuthaditjhaba", "Qwaqwa", "Senekal", "Virginia", "Theunissen",
          "Frankfort", "Parys", "Bothaville", "Winburg", "Heilbron",
        ],
        "Gauteng": [
          "Johannesburg", "Pretoria", "Soweto", "Ekurhuleni", "Sandton",
          "Randburg", "Centurion", "Midrand", "Roodepoort", "Germiston",
          "Benoni", "Boksburg", "Krugersdorp", "Vanderbijlpark",
          "Vereeniging", "Tembisa", "Mamelodi", "Soshanguve", "Ga-Rankuwa",
          "Bronkhorstspruit",
        ],
        "KwaZulu-Natal": [
          "Durban", "Pietermaritzburg", "Newcastle", "Richards Bay",
          "Empangeni", "Ladysmith", "Dundee", "Vryheid", "Port Shepstone",
          "Margate", "Pinetown", "Chatsworth", "KwaMashu", "Umlazi",
          "Inanda", "Estcourt", "Howick", "Kokstad", "Matatiele", "Stanger",
        ],
        "Limpopo": [
          "Polokwane", "Seshego", "Mankweng", "Tzaneen", "Thohoyandou",
          "Musina", "Phalaborwa", "Lephalale", "Louis Trichardt", "Mokopane",
          "Burgersfort", "Lebowakgomo", "Giyani", "Malamulele", "Thabazimbi",
          "Modimolle", "Bela-Bela", "Hoedspruit", "Namakgale", "Duiwelskloof",
        ],
        "Mpumalanga": [
          "Nelspruit", "Witbank", "KwaGuqa", "Middelburg", "Secunda",
          "Ermelo", "Standerton", "Lydenburg", "Piet Retief", "Barberton",
          "Malelane", "KwaMhlanga", "Siyabuswa", "Volksrust", "Balfour",
          "Carolina", "Sabie", "Bushbuckridge", "Hazyview", "Komatipoort",
        ],
        "North West": [
          "Mahikeng", "Mmabatho", "Rustenburg", "Klerksdorp", "Potchefstroom",
          "Brits", "Phokeng", "Mogwase", "Zeerust", "Lichtenburg",
          "Vryburg", "Wolmaransstad", "Schweizer-Reneke", "Taung",
          "Lehurutshe", "Ganyesa", "Coligny", "Delareyville", "Ottosdal",
          "Marikana",
        ],
        "Northern Cape": [
          "Kimberley", "Galeshewe", "Upington", "Kuruman", "Springbok",
          "De Aar", "Colesberg", "Kathu", "Postmasburg", "Prieska",
          "Calvinia", "Carnarvon", "Sutherland", "Loxton", "Noupoort",
          "Hopetown", "Douglas", "Barkly West", "Warrenton", "Kakamas",
        ],
        "Western Cape": [
          "Cape Town", "Khayelitsha", "Mitchell's Plain", "Atlantis",
          "Stellenbosch", "Paarl", "Worcester", "George", "Mossel Bay",
          "Oudtshoorn", "Knysna", "Plettenberg Bay", "Beaufort West",
          "Malmesbury", "Ceres", "Swellendam", "Robertson", "Saldanha",
          "Vredendal", "Hermanus",
        ],
      };
      ```

- [ ] 2. Wire the import in `src/app/auth/page.tsx`.
      Add `import { SA_CITIES } from "@/lib/sa-cities";` grouped with the other
      `@/lib/*` imports (right after `import { auth, db } from "@/lib/firebase";`).
      Do not remove the local `SA_PROVINCES` array.
      Files: src/app/auth/page.tsx (edit imports only)
      Verify: `npx tsc --noEmit` passes (no "cannot find module" error).

- [ ] 3. Replace the City input with a Province-driven select in the MOBILE
      signup form of `src/app/auth/page.tsx`.
      The mobile signup form lives in the `{mode === "signup" && (...)}` block
      inside the "MOBILE LAYOUT" container (`<div className="flex flex-col
      md:hidden ...">`). Find the Province + City row, a
      `<div className="grid grid-cols-2 gap-3">` block that contains the
      province `<select>` followed by a city text input with
      `placeholder="City / Town"`. There are two identical such blocks in the
      file; this step edits the FIRST occurrence (mobile).

      State: signup fields are individual `useState` hooks, specifically
      `const [province, setProvince] = useState("");` and
      `const [city, setCity] = useState("");` (declared in `AuthPageInner`).
      The province select's onChange is currently
      `onChange={(e) => setProvince(e.target.value)}`.

      Changes:
      a) Province select onChange becomes:
         `onChange={(e) => { setProvince(e.target.value); setCity(""); }}`
         so the city resets to "" whenever province changes.
      b) Replace the city `<input type="text" placeholder="City / Town" ...>`
         block with a `<select>` that matches the existing province select's
         markup/style (left `MapPin` + right `ChevronDown`, both
         `pointer-events-none`; class `input pl-11 pr-10 appearance-none
         text-gray-700`; the same disabled styling pattern used by the gender
         select: `bg-gray-50 text-gray-500 cursor-not-allowed`). It must be
         `disabled={!province}` and show placeholder text "Select province
         first" when no province is chosen, else "City / Town". Cities come
         from `(SA_CITIES[province] || []).slice().sort()`.

      Exact replacement for the city cell (replace the whole
      `<div className="relative"> ... </div>` that wraps the city input):

      ```jsx
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!province}
          className={`input pl-11 pr-10 appearance-none text-gray-700 ${!province ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
        >
          <option value="">{province ? "City / Town" : "Select province first"}</option>
          {(SA_CITIES[province] || []).slice().sort().map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      ```

      Files: src/app/auth/page.tsx (first occurrence, mobile signup form)
      Verify: `npm run build` passes with zero TypeScript errors.

- [ ] 4. Replace the City input with a Province-driven select in the DESKTOP
      signup form of `src/app/auth/page.tsx`.
      The desktop signup form is in the "SIGNUP PANEL" section of the "DESKTOP
      LAYOUT" container (`<div className="hidden md:flex h-screen ...">`). The
      Province + City row there is byte-identical to the mobile one (same
      `<div className="grid grid-cols-2 gap-3">` block, same province select and
      same city text input). This step edits the SECOND occurrence.

      Apply the exact same two edits as step 3:
      a) Province select onChange becomes
         `onChange={(e) => { setProvince(e.target.value); setCity(""); }}`.
      b) Replace the city input cell with the same `<select>` block from step 3
         (identical JSX; it uses the same `province`/`city`/`setCity` state and
         the same `SA_CITIES` import).

      Files: src/app/auth/page.tsx (second occurrence, desktop signup form)
      Verify: `npm run build` passes with zero TypeScript errors.

- [ ] 5. Wire the import in `src/app/(app)/profile/page.tsx`.
      Add `import { SA_CITIES } from "@/lib/sa-cities";` grouped with the other
      `@/lib/*` imports (right after the `@/lib/ProfileContext` import or after
      the `firebase/firestore` import). Do not remove the local `SA_PROVINCES`
      array.
      Files: src/app/(app)/profile/page.tsx (edit imports only)
      Verify: `npx tsc --noEmit` passes (no "cannot find module" error).

- [ ] 6. Replace the City input with a Province-driven select in the profile
      edit drawer of `src/app/(app)/profile/page.tsx`.
      The edit drawer is the `<AnimatePresence>` block keyed `editOpen`, opening
      a right-side `motion.div` ("Edit Profile"). Its `<form onSubmit=
      {handleSave}>` contains a Province + City row:
      `<div className="grid grid-cols-2 gap-3">` with a province `<select>`
      (bound to `draft.province`) followed by a city text input bound to
      `draft.city`.

      Draft management: `const [draft, setDraft] = useState<ProfileData>(...)`
      and a helper `function field(key, value) { setDraft((prev) => ({ ...prev,
      [key]: value })); }`. The province select onChange is currently
      `onChange={(e) => field("province", e.target.value)}` and the city input
      is `onChange={(e) => field("city", e.target.value)}`.

      Changes:
      a) Province select onChange becomes (sets province and resets city in one
         update; do not use the `field` helper here because two keys change):
         `onChange={(e) => setDraft((prev) => ({ ...prev, province: e.target.value, city: "" }))}`
      b) Replace the city input cell with a `<select>` matching the drawer's
         existing province select style (class `input pl-11 pr-10
         appearance-none`; note the drawer's province select does NOT add
         `text-gray-700`, so match it without that class; add the same disabled
         styling `bg-gray-50 text-gray-500 cursor-not-allowed` when no
         province). Keep the drawer's compact one-line `<div className="relative">`
         formatting style. It must be `disabled={!draft.province}` and show
         "Select province first" when no province, else "City / Town". Cities
         come from `(SA_CITIES[draft.province] || []).slice().sort()`.

      Exact replacement for the city cell (replace the
      `<div className="relative"><MapPin ... /> ... </div>` wrapping the city
      input):

      ```jsx
      <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={draft.city} onChange={(e) => field("city", e.target.value)} disabled={!draft.province}
                      className={`input pl-11 pr-10 appearance-none ${!draft.province ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}>
                      <option value="">{draft.province ? "City / Town" : "Select province first"}</option>
                      {(SA_CITIES[draft.province] || []).slice().sort().map((c) => <option key={c} value={c}>{c}</option>)}
                    </select></div>
      ```

      Files: src/app/(app)/profile/page.tsx (edit drawer)
      Verify: `npm run build` passes with zero TypeScript errors.

- [ ] 7. Final full-project verification.
      Run `npm run build` from `c:/Users/Josh/Documents/GITHUB/FuturePath` and
      confirm zero TypeScript errors and a successful build. Manually sanity
      check the behaviour in a dev run (`npm run dev`) only if build is clean:
      province change resets city to blank, the city dropdown is disabled with
      "Select province first" until a province is chosen, and once a province is
      chosen the city list is populated and alphabetically sorted. Stop the dev
      server before finishing.
      Files: none
      Verify: `npm run build` exits 0 with no type errors.

## Notes for the implementer

- `MapPin` and `ChevronDown` are already imported in both files; no new icon
  imports are needed.
- Do not introduce emojis, em dashes, icon background containers, or new npm
  packages.
- `.slice().sort()` on the city array is important: `sort()` mutates, so slice
  first to avoid mutating the shared `SA_CITIES` arrays across renders.
- Keep `SA_PROVINCES` local in both pages; only `SA_CITIES` is shared.
- When editing the two identical signup blocks in `auth/page.tsx`, edit each
  occurrence separately (they are distinct JSX trees for mobile vs desktop).
