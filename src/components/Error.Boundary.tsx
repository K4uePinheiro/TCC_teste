// src/components/ErrorBoundary.tsx
import React from "react";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
  return { hasError: true };
}
  

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aqui você pode logar o erro em algum serviço externo
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI fallback quando algum erro acontece
      return <h1 className="flex items-center">Ocorreu um erro no aplicativo.</h1>;
    }

    // Renderiza os componentes filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
