# SEO técnico — configuração de produção

Origem atual preservada: `https://mineirolanchesabaetee.lovable.app`.

O endereço futuro `https://mineirolanchesabaete.vercel.app` **não está ativado**.
Nenhuma alteração de hospedagem, publicação ou conta externa foi realizada.

Após publicar e verificar manualmente a nova origem, configurar no ambiente de build:

```text
VITE_SEO_PRODUCTION_ORIGIN=https://mineirolanchesabaete.vercel.app
VITE_SEO_ORIGIN_VERIFIED=true
```

Atualizar também a diretiva `Sitemap:` de `public/robots.txt` para essa mesma origem.
Sem confirmação explícita (`true`), ou com uma URL inválida, a configuração conserva
o endereço Lovable atual. Não usa o domínio customizado desativado nem a prévia.

O sitemap inclui somente `/`, sem datas `lastmod` inventadas. `/auth` e `/conta`
são excluídos e recebem `noindex, follow` em seus próprios metadados.
As respostas HTTP dessas rotas também recebem `X-Robots-Tag: noindex, follow`,
inclusive quando a área privada ainda não foi renderizada no navegador.
O robots permite leitura dessas páginas para que o Google possa reconhecer o
`noindex`; `Disallow` não garante remoção dos resultados de busca.

O schema Restaurant e seus dados foram preservados. Os metadados de imagem
existentes foram apenas movidos para a página inicial, sem trocar suas URLs.

## Verificações

- Prévia local: página inicial, robots e sitemap respondem 200; XML contém apenas
  a página inicial; canonical único e og:url usam a origem Lovable atual.
- Texto visível, imagens, folhas de estilo e schema Restaurant comparados antes/depois: iguais.
- /auth e /conta: cabeçalho HTTP noindex confirmado; /auth também tem meta noindex.
  O redirecionamento existente de /conta sem sessão para /auth foi preservado.
- Compilação automática: sem erros após a correção das declarações dos testes.
- Endereço Lovable atual: respondeu 200. Futuro endereço Vercel: respondeu 404
  e permaneceu desativado na configuração.
- Navegação de teste registrou aviso de hidratação em /auth. A lógica de login
  e sua renderização não foram modificadas nem investigadas além do escopo SEO.
- Não foi verificada indexação real no Google, nem uma execução publicada dessas
  alterações. Nenhuma publicação, configuração de hospedagem ou conexão externa
  foi realizada. Login autenticado, checkout e migração para Vercel não foram testados.