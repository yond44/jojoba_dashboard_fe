import { useCallback, useEffect, useRef, useState } from "react";
import { api, unwrap } from "../lib/api.js";

export function useApiQuery(path, params, options = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled && path));
  const serializedParams = JSON.stringify(params || {});
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!enabled || !path) return;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);
    try {
      const payload = await api.get(path, JSON.parse(serializedParams));
      if (requestIdRef.current === requestId) {
        setData(unwrap(payload));
      }
    } catch (caught) {
      if (requestIdRef.current === requestId) {
        setError(caught);
        setData(null);
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [path, serializedParams, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
