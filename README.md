# Previsão do Tempo com IA🌤️

**Aplicação de previsão do tempo com sugestão de roupas via IA**

## 🔧 Tecnologias

### Frontend

- **HTML** (`index.html`) — interface do usuário 🔹
- **CSS** (`styles.css`) — estilos responsivos 🎨
- **JavaScript** (`script.js`) — Fetch API, Web Speech API (reconhecimento de voz), tratamento de erros 🔧

### Backend

- **Node.js** + **Express** (`server.js`) — servidor seguro para manter chaves de API 🚀
- **CORS** — permitir requisições do frontend
- **Dotenv** — carregar variáveis de ambiente seguramente

### APIs Externas

- **OpenWeatherMap** — dados meteorológicos em tempo real 🌐
- **Groq API** (llama/mixtral) — geração de sugestões de roupas via IA (com fallback estático) 🤖

## 📁 Estrutura do projeto

```
├── index.html              # Interface HTML
├── styles.css              # Estilos CSS
├── script.js               # Lógica do frontend (busca clima, voz, requisições)
├── server.js               # Backend Node.js (APIs seguras)
├── package.json            # Dependências Node.js
├── .env                    # Variáveis de ambiente (não comitar)
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Ignorar arquivos sensíveis
├── config.example.json     # Exemplo de configuração
├── README.md               # Este arquivo
└── assets/                 # Imagens (lupa.svg, microfone.svg)
```

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+ (para backend)
- Python 3 (para servir frontend — opcional, pode usar VSCode Live Server)
- Chaves de API:
  - **OpenWeatherMap**: [openweathermap.org/api](https://openweathermap.org/api)
  - **Groq**: [console.groq.com](https://console.groq.com) (opcional — há fallback)

### Passos de instalação

1. **Clone ou extraia o projeto**

```bash
cd "Previsão do tempo"
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite `.env` com suas chaves:

```
OPENWEATHER_API_KEY=sua_chave_openweather
GROQ_API_KEY=sua_chave_groq
PORT=3002
```

3. **Instale dependências do backend**

```bash
npm install
```

4. **Inicie o backend** (em um terminal)

```bash
npm start
```

Resposta esperada: `Server listening on http://localhost:3002`

5. **Inicie o servidor HTTP do frontend** (em outro terminal)

```bash
python -m http.server 8000
```

Ou use **Live Server** no VSCode (extensão).

6. **Abra no navegador**

- Frontend: `http://localhost:8000/index.html`
- Backend: `http://localhost:3002/health` (teste de saúde)

### Fluxo de uso

1. Digite o nome de uma cidade no campo de entrada
2. Clique em **🔍 Buscar** (ícone de lupa)
3. Aguarde os dados meteorológicos carregarem
4. Clique em **Sugestão de Roupa** para receber uma recomendação
5. _(Opcional)_ Use o **🎤 Microfone** para entrada por voz (Chrome/Edge)

## 🔐 Configuração das chaves de API

### OpenWeatherMap

1. Crie conta em [openweathermap.org](https://openweathermap.org)
2. Gere uma chave de API (Current Weather Data — free tier)
3. Cole em `.env`: `OPENWEATHER_API_KEY=sua_chave`

### Groq (Opcional — tem fallback)

1. Crie conta em [console.groq.com](https://console.groq.com)
2. Gere uma chave de API
3. Cole em `.env`: `GROQ_API_KEY=sua_chave`
4. Se não configurar, o sistema usa sugestões estáticas como fallback.

## ✅ Funcionalidades implementadas

- ✅ Busca de clima por cidade (OpenWeatherMap API)
- ✅ Exibição de temperatura, umidade e ícone do clima
- ✅ Sugestão de roupa baseada em temperatura/umidade
- ✅ Reconhecimento de voz para entrada de cidade (Chrome/Edge)
- ✅ Tratamento robusto de erros com mensagens ao usuário
- ✅ Backend seguro com variáveis de ambiente (chaves não expostas)
- ✅ Fallback estático para sugestões quando API falha
- ✅ Suporte a CORS
- ✅ Health check endpoint (`/health`)
- ✅ Limpeza inteligente de números (suporta decimais e notações diferentes)
- ✅ Tentativa automática de portas alternativas se principal estiver em uso

## 🧪 Testes inclusos

**Testes manuais recomendados:**

- Buscar cidades válidas: `Lisboa`, `São Paulo`, `Tokyo`, `Nova York`
- Testar com cidades inválidas: validar mensagem de erro
- Testar reconhecimento de voz: dizer nomes de cidades
- Recarregar página durante requisição: verificar comportamento
- Desativar internet: testar fallback

**Teste automatizado (para desenvolvimento):**

```bash
# Terminal 1: inicie o backend
npm start

# Terminal 2: execute o teste
node /tmp/test-frontend.js
```

## 🐛 Troubleshooting

| Problema                               | Solução                                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **"Failed to fetch"** no navegador     | Verifique se backend está rodando (`npm start`), se porta está correta (3002), e se CORS está ativado |
| **Porta 3002 em uso**                  | Mude em `.env`: `PORT=3003` e atualize `script.js`: `BACKEND_URL = 'http://localhost:3003'`           |
| **Chave API inválida**                 | Verifique `.env` tem as chaves corretas; sistema funciona com fallback mesmo sem Groq                 |
| **Reconhecimento de voz não funciona** | Só suportado em navegadores Chromium (Chrome, Edge, Brave); Firefox não suporta                       |
| **Imagens não carregam**               | Certifique-se que `assets/` existe com `lupa.svg` e `microfone.svg`                                   |

## 📈 Melhorias futuras

- [ ] Previsão de 7 dias
- [ ] Histórico de cidades buscadas (localStorage)
- [ ] Tema escuro/claro
- [ ] Suporte multilíngue
- [ ] Integração com Weather API (alternativa ao OpenWeather)
- [ ] Cache de requisições
- [ ] PWA (Progressive Web App) para funcionar offline
- [ ] Testes unitários e E2E

## ✅ Considerações e boas práticas

- **Segurança**: Chaves de API nunca são expostas no frontend; tudo passa pelo backend seguro
- **Validação**: Entrada de usuário é validada antes de enviada para APIs externas
- **Tratamento de erros**: Erros de rede, API e parsing são tratados graciosamente
- **Performance**: Requisições são feitas sob demanda (sem pré-carregamento desnecessário)
- **Acessibilidade**: Suporte a voz para usuários com dificuldade de digitação

## 🤝 Contribuição

- Abra um **issue** para reportar bugs ou sugerir features
- Faça um **fork** e envie um **pull request** com melhorias
- Respeite o estilo de código (JavaScript vanilla, sem frameworks pesados)

## 📄 Licença

Projeto **MIT** — veja [LICENSE](LICENSE) ou use livremente com atribuição.

---

**Desenvolvido com ❤️ e prazer em 2026 | DevDaVez**
