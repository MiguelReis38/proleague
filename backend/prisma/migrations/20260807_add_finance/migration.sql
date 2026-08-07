-- Adiciona campos de assinatura ao Mercado Pago na tabela Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "mercadoPagoId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3);

-- Cria tabela de mensalidades dos jogadores
CREATE TABLE IF NOT EXISTS "PlayerFee" (
  "id"             TEXT NOT NULL,
  "amount"         DOUBLE PRECISION NOT NULL,
  "dueDate"        TIMESTAMP(3) NOT NULL,
  "paidAt"         TIMESTAMP(3),
  "note"           TEXT,
  "championshipId" TEXT NOT NULL,
  "playerId"       TEXT NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlayerFee_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PlayerFee" DROP CONSTRAINT IF EXISTS "PlayerFee_championshipId_fkey";
ALTER TABLE "PlayerFee" ADD CONSTRAINT "PlayerFee_championshipId_fkey"
  FOREIGN KEY ("championshipId") REFERENCES "Championship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerFee" DROP CONSTRAINT IF EXISTS "PlayerFee_playerId_fkey";
ALTER TABLE "PlayerFee" ADD CONSTRAINT "PlayerFee_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Cria tabela de despesas do campeonato
CREATE TABLE IF NOT EXISTS "Expense" (
  "id"             TEXT NOT NULL,
  "description"    TEXT NOT NULL,
  "amount"         DOUBLE PRECISION NOT NULL,
  "date"           TIMESTAMP(3) NOT NULL,
  "category"       TEXT NOT NULL DEFAULT 'OTHER',
  "championshipId" TEXT NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Expense" DROP CONSTRAINT IF EXISTS "Expense_championshipId_fkey";
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_championshipId_fkey"
  FOREIGN KEY ("championshipId") REFERENCES "Championship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
