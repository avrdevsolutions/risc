import { useState } from 'react'

import { Select } from './Select'

import type { Meta, StoryObj } from '@storybook/react'

const SHORT_OPTIONS = ['Scăzut', 'Mediu', 'Ridicat']

const LONG_OPTIONS = [
  'Unitate comercială (magazin, showroom)',
  'Supermarket / Hipermarket',
  'Bancă / Instituție financiară',
  'Birou / Clădire de birouri',
  'Depozit / Logistică',
  'Fabrică / Unitate de producție',
  'Hotel / Pensiune',
  'Spital / Clinică',
  'Școală / Universitate',
  'Instituție publică / Primărie',
]

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const ShortList: Story = {
  args: {
    options: SHORT_OPTIONS,
    placeholder: 'Selectați nivelul...',
  },
}

export const LongListWithSearch: Story = {
  args: {
    options: LONG_OPTIONS,
    placeholder: 'Selectați tipul unității...',
  },
}

export const WithValue: Story = {
  args: {
    options: SHORT_OPTIONS,
    value: 'Mediu',
  },
}

export const Disabled: Story = {
  args: {
    options: SHORT_OPTIONS,
    value: 'Scăzut',
    disabled: true,
  },
}

export const SearchForced: Story = {
  name: 'Search (forced on short list)',
  args: {
    options: SHORT_OPTIONS,
    searchable: true,
    placeholder: 'Caută...',
  },
}

export const AllVariants: Story = {
  render: () => {
    const Controlled = () => {
      const [short, setShort] = useState<string>('')
      const [long, setLong] = useState<string>('')
      return (
        <div className='flex max-w-sm flex-col gap-4'>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Short list (≤5, no search)</p>
            <Select options={SHORT_OPTIONS} value={short} onChange={setShort} />
          </div>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Long list (&gt;5, with search)</p>
            <Select options={LONG_OPTIONS} value={long} onChange={setLong} />
          </div>
          <div>
            <p className='mb-1 text-xs text-navy-500'>Disabled</p>
            <Select options={SHORT_OPTIONS} value='Mediu' disabled />
          </div>
        </div>
      )
    }
    return <Controlled />
  },
}
