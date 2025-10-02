## LibreChat Provider Setup (CadetAI)

This config enables ChatGPT (OpenAI), Claude (Anthropic), and Perplexity in the Cadet chat bar via `librechat.yaml`.

### 1) Environment variables
Set these in your environment (e.g., `.env.local`, Vercel, or your host):

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=ppx-...
NEXT_PUBLIC_LIBRECHAT_API_ENDPOINT=https://your-librechat.example.com/api
```

### 2) YAML configuration
`librechat.yaml` is at the project root. It defines three endpoints:
- `openai` (default model: `gpt-4o-mini`)
- `anthropic` (default model: `claude-3-5-sonnet-latest`)
- `perplexity` (default model: `llama-3.1-sonar-small-128k-online`)

You can edit allowed models or defaults as needed.

### 3) Point LibreChat to the YAML
If you're running a self-hosted LibreChat server, set its config path to this file or mount it into the container, depending on your deployment. Typical approaches:
- CLI flag or env var supported by your LibreChat deployment to specify the YAML path
- Mount `librechat.yaml` into the path LibreChat reads by default

### 4) Using in Cadet Chat
`lib/librechat.ts` currently uses an in-memory client. To route through LibreChat providers:
- Ensure your LibreChat API server is reachable and `NEXT_PUBLIC_LIBRECHAT_API_ENDPOINT` is set.
- Update `defaultModel` or pick models per chat where appropriate. The YAML controls available models and defaults.

### 5) Notes
- Perplexity online models are great for grounded browsing; temp defaults are conservative.
- Adjust token limits to fit your account plan.
