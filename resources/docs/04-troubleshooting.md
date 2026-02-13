# Troubleshooting

Guia para resolver problemas comuns na integração com a API.

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

1. Edite a chave no painel e adicione o módulo necessário nas **permissões**

### 429 — Too Many Requests

**Causa:**

- Rate limit excedido

**Solução:**

- Aguarde antes de enviar novas requisições
- Implemente backoff exponencial no seu cliente

### 422 — Validation Error

**Causa:**

- Dados enviados não passaram na validação

**Solução:**

- Verifique o corpo da requisição conforme a documentação do endpoint
- Os campos com erro serão listados na resposta

## Teste com cURL

```bash
# Testar autenticação
curl -v https://seu-dominio.com/api/v1/recurso \
  -H "Authorization: Bearer SUA_API_KEY" \
  -H "Content-Type: application/json"
```

## Suporte

Para problemas não cobertos nesta documentação, entre em contato: **suporte@zabe.ai**
