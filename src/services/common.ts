export async function ping(): Promise<string> {
  const response = await fetch(import.meta.env.BASE_URL + '/api/ping')
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return await response.text()
}
