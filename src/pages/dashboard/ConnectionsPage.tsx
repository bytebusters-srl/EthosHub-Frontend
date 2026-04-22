import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ExternalLink,
  Github,
  Linkedin,
  Link2,
  RefreshCw,
  Search,
  Unplug,
} from 'lucide-react';
import { Button, Card, Badge, EmptyState, Input, LoadingSpinner } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { useConnectionsStore } from '@/store/connectionsStore';
import { useUiStore } from '@/store/uiStore';
import { cn, formatDate } from '@/shared/lib/utils';
import type { OAuthConnection } from '@/shared/types';

export default function ConnectionsPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { addToast } = useUiStore();
  const { connections, loading, error, fetchConnections, reconnect, disconnect, syncAll } =
    useConnectionsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchConnections(user.id);
    }
  }, [fetchConnections, user?.id]);

  const filteredConnections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return connections;
    }

    return connections.filter((connection) => {
      return (
        connection.provider.toLowerCase().includes(normalizedQuery) ||
        connection.status.toLowerCase().includes(normalizedQuery) ||
        connection.apiHealth.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [connections, searchQuery]);

  const handleSyncAll = async () => {
    if (!user?.id) {
      return;
    }

    try {
      await syncAll(user.id);
      addToast({ type: 'success', title: 'Conexiones sincronizadas correctamente' });
    } catch {
      addToast({ type: 'error', title: 'No se pudieron sincronizar las conexiones' });
    }
  };

  const handleReconnect = async (connectionId: string) => {
    try {
      setActiveConnectionId(connectionId);
      await reconnect(connectionId);
      addToast({ type: 'success', title: 'Conexion restablecida' });
    } catch {
      addToast({ type: 'error', title: 'No se pudo reconectar esta integracion' });
    } finally {
      setActiveConnectionId(null);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      setActiveConnectionId(connectionId);
      await disconnect(connectionId);
      addToast({ type: 'success', title: 'Conexion desconectada' });
    } catch {
      addToast({ type: 'error', title: 'No se pudo desconectar esta integracion' });
    } finally {
      setActiveConnectionId(null);
    }
  };

  if (loading && connections.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('connections.title', 'Conexiones')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra tus integraciones con GitHub y LinkedIn desde un solo lugar.
          </p>
        </div>
        <Button onClick={handleSyncAll} disabled={!user?.id || loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sincronizar todo
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por proveedor, estado o salud de API"
            className="pl-10"
          />
        </div>
      </Card>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-foreground">No se pudieron cargar las conexiones</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {filteredConnections.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No hay conexiones disponibles"
          description="Todavia no hay integraciones conectadas para este usuario o la busqueda no devolvio resultados."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredConnections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ConnectionCard
                connection={connection}
                busy={activeConnectionId === connection.id}
                onReconnect={() => handleReconnect(connection.id)}
                onDisconnect={() => handleDisconnect(connection.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectionCard({
  connection,
  busy,
  onReconnect,
  onDisconnect,
}: {
  connection: OAuthConnection;
  busy: boolean;
  onReconnect: () => void;
  onDisconnect: () => void;
}) {
  const providerMeta = getProviderMeta(connection.provider);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              providerMeta.bgClass
            )}
          >
            <providerMeta.icon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">{providerMeta.label}</h2>
            <p className="text-sm text-muted-foreground">
              Estado actual: {formatConnectionStatus(connection.status)}
            </p>
          </div>
        </div>

        <Badge className={getHealthBadgeClass(connection.apiHealth)}>
          {getHealthLabel(connection.apiHealth)}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <InfoRow label="Proveedor" value={providerMeta.label} />
        <InfoRow label="API" value={getHealthLabel(connection.apiHealth)} />
        <InfoRow
          label="Ultima sincronizacion"
          value={connection.lastSynced ? formatDate(connection.lastSynced) : 'Sin sincronizar'}
        />
        <InfoRow
          label="Token expira"
          value={connection.tokenExpiresAt ? formatDate(connection.tokenExpiresAt) : 'Sin dato'}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={onReconnect}
          disabled={busy || connection.status === 'connected'}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reconectar
        </Button>
        <Button
          variant="ghost"
          onClick={onDisconnect}
          disabled={busy || connection.status === 'disconnected'}
        >
          <Unplug className="mr-2 h-4 w-4" />
          Desconectar
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.open(getProviderUrl(connection.provider), '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir proveedor
        </Button>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}

function getProviderMeta(provider: OAuthConnection['provider']) {
  if (provider === 'github') {
    return {
      label: 'GitHub',
      icon: Github,
      bgClass: 'bg-slate-900 text-white',
    };
  }

  return {
    label: 'LinkedIn',
    icon: Linkedin,
    bgClass: 'bg-sky-100 text-sky-700',
  };
}

function formatConnectionStatus(status: OAuthConnection['status']) {
  if (status === 'connected') return 'Conectada';
  if (status === 'disconnected') return 'Desconectada';
  return 'Expirada';
}

function getHealthLabel(health: OAuthConnection['apiHealth']) {
  if (health === 'healthy') return 'Saludable';
  if (health === 'degraded') return 'Degradada';
  return 'Caida';
}

function getHealthBadgeClass(health: OAuthConnection['apiHealth']) {
  if (health === 'healthy') {
    return 'bg-green-500/10 text-green-600';
  }
  if (health === 'degraded') {
    return 'bg-yellow-500/10 text-yellow-700';
  }
  return 'bg-red-500/10 text-red-600';
}

function getProviderUrl(provider: OAuthConnection['provider']) {
  return provider === 'github' ? 'https://github.com/settings/applications' : 'https://www.linkedin.com';
}
