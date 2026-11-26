'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function ConnectionTest() {
  const [status, setStatus] = useState('Not tested yet')

  async function testConnection() {
    setStatus('Connecting to Supabase...')

    try {
      const supabase = createClient()

      const { error, status: httpStatus } = await supabase
        .from('profiles')
        .select('id')
        .limit(0)

      if (error) {
        setStatus(
          'Connection test failed: HTTP ' +
          httpStatus + ' | ' +
          (error.code || 'Unknown code') + ' | ' +
          (error.message || 'No error message')
        )
      } else {
        setStatus('Supabase connection successful!')
      }
    } catch (error) {
      setStatus('Connection test failed: ' + error.message)
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>WetalenD — Connection Test</h1>
      <p>{status}</p>
      <button onClick={testConnection}>
        Test Supabase Connection
      </button>
    </main>
  )
}
