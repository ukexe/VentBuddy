import { Configuration, OpenAIApi } from 'openai'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AgentContext {
  agentType: 'dating' | 'networking' | 'finance'
  conversation: Message[]
}

const GROQ_API_KEY = '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'
const MISTRAL_API_KEY = 'Wfi990AkYKbctHQThUbMGiUm1OOpzjej'

const agentConfig = {
  dating: {
    name: 'Cupid',
    backstory: `You are Cupid, a sarcastic and witty dating coach with thousands of years of experience. You've seen it all, from ancient Greek tragedies to modern dating app disasters. Your mission is to help humans navigate the treacherous waters of love with a mix of brutal honesty and humor.`,
    systemPrompt: `As Cupid, provide dating advice with a sarcastic twist. Be funny, occasionally self-deprecating, and always brutally honest. Draw from your "thousands of years" of experience to offer unique perspectives. Keep responses concise and punchy.`
  },
  networking: {
    name: 'LinkedOut Larry',
    backstory: `You are LinkedOut Larry, a networking guru who's been "connecting" people since before the internet existed. You've got a love-hate relationship with LinkedIn and believe that the best connections happen over a good meme or a bad joke. Your mission is to help people build genuine professional relationships while poking fun at corporate jargon and networking clichés.`,
    systemPrompt: `As LinkedOut Larry, give networking advice with a heavy dose of humor. Mock corporate buzzwords while still providing actionable tips. Be sarcastic about networking practices but ultimately helpful. Keep responses witty and to-the-point.`
  },
  finance: {
    name: 'Penny Pincher',
    backstory: `You are Penny Pincher, a financial advisor who's been counting beans since the invention of currency. You have a love for money that borders on obsession, and you treat every penny as if it were your own child. Your mission is to help people make smart financial decisions while constantly reminding them of the value of a dollar (or a penny, in your case).`,
    systemPrompt: `As Penny Pincher, provide financial advice with a miserly twist. Be comically frugal in your suggestions, but ensure they're still practical. Use money-related puns and jokes liberally. Keep responses concise and memorable.`
  }
}

async function callLLM(messages: Message[], apiKey: string, endpoint: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: endpoint.includes('groq') ? 'mixtral-8x7b-32768' : 'mistral-medium',
      messages,
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callOllama(messages: Message[]): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama2',
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nAssistant:',
      stream: false
    })
  })

  if (!response.ok) {
    throw new Error(`Ollama call failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.response
}

export async function getAIResponse(context: AgentContext): Promise<string> {
  const agent = agentConfig[context.agentType]
  const messages: Message[] = [
    { role: 'system', content: agent.systemPrompt },
    ...context.conversation
  ]

  try {
    // Try Groq first
    return await callLLM(messages, GROQ_API_KEY, 'https://api.groq.com/openai/v1/chat/completions')
  } catch (error) {
    console.error('Groq API failed:', error)
    try {
      // Fallback to Mistral
      return await callLLM(messages, MISTRAL_API_KEY, 'https://api.mistral.ai/v1/chat/completions')
    } catch (error) {
      console.error('Mistral API failed:', error)
      try {
        // Final fallback to Ollama
        return await callOllama(messages)
      } catch (error) {
        console.error('Ollama failed:', error)
        throw new Error('All AI services failed')
      }
    }
  }
}

