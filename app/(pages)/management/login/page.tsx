import ManagementLoginForm from './ManagementLoginForm'

export const metadata = { title: 'Management Sign In | Grand Mission HOA' }

export default function ManagementLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-md mx-auto px-6 pt-16 md:pt-24 pb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3">
          Management Sign In
        </h1>
        <p className="text-foreground/70 mb-8">
          Enter your management company email and we'll send you a secure
          sign-in link. It expires in 15 minutes.
        </p>
        <ManagementLoginForm />
      </section>
    </main>
  )
}