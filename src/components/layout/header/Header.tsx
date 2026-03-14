import { ShieldCheck, UserCircle } from 'lucide-react'

import { Typography } from '@/components/ui'
import { auth } from '@/lib/auth'

import { LogoutButton } from './LogoutButton'

export const Header = async () => {
  const session = await auth()

  return (
    <header className='sticky top-0 z-50 bg-navy-900 shadow-md'>
      <div className='mx-auto flex h-14 max-w-screen-xl items-center gap-3 px-4 sm:px-6 lg:px-8'>
        <ShieldCheck className='size-6 shrink-0 text-primary-400' aria-hidden />
        <div className='flex-1'>
          <Typography
            variant='h4'
            as='span'
            className='block text-base font-semibold leading-none text-white'
          >
            SecureEval
          </Typography>
          <Typography variant='body-sm' as='span' className='hidden text-xs text-navy-400 sm:block'>
            Evaluări de securitate fizică
          </Typography>
        </div>

        {session?.user && (
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1.5'>
              <UserCircle className='size-5 shrink-0 text-navy-400' aria-hidden />
              <span className='hidden text-sm text-navy-300 sm:block'>{session.user.name}</span>
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  )
}

