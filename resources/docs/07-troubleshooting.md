# Troubleshooting

Guia para resolver problemas comuns na integração com a API DAC.

## Erros HTTP

### 401 — Unauthorized

**Causas possíveis:**

- API Key ausente no header `Authorization`
- Formato incorreto (deve ser `Bearer <chave>`)
- Chave inválida ou não encontrada
- Chave expirada
- Chave desativada pelo administrador

**Solução:**

1. Verifique se a chave está no formato correto: `Authorization: Bearer sk_...`
2. Confirme no painel que a chave está **ativa**
3. Verifique a data de **expiração** da chave
4. Se necessário, crie uma nova chave

### 403 — Forbidden

**Causas possíveis:**

- A API Key não possui permissão para o módulo acessado

**Solução:**

1. Edite a chave no painel e adicione o módulo necessário (`devices`, `sensors` ou `readings`)

### 404 — Not Found

**Causas possíveis:**

- O recurso não existe
- O recurso pertence a outro identifier (multi-tenancy)

**Solução:**

1. Verifique o ID do recurso
2. Confirme que está usando a API Key correta (o identifier filtra os dados)

### 422 — Validation Error

**Causa:**

- Dados enviados não passaram na validação

**Solução:**

- Verifique o corpo da requisição conforme a documentação do endpoint
- Campos comuns que causam erro:
  - `mac` (máx. 17 chars)
  - `code` (deve ser ≥ 1)
  - `datetime` (formato ISO obrigatório)
  - `sensorId` / `deviceId` (devem existir)

### 429 — Too Many Requests

**Causa:**

- Rate limit excedido

**Solução:**

- Aguarde antes de enviar novas requisições
- Implemente backoff exponencial no seu cliente
- Para envios em massa, use os endpoints de gateway (`/dac/devices/publish` e `/dac/readings/batch`)

## Problemas Comuns

### Dados não aparecendo

- Verifique se está usando a API Key com o **identifier** correto
- Cada identifier tem seus dados isolados

### Gateway publish não cria sensores

- O array `sensors` deve estar dentro do objeto raiz junto com `device`
- Cada sensor precisa de um `code` numérico único

### Batch readings com erros parciais

- O endpoint `/dac/readings/batch` processa item a item
- A resposta `errors` indica quantos itens falharam
- Registros com `uniqueId` duplicado são **atualizados** (não duplicados)

## Teste com cURL

```bash
# Testar autenticação
curl -v https://seu-dominio.com/api/v1/devices \
  -H "Authorization: Bearer SUA_API_KEY" \
  -H "Content-Type: application/json"

# Publicar dispositivo via gateway
curl -X POST https://seu-dominio.com/api/v1/dac/devices/publish \
  -H "Authorization: Bearer SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "device": { "mac": "AA:BB:CC:DD:EE:FF", "ip": "192.168.1.1" },
    "sensors": [{ "code": 101, "name": "Temp", "kind": "modbus" }]
  }'

# Publicar leituras em lote
curl -X POST https://seu-dominio.com/api/v1/dac/readings/batch \
  -H "Authorization: Bearer SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "readings": [
      { "sensorId": 1, "value": 23.5, "datetime": "2025-01-15T10:30:00Z" }
    ]
  }'
```

## Suporte

Para problemas não cobertos nesta documentação, entre em contato: **suporte@zabe.ai**
