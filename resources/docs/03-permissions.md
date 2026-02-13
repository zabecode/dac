# Permissões

O sistema utiliza permissões baseadas em **módulos**. Cada API Key pode ser configurada com acesso a um ou mais módulos.

## Módulos Disponíveis

| Módulo        | Slug        | Descrição                      |
| ------------- | ----------- | ------------------------------ |
| Usuários      | `users`     | Gerenciamento de usuários      |
| Chaves de API | `api-keys`  | Gerenciamento de chaves de API |
| Dashboard     | `dashboard` | Acesso ao dashboard            |

> Novos módulos são adicionados conforme o sistema cresce. Consulte o painel para a lista atualizada.

## Como Funciona

1. Ao criar uma API Key, selecione os módulos necessários
2. Cada requisição à API verifica se a chave possui permissão para o módulo acessado
3. Caso a chave não tenha permissão, a resposta será `403 Forbidden`

## Verificação de Permissão

A verificação é feita automaticamente pelo middleware. Os controllers podem verificar permissões específicas:

```typescript
// No controller protegido por API Key
const apiKey = (ctx as any).apiKey

if (!apiKey.hasPermission('users')) {
  return ctx.response.forbidden({ error: 'Sem permissão para este módulo' })
}
```

## Boas Práticas

- **Princípio do menor privilégio**: conceda apenas as permissões necessárias
- **Uma chave por ambiente**: crie chaves separadas para produção e staging
- **Rotação periódica**: revogue e recrie chaves regularmente
- **Expiração**: sempre que possível, defina uma data de expiração
