"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

const FAQ_RESPONSES: { [key: string]: string } = {
  "hallo": "Hey! Welkom bij Lucifer! 👋 Hoe kan ik je helpen?",
  "hi": "Hey! Welkom bij Lucifer! 👋 Hoe kan ik je helpen?",
  "hey": "Hey! Welkom bij Lucifer! 👋 Hoe kan ik je helpen?",
  "help": "Ik kan je helpen met vragen over onze producten, betalingen, leveringen en meer! Waar heb je hulp bij nodig?",
  "prijs": "Onze producten variëren van €2.80 tot €140. Je kunt alle prijzen bekijken op onze Products pagina!",
  "price": "Onze producten variëren van €2.80 tot €140. Je kunt alle prijzen bekijken op onze Products pagina!",
  "betaling": "We accepteren alle belangrijke creditcards, PayPal en cryptocurrency via onze veilige payment processor.",
  "payment": "We accepteren alle belangrijke creditcards, PayPal en cryptocurrency via onze veilige payment processor.",
  "levering": "Alle digitale producten worden direct na betaling geleverd! Je ontvangt een email met de download link.",
  "delivery": "Alle digitale producten worden direct na betaling geleverd! Je ontvangt een email met de download link.",
  "instant": "Ja! Alle producten worden instant geleverd na succesvolle betaling.",
  "support": "Voor support kun je ons bereiken via Discord (discord.gg/yxro) of email (support@lucifer.com). We zijn 24/7 beschikbaar!",
  "discord": "Join onze Discord server: discord.gg/yxro voor instant support en community help!",
  "refund": "Door de digitale aard van onze producten bieden we geen refunds. Als je technische problemen hebt, neem contact op met support!",
  "terugbetaling": "Door de digitale aard van onze producten bieden we geen refunds. Als je technische problemen hebt, neem contact op met support!",
  "korting": "Gebruik code LUCIFER20 voor 20% korting op je eerste aankoop! 🎉",
  "discount": "Gebruik code LUCIFER20 voor 20% korting op je eerste aankoop! 🎉",
  "code": "Gebruik code LUCIFER20 voor 20% korting op je eerste aankoop! 🎉",
  "producten": "We hebben FiveM scripts, websites, blacklists, Nitro boosts en meer! Bekijk alle producten op onze Products pagina.",
  "products": "We hebben FiveM scripts, websites, blacklists, Nitro boosts en meer! Bekijk alle producten op onze Products pagina.",
  "fivem": "Ja! We hebben verschillende FiveM scripts zoals Future Remake en TDA Remake. Allemaal Plug & Play!",
  "website": "We maken Starter, Premium en Zakelijke websites vanaf €40! Custom gemaakt naar jouw wensen.",
  "nitro": "Nitro Boost kost €3.50 en Server Boost 14x kost €2.80!",
  "bypass": "Fresh Bypass is beschikbaar voor €10/maand of €20 lifetime. Volledig undetected!",
  "blacklist": "We hebben Exotic Basic Blacklist (€6.50) en Exotic Premium Blacklist (€8.50).",
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! 👋 Welkom bij Lucifer Support! Ik ben je AI assistent. Hoe kan ik je helpen?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for exact matches first
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    // Default response
    return "Bedankt voor je vraag! Voor specifieke vragen kun je contact opnemen met ons support team via Discord (discord.gg/yxro) of email (support@lucifer.com). We zijn 24/7 beschikbaar! 💬"
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="flex flex-col h-[500px] bg-card border-primary/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Lucifer Support</h3>
                    <p className="text-xs text-muted-foreground">AI Assistent</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    {message.isBot && (
                      <div className="p-2 bg-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.isBot
                          ? "bg-muted text-foreground"
                          : "bg-primary text-white"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {!message.isBot && (
                      <div className="p-2 bg-primary/20 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="p-2 bg-primary rounded-full h-8 w-8 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type je vraag..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Powered by AI • 24/7 beschikbaar
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </>
  )
}
