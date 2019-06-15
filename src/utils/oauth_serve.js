import { OAUTH_HOST } from '@/constants'

export function redirectToOAuth() {
  window.location.href = `${OAUTH_HOST}/oauth`
}