const express = require('express')
require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Registrador de requisições simples para auxiliar na depuração.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.url}`)
  next()
})

const BASE_PORT = parseInt(process.env.PORT, 10) || 3000
const MAX_PORT_TRIES = 10
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY

if (!OPENWEATHER_API_KEY) console.warn('Warning: OPENWEATHER_API_KEY not set')
if (!GROQ_API_KEY) console.warn('Warning: GROQ_API_KEY not set')

app.get('/weather', async (req, res) => {
  const city = req.query.city
  if (!city) return res.status(400).json({ error: 'city query param required' })

  try {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`)
    const data = await resp.json()
    if (!resp.ok) return res.status(resp.status).json(data)
    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro interno ao buscar clima' })
  }
})

app.post('/ai/suggest', async (req, res) => {
  const { temperature, humidity, city } = req.body
  if (typeof temperature === 'undefined' || typeof humidity === 'undefined' || !city) {
    return res.status(400).json({ error: 'temperature, humidity e city são obrigatórios' })
  }

  // Se chave não está configurada, usar sugestão estática
  if (!GROQ_API_KEY || GROQ_API_KEY.startsWith('gsk_')) {
    const sugestaoEstática = gerarSugestaoRoupa(temperature, humidity)
    return res.json({ content: sugestaoEstática, raw: { mode: 'static' } })
  }

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'user',
            content: `Sugira roupas para a temperatura de ${temperature} graus, com umidade de ${humidity}%, na cidade de ${city}. Seja breve (max 100 caracteres).`
          }
        ]
      })
    })

    const json = await resp.json()
    const content = json?.choices?.[0]?.message?.content || null
    if (!resp.ok) {
      const errMsg = json?.error?.message || 'Erro desconhecido'
      console.error('Groq API error:', errMsg)
      // Se a API da IA falhar, usar sugestão estática como fallback
      const sugestaoEstática = gerarSugestaoRoupa(temperature, humidity)
      return res.json({ content: sugestaoEstática + ' (modo fallback)', raw: json })
    }

    return res.json({ content, raw: json })
  } catch (err) {
    console.error(err)
    const sugestaoEstática = gerarSugestaoRoupa(temperature, humidity)
    return res.json({ content: sugestaoEstática + ' (modo fallback)', raw: { error: err.message } })
  }
})

// Função auxiliar para gerar sugestão de roupa quando API não está disponível
function gerarSugestaoRoupa(temp, umidade) {
  if (temp < 10) {
    return `Com ${temp}°C, use casaco pesado, cachecol, gorro e luvas. Umidade: ${umidade}%`
  } else if (temp < 15) {
    return `Com ${temp}°C, use casaco de meia estação, suéter. Umidade: ${umidade}%`
  } else if (temp < 20) {
    return `Com ${temp}°C, use uma jaqueta leve ou suéter. Umidade: ${umidade}%`
  } else if (temp < 25) {
    return `Com ${temp}°C, use roupas confortáveis de meia estação. Umidade: ${umidade}%`
  } else {
    return `Com ${temp}°C, prefira roupas leves e respiráveis. Umidade: ${umidade}%`
  }
}

// Ponto de extremidade de verificação de integridade para auxiliar na depuração a partir do navegador.
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

function startServer(port, triesLeft) {
  const server = app.listen(port)

  server.on('listening', () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`)
      startServer(port + 1, triesLeft - 1)
    } else {
      console.error('Failed to start server:', err)
      process.exit(1)
    }
  })
}

startServer(BASE_PORT, MAX_PORT_TRIES)
