import LoginForm from './LoginForm'

export const metadata = {
  title: 'Track Your Requests | Grand Mission HOA',
}

export default function ProfileLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-md mx-auto px-6 pt-16 md:pt-24 pb-16 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="w-4 h-4 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 20.25a48.25 48.25 0 01-8.135-.678c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-3 py-1.5 rounded-full leading-none">
              Request Tracking Only
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3">
            Track Your Requests
          </h1>
          <p className="text-foreground/70 leading-relaxed">
            This is just for viewing the status of requests you've submitted
            not a general site account. Enter the email you used when
            submitting, and we'll send you a link to your request history.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  )
}