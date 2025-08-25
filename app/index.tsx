import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirecionar para login (em produção, verificar se usuário está logado)
    router.replace('/auth/login');
  }, []);

  return null;
}