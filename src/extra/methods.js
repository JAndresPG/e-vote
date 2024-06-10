export const getToken = () => localStorage.getItem("token") ?? ''

export const optionsGet = () => ({
  method: 'GET',
  headers: {
    authorization: `Bearer ${getToken()}`
  }
})

export const optionsPost = (body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${getToken()}`
  },
  body: body ? JSON.stringify(body) : undefined
})

export const optionsPostPublic = (body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: body ? JSON.stringify(body) : undefined
})