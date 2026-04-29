#!/bin/bash
# CRCC — Inicia backend + dev server com um único comando
# Uso: ./start.sh
# Parar: Ctrl+C (encerra ambos os processos)

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_LOG="$ROOT/backend.log"
PORT_BACKEND=3000
PORT_DEV=3333

# ── Libera portas se já estiverem em uso ──────────────────────────────────────
for PORT in $PORT_BACKEND $PORT_DEV; do
  PID=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    echo "⚠️  Porta $PORT ocupada (PID $PID) — encerrando processo anterior..."
    kill "$PID" 2>/dev/null || true
    sleep 1
  fi
done

# ── Inicia backend ────────────────────────────────────────────────────────────
echo "▶  Iniciando backend na porta $PORT_BACKEND..."
cd "$ROOT/backend"
DATA_DIR=../app/data node server.js &>"$BACKEND_LOG" &
BACKEND_PID=$!

# Aguarda backend responder (até 10s)
echo -n "   Aguardando backend"
for i in $(seq 1 10); do
  sleep 1
  if curl -sf http://localhost:$PORT_BACKEND/api/health >/dev/null 2>&1; then
    echo " ✅"
    break
  fi
  echo -n "."
  if [ $i -eq 10 ]; then
    echo " ❌"
    echo "Erro ao iniciar backend. Veja $BACKEND_LOG"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
done

# ── Inicia dev server (proxy) ─────────────────────────────────────────────────
echo "▶  Iniciando dev server na porta $PORT_DEV..."
cd "$ROOT"
node devserver.js &
DEV_PID=$!

sleep 1
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⚡ CRCC rodando em http://localhost:$PORT_DEV"
echo "  Credenciais padrão:"
echo "    E-mail : admin@crcc.io"
echo "    Senha  : Admin@1234"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Pressione Ctrl+C para encerrar."
echo ""

# ── Encerra ambos ao Ctrl+C ───────────────────────────────────────────────────
trap "echo ''; echo 'Encerrando...'; kill $BACKEND_PID $DEV_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
