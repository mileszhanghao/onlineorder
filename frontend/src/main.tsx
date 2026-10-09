import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApiError } from './api.ts'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry auth failures; the UI shows the login form instead.
      retry: (failureCount, error) => !(error instanceof ApiError && error.status === 401) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#c2410c', borderRadius: 8 } }}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
)
