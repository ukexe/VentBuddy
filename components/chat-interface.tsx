'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, User, Heart, Network, PiggyBank } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAIResponse } from '@/lib/ai-service'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const agents = [
  {
    id: 'dating',
    name: 'Cupid',
    icon: <Heart className="w-4 h-4" />,
    description: 'Your sarcastic love guru',
    initialMessage: "Well, well, well... Another poor soul seeking the wisdom of Cupid. What romantic tragedy shall we unravel today? Don't worry, I've only been doing this for a few thousand years. I'm sure your dating problems are completely unique and not at all like the millions I've seen before. So, spill it, mortal. What's your heart's desire?"
  },
  {
    id: 'networking',
    name: 'LinkedOut Larry',
    icon: <Network className="w-4 h-4" />,
    description: 'Networking guru extraordinaire',
    initialMessage: "Ah, welcome to the world of professional 'connecting'! I'm LinkedOut Larry, your guide through the treacherous waters of networking. Before we dive in, let me know: are you here to 'touch base', 'circle back', or 'synergize'? Don't worry, I speak fluent corporate jargon. So, what buzzword-filled networking challenge can I help you with today?"
  },
  {
    id: 'finance',
    name: 'Penny Pincher',
    icon: <PiggyBank className="w-4 h-4" />,
    description: 'Your frugal financial friend',
    initialMessage: "Well, hello there, big spender! I'm Penny Pincher, and I'm here to make sure you treat every cent like it's your last. Before we start, I hope you didn't spend too much on that fancy internet connection you're using to talk to me. Now, what financial folly can I help you avoid today? Remember, time is money, so make it snappy!"
  }
]

export default function ChatInterface() {
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with agent's greeting
    setMessages([
      {
        role: 'assistant',
        content: activeAgent.initialMessage,
        timestamp: Date.now()
      }
    ])
  }, [activeAgent.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse({
        agentType: activeAgent.id as 'dating' | 'networking' | 'finance',
        conversation: messages.concat(userMessage).map(({ role, content }) => ({ role, content }))
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! It seems my witty remarks have short-circuited the system. Let's try that again, shall we?",
        timestamp: Date.now()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[800px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>Truth Terminal: Where AI Gets Real</CardTitle>
      </CardHeader>
      <Tabs defaultValue={activeAgent.id} className="flex-1 flex flex-col">
        <TabsList className="justify-start border-b rounded-none px-4">
          {agents.map(agent => (
            <TabsTrigger
              key={agent.id}
              value={agent.id}
              onClick={() => setActiveAgent(agent)}
              className="flex items-center gap-2"
            >
              {agent.icon}
              {agent.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {agents.map(agent => (
          <TabsContent
            key={agent.id}
            value={agent.id}
            className="flex-1 flex flex-col p-4 space-y-4"
          >
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      message.role === 'assistant' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'assistant'
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask ${agent.name} something...`}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Send'}
              </Button>
            </form>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

