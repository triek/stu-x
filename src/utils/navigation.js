export const resolveRedirectPath = (redirectQueryValue) => {
  if (Array.isArray(redirectQueryValue)) {
    return redirectQueryValue.find((entry) => typeof entry === 'string' && entry.trim()) ?? ''
  }

  if (typeof redirectQueryValue === 'string') {
    return redirectQueryValue.trim()
  }

  return ''
}

export const buildRedirectRoute = (name, redirectPath) => {
  if (redirectPath) {
    return { name, query: { redirect: redirectPath } }
  }

  return { name }
}
