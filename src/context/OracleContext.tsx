import { createContext, useContext, type ReactNode } from 'react';
import { useOracleMachine, type OracleMachine } from '../hooks/useOracleMachine';

const OracleContext = createContext<OracleMachine | null>(null);

export function OracleProvider({ children }: { children: ReactNode }) {
  const machine = useOracleMachine();
  return (
    <OracleContext.Provider value={machine}>{children}</OracleContext.Provider>
  );
}

export function useOracle(): OracleMachine {
  const ctx = useContext(OracleContext);
  if (!ctx) {
    throw new Error('useOracle must be used within OracleProvider');
  }
  return ctx;
}
