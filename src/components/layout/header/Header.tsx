import { ShieldCheck } from 'lucide-react'

import { Typography } from '@/components/ui'

export const Header = () => (
  <header className='sticky top-0 z-50 bg-navy-900 shadow-md'>
    <div className='mx-auto flex h-14 max-w-screen-xl items-center gap-3 px-4 sm:px-6 lg:px-8'>
      <ShieldCheck className='size-6 shrink-0 text-primary-400' aria-hidden />
      <div>
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
    </div>
  </header>
)
