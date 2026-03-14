import { forwardRef } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white shadow-sm hover:-translate-y-px hover:bg-primary-600 hover:shadow-md active:bg-primary-700',
        secondary:
          'bg-navy-100 text-navy-800 hover:-translate-y-px hover:bg-navy-200 active:bg-navy-300',
        outline:
          'border border-navy-300 text-navy-700 hover:-translate-y-px hover:bg-navy-50 active:bg-navy-100',
        ghost: 'text-navy-600 hover:bg-navy-100 active:bg-navy-200',
        danger:
          'bg-error-600 text-white shadow-sm hover:-translate-y-px hover:bg-error-600 hover:shadow-md active:bg-error-700',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10 rounded-xl',
        inline: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className='inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent'
          aria-hidden='true'
        />
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }
