import BoardLoginForm from './BoardLoginForm'

export const metadata = { title: 'Board Sign In | Grand Mission HOA' }

export default function BoardLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-md mx-auto px-6 pt-16 md:pt-24 pb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3">
          Board Sign In
        </h1>
        <p className="text-foreground/70 mb-8">
          Enter your board member email and we'll send you a secure sign-in
          link. It expires in 15 minutes.
        </p>
        <BoardLoginForm />
      </section>
    </main>
  )
}