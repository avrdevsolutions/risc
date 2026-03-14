'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { ShieldCheck } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { Button, Typography } from '@/components/ui'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email sau parolă incorectă')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('A apărut o eroare. Încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-navy-100 px-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <div className='mb-3 flex justify-center'>
            <ShieldCheck className='size-12 text-primary-600' aria-hidden />
          </div>
          <Typography variant='h2' as='h1' className='text-navy-900'>
            SecureEval
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-500'>
            Platformă evaluări securitate
          </Typography>
        </div>

        <div className='rounded-xl bg-white p-8 shadow-lg'>
          <form onSubmit={handleSubmit} noValidate>
            <div className='mb-5'>
              <label
                htmlFor='email'
                className='mb-1.5 block text-sm font-medium text-navy-700'
              >
                Adresă email
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='evaluator@firma.ro'
                className='w-full rounded-lg border border-navy-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
              />
            </div>

            <div className='mb-6'>
              <label
                htmlFor='password'
                className='mb-1.5 block text-sm font-medium text-navy-700'
              >
                Parolă
              </label>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-lg border border-navy-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
              />
            </div>

            {error && (
              <p role='alert' className='mb-4 text-sm text-error-600'>
                {error}
              </p>
            )}

            <Button
              type='submit'
              disabled={loading}
              aria-busy={loading}
              className='w-full'
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
