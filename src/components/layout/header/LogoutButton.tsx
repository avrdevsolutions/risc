'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export const LogoutButton = () => (
  <button
    type='button'
    onClick={() => signOut({ callbackUrl: '/auth/login' })}
    className='flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-navy-300 transition hover:bg-navy-800 hover:text-white'
    aria-label='Deconectare'
  >
    <LogOut className='size-3.5' aria-hidden />
    <span className='hidden sm:inline'>Deconectare</span>
  </button>
)
