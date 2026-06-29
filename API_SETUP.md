# 🚀 Configuração de API Real - Copa 2026

Seu projeto agora suporta **dados em tempo real** da Copa 2026 via **API-Football**!

## 📋 Passo a Passo

### **1️⃣ Criar Conta no RapidAPI (Gratuito)**

1. Acesse: **https://rapidapi.com/api-sports/api/api-football**
2. Clique em **"Subscribe"** (plano gratuito disponível)
3. Faça login com Google, GitHub ou email
4. Você será redirecionado para seu dashboard

### **2️⃣ Pegar sua API Key**

1. Na página da API, procure por **"API Key"** ou **"X-RapidAPI-Key"**
2. Você verá sua chave (algo como: `abc123def456...`)
3. **Copie** a chave completa

### **3️⃣ Adicionar ao Projeto**

#### **Opção A: Para Desenvolvimento Local**

Edite `.env.local`:

```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api-football-v3.p.rapidapi.com
VITE_API_FOOTBALL_KEY=sua_api_key_aqui
VITE_ENABLE_API_FALLBACK=true
VITE_API_TIMEOUT_MS=12000
VITE_API_RETRY_ATTEMPTS=3
```

#### **Opção B: Para Vercel (Produção)**

1. Acesse seu projeto no Vercel: **https://vercel.com/dashboard**
2. Vá em **Settings → Environment Variables**
3. Adicione nova variável:
   - **Name**: `VITE_API_FOOTBALL_KEY`
   - **Value**: `sua_api_key_aqui`
   - **Environments**: Production / Preview / Development
4. Clique em **Save**
5. Redeploy seu projeto (Settings → Deployments → Redeploy)

### **4️⃣ Testar Localmente**

```bash
npm run dev
# Vai carregar dados REAIS da Copa 2026!
```

Você deve ver:
- ✅ Times reais da Copa 2026
- ✅ Jogos com resultados atualizados
- ✅ Classificações por grupo em tempo real

## 🎯 Como Funciona

```
Seu App
  ↓
  ├─ API-Football (dados reais) ✅
  │  ├─ Se sucesso: mostra dados reais em tempo real
  │  └─ Se falha: volta para mock data automaticamente
  └─ Mock Data (offline como backup)
```

## 📊 Dados Disponíveis

Com API-Football você terá acesso a:

| Dados | API-Football | Mock Data |
|-------|-------------|-----------|
| **Times** | ✅ Reais | ❌ Fictícios |
| **Jogos** | ✅ Em tempo real | ❌ Aleatórios |
| **Placar** | ✅ Ao vivo | ❌ Gerado |
| **Classificações** | ✅ Reais | ❌ Calculadas |
| **Jogadores** | ⚠️ Limitado* | ❌ Mock |
| **Estádios** | ✅ Reais | ❌ Fictícios |

*Jogadores: Requer plano premium

## 🔧 Plano Gratuito

- ✅ 100 requisições/dia
- ✅ Todos os endpoints de times, jogos, classificações
- ✅ Atualização em tempo real
- ❌ Endpoint de jogadores (requer Premium: $10/mês)

## ❌ Se Não Adicionar API Key

O app continuará funcionando com dados **Mock**:
- Dados fictícios mas consistentes
- Funciona 100% offline
- Perfeito para desenvolvimento e testes

## 🆘 Troubleshooting

### "API Key inválida"
- Verifique se copiou a chave corretamente
- Confirme que o plano está ativo
- Tente gerar nova chave no dashboard

### "Limite de requisições excedido"
- API-Football tem limite gratuito de 100/dia
- Considere fazer upgrade para Premium
- Ou use dados Mock: `VITE_USE_MOCK_API=true`

### "Erro de CORS"
- API-Football funciona através de RapidAPI
- CORS já está configurado automaticamente
- Se persistir, contate suporte RapidAPI

## 📞 Links Úteis

- API-Football: https://rapidapi.com/api-sports/api/api-football
- Documentação: https://rapidapi.com/api-sports/api/api-football/details
- RapidAPI: https://rapidapi.com
- Copa 2026: League ID = **679**

---

**Pronto! Seu app agora tem dados reais da Copa 2026 em tempo real!** 🏆
