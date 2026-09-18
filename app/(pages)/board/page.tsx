// app/(pages)/board/page.tsx

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  getAllServiceRequests,
  getBoardMemberById,
} from '@/lib/airtable'

import { Plus, MessageSquare, Users, Home, FileText, CheckCircle2, Clock3, HeartHandshake } from 'lucide-react'
import { Caveat } from 'next/font/google'

import BoardDashboard from './BoardDashboard'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export const metadata = {
  title: 'Board Dashboard | Grand Mission HOA',
}

const MONUMENT_IMAGE = '/images/GHM-Hero.webp'

const MOBILE_MONUMENT_IMAGE = '/images/monumentForMobile.jpeg'

const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'] })

function greeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'

  return 'Good evening'
}

export default async function BoardDashboardPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value

  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)

  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()
  const firstName = boardMember.name.split(' ')[0]

  const boardMemberAny = boardMember as any
  const roleLabel = boardMemberAny.role || 'Community Manager'
  const photoUrl = boardMemberAny.photoUrl as string | undefined

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  function inCurrentWeek(dateStr: string | undefined): boolean {
    if (!dateStr) return false
    const d = new Date(dateStr)
    return d >= startOfWeek && d <= now
  }

  function statusOf(request: any): string {
    return String(
      request.status ??
      request.Status ??
      request.requestStatus ??
      request['Request Status'] ??
      ''
    ).toLowerCase()
  }

  const submittedThisWeek = requests.filter((r: any) => inCurrentWeek(r.submitted_date))
  const forwardedCount = submittedThisWeek.length

  const resolvedCount = requests.filter((r: any) => {
    if (!inCurrentWeek(r.closed_date)) return false
    const status = statusOf(r)
    return (
      status.includes('resolved') ||
      status.includes('complete') ||
      status.includes('closed')
    )
  }).length

  const inProgressCount = submittedThisWeek.filter((r: any) => {
    const status = statusOf(r)
    return (
      status.includes('progress') ||
      status.includes('pending') ||
      status.includes('open') ||
      status.includes('assigned')
    )
  }).length

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">

      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">

        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">

          {/* =========================================================
              COMMUNITY HERO / GREETING CARD
              ========================================================= */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[16px]
              mb-6
              min-h-[200px]
              sm:min-h-[208px]
              lg:min-h-[212px]
              shadow-[0_20px_55px_rgba(37,99,235,0.18)]
              border border-white/20
              isolate
            "
          >

            {/* =====================================================
                DESKTOP MONUMENT IMAGE
                ===================================================== */}

            <div
              className="
                hidden
                lg:block
                absolute
                inset-y-0
                right-0
                w-[50%]
                z-0
                pointer-events-none
              "
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.10) 10%, rgba(0,0,0,0.32) 22%, rgba(0,0,0,0.68) 38%, rgba(0,0,0,0.92) 52%, black 68%, black 100%)',
                maskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.10) 10%, rgba(0,0,0,0.32) 22%, rgba(0,0,0,0.68) 38%, rgba(0,0,0,0.92) 52%, black 68%, black 100%)',
              }}
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-cover
                  bg-center
                  bg-no-repeat
                "
                style={{
                  backgroundImage: `url("${MONUMENT_IMAGE}")`,
                  backgroundPosition: '95% center',
                }}
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-blue-600/5
                  via-transparent
                  to-blue-950/15
                "
              />
            </div>



            {/* =====================================================
                MOBILE / TABLET MONUMENT IMAGE
                ===================================================== */}

            <div
              className="
                lg:hidden
                absolute
                inset-0
                z-0
                pointer-events-none
              "
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.94) 45%, black 58%, black 100%)',
                maskImage:
                  'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.94) 45%, black 58%, black 100%)',
              }}
            >

              <div
                className="
                  absolute
                  inset-0
                  bg-cover
                  bg-no-repeat
                "
                style={{
                  backgroundImage: `url("${MOBILE_MONUMENT_IMAGE}")`,
                  backgroundPosition: '35% center',
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(20,93,204,0.58) 0%,
                      rgba(23,105,220,0.38) 26%,
                      rgba(23,105,220,0.18) 48%,
                      rgba(23,105,220,0.06) 68%,
                      rgba(23,105,220,0) 85%
                    )
                  `,
                }}
              />
            </div>



            {/* =====================================================
                DESKTOP BLUE → MONUMENT TRANSITION
                ===================================================== */}

            <div
              className="
                hidden
                lg:block
                absolute
                inset-y-0
                left-[42%]
                right-[34%]
                z-[1]
                pointer-events-none
                opacity-80
              "
              style={{
                background: `
                  linear-gradient(
                    110deg,
                    rgba(23,105,220,0.00) 0%,
                    rgba(23,105,220,0.05) 18%,
                    rgba(23,105,220,0.10) 36%,
                    rgba(23,105,220,0.04) 58%,
                    rgba(23,105,220,0.00) 100%
                  )
                `,
              }}
            />



            {/* =====================================================
                DESKTOP SOFT DIAGONAL LIGHT RAY
                ===================================================== */}

            <div
              className="
                hidden
                lg:block
                absolute
                left-[43%]
                top-[-35%]
                w-[30%]
                h-[170%]
                z-[2]
                pointer-events-none
                opacity-35
                blur-[3px]
              "
              style={{
                background: `
                  linear-gradient(
                    108deg,
                    rgba(255,255,255,0.00) 0%,
                    rgba(255,255,255,0.13) 30%,
                    rgba(255,255,255,0.055) 52%,
                    rgba(255,255,255,0.00) 78%
                  )
                `,
                clipPath:
                  'polygon(0 25%, 100% 0, 100% 100%, 0 75%)',
              }}
            />



            {/* =====================================================
                DESKTOP SECOND SUBTLE RAY
                ===================================================== */}

            <div
              className="
                hidden
                lg:block
                absolute
                left-[48%]
                top-[-25%]
                w-[20%]
                h-[150%]
                z-[2]
                pointer-events-none
                opacity-25
                blur-[4px]
              "
              style={{
                background: `
                  linear-gradient(
                    110deg,
                    rgba(255,255,255,0.00) 0%,
                    rgba(255,255,255,0.10) 35%,
                    rgba(255,255,255,0.025) 60%,
                    transparent 80%
                  )
                `,
                clipPath:
                  'polygon(0 38%, 100% 10%, 100% 90%, 0 62%)',
              }}
            />



            {/* =====================================================
                MAIN BLUE BACKGROUND
                ===================================================== */}

            <div
              className="
                hidden
                lg:block
                absolute
                inset-0
                z-[-1]
                bg-gradient-to-br
                from-[#145dcc]
                via-[#1769dc]
                to-[#287de5]
              "
            />



            {/* =====================================================
                MAIN BLUE BACKGROUND — MOBILE
                ===================================================== */}

            <div
              className="
                lg:hidden
                absolute
                inset-0
                z-[-1]
                bg-gradient-to-br
                from-[#145dcc]
                via-[#1769dc]
                to-[#287de5]
              "
            />



            {/* =====================================================
                SOFT LIGHT / GRADIENT EFFECTS
                ===================================================== */}

            <div
              className="
                absolute
                -top-24
                left-[28%]
                w-[400px]
                h-[400px]
                rounded-full
                bg-cyan-300/10
                blur-3xl
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-32
                left-[8%]
                w-[500px]
                h-[280px]
                rounded-full
                bg-blue-300/15
                blur-3xl
                pointer-events-none
              "
            />



            {/* =====================================================
                ABSTRACT BLUE WAVES
                ===================================================== */}

            <svg
              className="
                hidden
                lg:block
                absolute
                inset-0
                w-full
                h-full
                pointer-events-none
                z-[3]
              "
              viewBox="0 0 1400 360"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="
                  M0 270
                  C180 190 300 390 500 295
                  C680 210 780 300 920 260
                  C1050 225 1180 265 1400 185
                  L1400 360
                  L0 360
                  Z
                "
                fill="white"
                opacity="0.055"
              />

              <path
                d="
                  M0 315
                  C190 245 300 355 475 310
                  C640 267 720 330 870 300
                  C1050 265 1190 305 1400 245
                  L1400 360
                  L0 360
                  Z
                "
                fill="white"
                opacity="0.035"
              />

              <circle
                cx="1050"
                cy="70"
                r="120"
                fill="white"
                opacity="0.035"
              />

              <circle
                cx="880"
                cy="315"
                r="90"
                fill="white"
                opacity="0.035"
              />
            </svg>



            {/* =====================================================
                CONTENT
                ===================================================== */}

            <div
              className="
                relative
                z-10
                flex
                flex-col
                lg:flex-row
                min-h-[200px]
                sm:min-h-[208px]
                lg:min-h-[212px]
              "
            >

              {/* ===================================================
                  LEFT — PROFILE + ACTIONS
                  =================================================== */}

              <div
                className="
                  w-full
                  lg:w-[31%]
                  flex
                  flex-col
                  items-start
                  px-5
                  sm:px-7
                  lg:px-7
                  xl:px-9
                  py-5
                  lg:py-6
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-4
                    sm:gap-5
                    w-full
                  "
                >

                  <div
                    className="
                      relative
                      shrink-0
                      mt-0
                    "
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={firstName}
                        className="
                          w-[68px]
                          h-[68px]
                          sm:w-[74px]
                          sm:h-[74px]
                          rounded-full
                          object-cover
                          border-[3px]
                          border-white/95
                          shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-[68px]
                          h-[68px]
                          sm:w-[74px]
                          sm:h-[74px]
                          rounded-full
                          bg-gradient-to-br
                          from-[#efc09e]
                          via-[#d99870]
                          to-[#ad6948]
                          border-[3px]
                          border-white/95
                          shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <span
                          className="
                            text-white
                            text-3xl
                            sm:text-4xl
                            font-medium
                          "
                        >
                          {firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <span
                      className="
                        absolute
                        right-[-1px]
                        bottom-0
                        w-5
                        h-5
                        sm:w-6
                        sm:h-6
                        rounded-full
                        bg-emerald-400
                        border-[3px]
                        border-white
                        shadow-md
                      "
                    />
                  </div>



                  <div className="min-w-0 pt-0">

                    <p
                      className="
                        text-white/90
                        text-sm
                        sm:text-base
                        font-normal
                        leading-tight
                        mb-0
                      "
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}
                    >
                      {greeting()},
                    </p>

                    <h1
                      className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        font-bold
                        tracking-tight
                        leading-tight
                      "
                      style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
                    >
                      {firstName}
                    </h1>



                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-2.5
                        text-white/95
                        whitespace-nowrap
                      "
                    >
                      <Users
                        className="w-4 h-4 shrink-0"
                        strokeWidth={2}
                      />

                      <span
                        className="text-xs sm:text-sm font-bold whitespace-nowrap"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
                      >
                        {roleLabel}
                      </span>
                    </div>



                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-1.5
                        text-white/90
                        whitespace-nowrap
                      "
                    >
                      <Home
                        className="w-4 h-4 shrink-0"
                        strokeWidth={2}
                      />

                      <span
                        className="text-xs sm:text-sm font-bold whitespace-nowrap"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
                      >
                        Grand Mission HOA
                      </span>
                    </div>

                  </div>

                </div>



                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    mt-4
                    ml-0
                  "
                >

                  <a
                    href="/board/submit"
                    className="
                      group
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      min-h-[42px]
                      px-4
                      sm:px-5
                      rounded-xl
                      bg-white
                      text-blue-700
                      shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                      transition-all
                      duration-200
                      hover:bg-blue-50
                      hover:-translate-y-0.5
                      hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]
                      active:translate-y-0
                      font-bold
                      whitespace-nowrap
                    "
                  >
                    <Plus
                      className="w-4 h-4 shrink-0"
                      strokeWidth={2.5}
                    />

                    <span
                      className="
                        text-xs
                        sm:text-sm
                        font-bold
                        whitespace-nowrap
                      "
                    >
                      Submit a Request
                    </span>
                  </a>



                  <a
                    href="https://airtable.com/app3AwDclb6uHhH1J/shrnC68Kokab4V81y"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share feedback"
                    title="Share feedback"
                    className="
                      group
                      inline-flex
                      items-center
                      justify-center
                      w-[42px]
                      h-[42px]
                      shrink-0
                      rounded-full
                      border
                      border-white/30
                      bg-slate-900/20
                      backdrop-blur-xl
                      text-white
                      shadow-lg
                      transition-all
                      duration-200
                      hover:bg-slate-900/35
                      hover:border-white/45
                      hover:-translate-y-0.5
                      active:translate-y-0
                    "
                  >
                    <MessageSquare
                      className="w-[18px] h-[18px]"
                      strokeWidth={1.8}
                    />
                  </a>

                </div>

              </div>



              {/* ===================================================
                  CENTER — COMMUNITY IMPACT
                  =================================================== */}

              <div
                className="
                  w-full
                  lg:w-[40%]
                  flex
                  items-center
                  px-4
                  sm:px-6
                  py-3
                  lg:py-4
                "
              >

                <div
                  className="
                    w-full
                    rounded-[20px]
                    border
                    border-white/25
                    bg-white/[0.16]
                    backdrop-blur-xl
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                      px-4
                      sm:px-5
                      pt-3
                      pb-2.5
                    "
                  >

                    <div
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-amber-400/25
                        border
                        border-amber-200/40
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <HeartHandshake
                        className="w-[18px] h-[18px] text-amber-100"
                        strokeWidth={1.9}
                      />
                    </div>

                    <div className="min-w-0">

                      <h2
                        className="
                          text-white
                          text-sm
                          sm:text-base
                          font-bold
                          leading-tight
                          whitespace-nowrap
                        "
                      >
                        Your community impact
                      </h2>

                      <p
                        className="
                          text-blue-100/90
                          text-[11px]
                          sm:text-xs
                          mt-0.5
                          font-bold
                        "
                      >
                        This week
                      </p>

                    </div>

                  </div>



                  <div
                    className="
                      grid
                      grid-cols-3
                      border-t
                      border-white/15
                    "
                  >

                    <div
                      className="
                        px-3
                        sm:px-4
                        py-3
                        sm:py-3.5
                        border-r
                        border-white/15
                      "
                    >

                      <div
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-white
                          flex
                          items-center
                          justify-center
                          mb-1.5
                        "
                      >
                        <FileText
                          className="w-[15px] h-[15px] text-blue-600"
                          strokeWidth={2}
                        />
                      </div>

                      <div
                        className="
                          text-white
                          text-xl
                          sm:text-2xl
                          font-bold
                          leading-none
                        "
                      >
                        {forwardedCount}
                      </div>

                      <p
                        className="
                          text-blue-50
                          text-[10px]
                          sm:text-xs
                          mt-1
                          leading-snug
                          font-bold
                        "
                      >
                        Requests
                        <br />
                        forwarded
                      </p>

                    </div>



                    <div
                      className="
                        px-3
                        sm:px-4
                        py-3
                        sm:py-3.5
                        border-r
                        border-white/15
                      "
                    >

                      <div
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-emerald-100
                          flex
                          items-center
                          justify-center
                          mb-1.5
                        "
                      >
                        <CheckCircle2
                          className="w-[15px] h-[15px] text-emerald-600"
                          strokeWidth={2.2}
                        />
                      </div>

                      <div
                        className="
                          text-white
                          text-xl
                          sm:text-2xl
                          font-bold
                          leading-none
                        "
                      >
                        {resolvedCount}
                      </div>

                      <p
                        className="
                          text-blue-50
                          text-[10px]
                          sm:text-xs
                          mt-1
                          leading-snug
                          font-bold
                        "
                      >
                        Resolved
                      </p>

                    </div>



                    <div
                      className="
                        px-3
                        sm:px-4
                        py-3
                        sm:py-3.5
                      "
                    >

                      <div
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-amber-100
                          flex
                          items-center
                          justify-center
                          mb-1.5
                        "
                      >
                        <Clock3
                          className="w-[15px] h-[15px] text-amber-600"
                          strokeWidth={2.2}
                        />
                      </div>

                      <div
                        className="
                          text-white
                          text-xl
                          sm:text-2xl
                          font-bold
                          leading-none
                        "
                      >
                        {inProgressCount}
                      </div>

                      <p
                        className="
                          text-blue-50
                          text-[10px]
                          sm:text-xs
                          mt-1
                          leading-snug
                          font-bold
                        "
                      >
                        In progress
                      </p>

                    </div>

                  </div>

                </div>

              </div>



              {/* ===================================================
                  RIGHT — MONUMENT / EMPTY ACTION AREA
                  =================================================== */}

              <div
                className="
                  w-full
                  lg:flex-1
                  relative
                  min-h-[75px]
                  lg:min-h-0
                  flex
                  items-center
                  lg:items-end
                  justify-end
                  px-4
                  sm:px-6
                  lg:px-6
                  xl:px-8
                  pb-5
                  lg:pb-5
                "
              >

                <div className="flex flex-col items-center lg:items-end text-center lg:text-right">

                  <style>{`
  /*
   * Complete animation cycle: 3 seconds
   *
   * ~2 seconds = rendering + holding
   * ~1 second = completely blank
   */

  @keyframes greetingWordDrop {
    0% {
      opacity: 0;
      transform: translateY(-28px) scale(0.92);
    }

    7% {
      opacity: 1;
      transform: translateY(5px) scale(1.03);
    }

    10% {
      opacity: 1;
      transform: translateY(-2px) scale(0.99);
    }

    13% {
      opacity: 1;
      transform: translateY(1px) scale(1);
    }

    /*
     * Hold the word after it has appeared.
     */
    63% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /*
     * Remove everything at the end of the cycle.
     */
    67% {
      opacity: 0;
      transform: translateY(0) scale(1);
    }

    100% {
      opacity: 0;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes greetingLineDraw {
    0% {
      stroke-dashoffset: 160;
      opacity: 0;
    }

    42% {
      stroke-dashoffset: 160;
      opacity: 0;
    }

    48% {
      opacity: 1;
    }

    67% {
      stroke-dashoffset: 0;
      opacity: 0.85;
    }

    /*
     * Hold the completed line.
     */
    67% {
      stroke-dashoffset: 0;
      opacity: 0.85;
    }

    /*
     * Remove the line before the 1-second blank period.
     */
    70% {
      stroke-dashoffset: 160;
      opacity: 0;
    }

    100% {
      stroke-dashoffset: 160;
      opacity: 0;
    }
  }

  .greeting-word {
    display: inline-block;
    opacity: 0;
    animation-name: greetingWordDrop;
    animation-duration: 3s;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    animation-iteration-count: infinite;
  }

  /*
   * Words appear one after another.
   * Because every animation has the SAME 3-second cycle,
   * they remain synchronized on every repeat.
   */

  .greeting-word-1 {
    animation-delay: 0s;
  }

  .greeting-word-2 {
    animation-delay: 0.16s;
  }

  .greeting-word-3 {
    animation-delay: 0.32s;
  }

  .greeting-word-4 {
    animation-delay: 0.48s;
  }

  .greeting-underline {
    stroke-dasharray: 160;
    stroke-dashoffset: 160;
    animation-name: greetingLineDraw;
    animation-duration: 3s;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .greeting-word {
      opacity: 1;
      animation: none;
    }

    .greeting-underline {
      stroke-dashoffset: 0;
      opacity: 0.85;
      animation: none;
    }
  }
`}</style>

<p
  className="text-white text-2xl sm:text-3xl lg:text-3xl xl:text-4xl leading-snug"
  style={{
    textShadow: '0 2px 8px rgba(0,0,0,0.35)',
  }}
>
  <span
    className={`${caveat.className} greeting-word greeting-word-1`}
    style={{
      fontFamily: caveat.style.fontFamily,
      fontWeight: 700,
    }}
  >
    Help
  </span>{' '}

  <span
    className={`${caveat.className} greeting-word greeting-word-2`}
    style={{
      fontFamily: caveat.style.fontFamily,
      fontWeight: 700,
    }}
  >
    keep
  </span>{' '}

  <span
    className={`${caveat.className} greeting-word greeting-word-3`}
    style={{
      fontFamily: caveat.style.fontFamily,
      fontWeight: 700,
    }}
  >
    our
  </span>

  <br />

  <span
    className={`${caveat.className} greeting-word greeting-word-4`}
    style={{
      fontFamily: caveat.style.fontFamily,
      fontWeight: 700,
    }}
  >
    community thriving
  </span>
</p>

                  <svg
                    width="150"
                    height="16"
                    viewBox="0 0 150 16"
                    className="mt-1"
                    fill="none"
                  >
                    <path
                      d="M4 8 Q 75 15 146 6"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0"
                      className="greeting-underline"
                    />
                  </svg>

                </div>
              </div>

            </div>

          </section>



          {/* =========================================================
              EXISTING DASHBOARD — UNCHANGED
              ========================================================= */}

          <BoardDashboard
            requests={requests}
            currentEmail={boardMember.email}
            currentName={boardMember.name}
            viewerRole="board"
          />

        </section>
      </main>

      <BottomNav basePath="/board" />

    </div>
  )
}