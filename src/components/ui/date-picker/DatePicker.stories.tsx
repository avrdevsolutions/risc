import { useState } from 'react'

import { DatePicker } from './DatePicker'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: {
    placeholder: 'Selectați data...',
  },
}

export const WithValue: Story = {
  args: {
    value: '2026-03-14',
  },
}

export const Disabled: Story = {
  args: {
    value: '2026-03-14',
    disabled: true,
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Data evaluării',
  },
}

export const AllStates: Story = {
  render: () => {
    const Controlled = () => {
      const [v, setV] = useState<string>('')
      return (
        <div className='flex max-w-sm flex-col gap-4'>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Default (no value)</p>
            <DatePicker placeholder='Selectați data...' />
          </div>
          <div>
            <p className='mb-1 text-xs text-navy-500'>With pre-filled value</p>
            <DatePicker value='2026-03-14' onChange={() => undefined} />
          </div>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Controlled — selected: {v || '(none)'}</p>
            <DatePicker value={v} onChange={setV} />
          </div>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Disabled</p>
            <DatePicker value='2026-03-14' disabled />
          </div>
        </div>
      )
    }
    return <Controlled />
  },
}
