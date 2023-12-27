export async function ping(): Promise<string> {
  const response = await fetch('/api/ping')
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return await response.text()
}
