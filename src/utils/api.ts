const API_URL = 'https://api.openai.com/v1/chat/completions'
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const TIMEOUT = 30000

interface ApiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function sendToOpenAI(messages: ApiMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new Error('VITE_OPENAI_API_KEY is not set. Please add it to your .env file.')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4096,
        messages,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds. Please try again.')
      }
      throw error
    }

    throw new Error('Unknown error occurred')
  }
}
