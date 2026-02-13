# Autenticação

Todas as requisições à API devem ser autenticadas usando uma **API Key** no header `Authorization`.

## Formato

```
Authorization: Bearer <SUA_API_KEY>
```

## Criando uma API Key

1. Acesse o painel administrativo em **Chaves de API**
2. Clique em **Nova Chave**
3. Preencha os campos:
   - **Nome**: identificação interna da chave (ex: "Produção")
   - **Identificador**: o proprietário da chave (ex: "Empresa X", "Cliente Y")
   - **Permissões**: selecione os módulos que a chave terá acesso
   - **Expiração**: (opcional) data limite de validade
4. A chave será exibida **apenas uma vez** — copie e guarde em local seguro

## Segurança

- As chaves são armazenadas com hash (nunca em texto puro)
- Cada chave possui um prefixo de 8 caracteres para identificação
- Chaves expiradas ou desativadas são rejeitadas automaticamente
- O identificador da chave é carregado no contexto de cada requisição

## Identificador no Contexto

Quando uma requisição é autenticada via API Key, o **identificador** (cliente/empresa) é automaticamente carregado no contexto. Isso permite que os endpoints escopem dados com base no proprietário da chave.

```
ctx.apiKeyIdentifier → "Empresa X"
```

## Exemplo com cURL

```bash
curl -X GET https://seu-dominio.com/api/v1/recurso \
  -H "Authorization: Bearer sk_live_abc123..." \
  -H "Content-Type: application/json"
```

## Erros de Autenticação

| Erro                         | Causa                                  | Solução                                      |
| ---------------------------- | -------------------------------------- | -------------------------------------------- |
| `Missing API Key`            | Header Authorization ausente           | Adicione o header com Bearer token           |
| `Invalid or expired API Key` | Chave inválida, expirada ou desativada | Verifique a chave no painel ou crie uma nova |
