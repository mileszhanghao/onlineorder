import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App, Button, Card, Form, Input, Tabs } from 'antd'
import { api } from '../api'
import type { SignupInput } from '../types'

interface LoginInput {
  email: string
  password: string
}

export default function AuthPanel() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const login = useMutation({
    mutationFn: (input: LoginInput) => api.login(input.email, input.password),
    onSuccess: (customer) => queryClient.setQueryData(['me'], customer),
    onError: (error) => message.error(error.message),
  })

  const signup = useMutation({
    mutationFn: async (input: SignupInput) => {
      await api.signup(input)
      return api.login(input.email, input.password)
    },
    onSuccess: (customer) => queryClient.setQueryData(['me'], customer),
    onError: (error) => message.error(error.message),
  })

  return (
    <Card style={{ maxWidth: 420, margin: '48px auto' }}>
      <Tabs
        items={[
          {
            key: 'login',
            label: 'Log in',
            children: (
              <Form<LoginInput> layout="vertical" onFinish={(values) => login.mutate(values)}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input autoComplete="email" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={login.isPending}>
                  Log in
                </Button>
              </Form>
            ),
          },
          {
            key: 'signup',
            label: 'Sign up',
            children: (
              <Form<SignupInput> layout="vertical" onFinish={(values) => signup.mutate(values)}>
                <Form.Item label="First name" name="firstName" rules={[{ required: true }]}>
                  <Input autoComplete="given-name" />
                </Form.Item>
                <Form.Item label="Last name" name="lastName" rules={[{ required: true }]}>
                  <Input autoComplete="family-name" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input autoComplete="email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, min: 8, message: 'At least 8 characters' }]}
                >
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={signup.isPending}>
                  Create account
                </Button>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  )
}
