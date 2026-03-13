import { HardHat } from 'lucide-react'

import { Typography } from '@/components/ui'

export const Header = () => (
  <header className='sticky top-0 z-50 bg-navy-700 shadow-md'>
    <div className='mx-auto flex h-16 max-w-screen-xl items-center gap-3 px-4 sm:px-6 lg:px-8'>
      <HardHat className='size-7 text-secondary-400' aria-hidden />
      <div>
        <Typography variant='h4' as='span' className='block leading-none text-white'>
          SSM Constructor
        </Typography>
        <Typography variant='body-sm' as='span' className='block text-navy-200'>
          Evaluare de Risc
        </Typography>
      </div>
    </div>
  </header>
)
