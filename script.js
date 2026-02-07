
// URL do backend (ajuste conforme necessário)

const BACKEND_URL = 'http://localhost:3002'

async function cliqueiNoBotao() {
  let cidade = document.querySelector(".input-cidade").value
  let caixa = document.querySelector(".caixa-media")
  
  caixa.innerHTML = '<p>🔄 Carregando clima...</p>'

  try {
    const respostaServidor = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(cidade)}`)
    if (!respostaServidor.ok) {
      const erro = await respostaServidor.json()
      throw new Error(erro.error || `Erro ${respostaServidor.status}`)
    }
    
    const dadosjson = await respostaServidor.json()
    console.log(dadosjson)

    caixa.innerHTML = `
      <h2 class="cidade">${dadosjson.name}</h2>
      <p class="temperatura">${Math.floor(dadosjson.main.temp)} °C</p>
      <img class="icone-img" src="https://openweathermap.org/img/wn/${dadosjson.weather[0].icon}.png">
      <p class="umidade">Umidade do ar : ${dadosjson.main.humidity} %</p>
      <button class="botao-ia" onclick="pedirsugestaoRoupa()">Sugestão de Roupa</button>
      <p class="resposta-ia"></p>
    `
  } catch (err) {
    console.error(err)
    caixa.innerHTML = `<p style="color: red;">❌ Erro: ${err.message}</p>`
  }
}

/*------------------ Reconhecimento de voz ------------------*/

function detectaVoz() {
 /* alert("Clique em 'Permitir' microfone do seu dispositivo.")*/

  let reconhecimento = new window.webkitSpeechRecognition()
  reconhecimento.lang = "pt-BR"
  reconhecimento.start()

  reconhecimento.onresult = function (evento) {
    /*console.log(evento)*/

  let textoTranscrito = evento.results[0][0].transcript
  document.querySelector(".input-cidade").value = textoTranscrito
  cliqueiNoBotao()

  }

}

/*------------------ Integração com IA ------------------*/

// Limpa texto numérico: remove símbolos exceto dígitos, sinal de menos, vírgula e ponto.
// Normaliza vírgula para ponto para suportar decimais.
function limparNumero(texto) {
  if (!texto) return ''
  let s = String(texto).replace(/[^-\d.,]/g, '')
  s = s.replace(/,/g, '.')
  return s
}

async function pedirsugestaoRoupa() {
  const respostaIaEl = document.querySelector(".resposta-ia")
  respostaIaEl.innerHTML = '<p>🤖 Gerando sugestão...</p>'

  let temperaturaText = document.querySelector(".temperatura").textContent
  let umidadeText = document.querySelector(".umidade").textContent
  let cidade = document.querySelector(".cidade").textContent
  
  let temperatura = parseFloat(limparNumero(temperaturaText))
  let umidade = parseInt(limparNumero(umidadeText), 10)
  
  if (isNaN(temperatura) || isNaN(umidade)) {
    respostaIaEl.innerHTML = '<p style="color: red;">❌ Erro ao extrair temperatura/umidade. Tente novamente.</p>'
    return
  }
  
  console.log(temperatura, umidade, cidade)

  try {
    const resposta = await fetch(`${BACKEND_URL}/ai/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        temperature: temperatura,
        humidity: umidade,
        city: cidade
      })
    })

    if (!resposta.ok) {
      const erro = await resposta.json()
      const msg = erro?.error?.message || erro?.error || JSON.stringify(erro)
      throw new Error(msg)
    }

    const dados = await resposta.json()
    console.log(dados)

    const conteudo = dados.content || "Sugestão não disponível"
    respostaIaEl.innerHTML = `<p>${conteudo}</p>`
  } catch (err) {
    console.error(err)
    respostaIaEl.innerHTML = `<p style="color: red;">❌ Erro na IA: ${err.message}</p>`
  }
}


