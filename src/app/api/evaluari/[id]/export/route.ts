import { NextResponse } from 'next/server'

// Export to PDF/Word is not yet implemented.
export const GET = async () => {
  return NextResponse.json({ error: 'Exportul nu este încă disponibil' }, { status: 501 })
}
