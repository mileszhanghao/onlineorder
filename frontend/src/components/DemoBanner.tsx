import { useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Typography } from 'antd'
import { DEMO_EMAIL, DEMO_PASSWORD, resetDemo } from '../demo/demoApi'

const REPO_URL = 'https://github.com/mileszhanghao/siuyeh'

/** Shown only in the GitHub Pages build so nobody mistakes it for the full deployment. */
export default function DemoBanner() {
  const queryClient = useQueryClient()

  return (
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 24 }}
      title="Demo mode"
      description={
        <>
          This public demo runs entirely in your browser with sample data, so it needs no server. The real
          app is a Spring Boot + PostgreSQL API — see the{' '}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            source on GitHub
          </a>{' '}
          and run it with <Typography.Text code>docker compose up</Typography.Text>. Log in with{' '}
          <Typography.Text code copyable>
            {DEMO_EMAIL}
          </Typography.Text>{' '}
          /{' '}
          <Typography.Text code copyable>
            {DEMO_PASSWORD}
          </Typography.Text>{' '}
          or create your own account.
        </>
      }
      action={
        <Button
          size="small"
          onClick={() => {
            resetDemo()
            queryClient.resetQueries()
          }}
        >
          Reset demo
        </Button>
      }
    />
  )
}
