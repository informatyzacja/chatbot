<br />

<h1 align="center">
  Chatbot 
</h1>
<p align="center">
  Facebook chatbot with admin panel.
</p>

<p align="center">
  <a href="https://github.com/informatyzacja/chatbot/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/informatyzacja/chatbot/ci.yml" alt="GitHub Workflow Status" />
  </a>
  <a href="https://github.com/informatyzacja/chatbot/releases">
    <img src="https://img.shields.io/github/package-json/v/informatyzacja/chatbot?filename=package.json" alt="GitHub package.json version" />
  </a>
  <a href="https://github.com/informatyzacja/chatbot/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/informatyzacja/chatbot" alt="License" />
  </a>
</p>

## Getting started

### Installation

```shell
git clone https://github.com/informatyzacja/chatbot.git
cd chatbot
pnpm install --frozen-lockfile
```

### Requirements

#### Development

- Volta

#### Production

- Docker Compose

## Usage

Copy env file:

```bash
cp .env.example .env
```

Run in development mode:

```bash
pnpm dev
```

In a second terminal:

```bash
pnpm db:push
```

## Contributing

If you're having problems with running this project, feel free to create an issue!

Currently this project is maintained by a group of people chosen by Commission for IT of WUST's Students' Union and is not accepting pull requests from the outside.

## License

See the [LICENSE](./LICENSE) file for licensing information.
