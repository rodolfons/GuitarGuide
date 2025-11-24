# GuitarGuide

Projeto minimal: backend ASP.NET Core 8 + frontend Angular (na pasta `ClientApp`).

Objetivo: permitir cadastrar acordes e exibi-los similar a diagramas estilo Yousician.

Backend (ASP.NET Core):
- Projeto: `GuitarGuide` (arquivo `GuitarGuide.csproj`)
- Usa EF Core com `Pomelo.EntityFrameworkCore.MySql` e `EnsureCreated()` para criar DB automaticamente.
- Endpoints:
  - `GET /api/chords` - lista acordes
  - `POST /api/chords` - cria acorde (envie JSON com `name`, `positionsJson`, `description`)

Frontend (Angular minimal) está em `ClientApp`.

Requisitos:
- .NET 8 SDK
- Node.js + npm
- MySQL em execução (crie usuário/DB ou ajuste `appsettings.json`)

Como rodar (terminal 1: backend):
```bash
cd /Users/rodolfons/Documents/Dev/GuitarGuide
export ASPNETCORE_URLS="http://localhost:5000"
dotnet run
```

Como rodar (terminal 2: frontend):
```bash
cd /Users/rodolfons/Documents/Dev/GuitarGuide/ClientApp
npm install
npx ng serve --port 4200
```

Observações:
- Não usei Docker conforme solicitado.
- Atualize a connection string em `appsettings.json` com usuário/senha corretos.
- O frontend é um skeleton Angular funcional que chama a API e mostra diagramas simples de acordes.
