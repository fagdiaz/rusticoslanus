export interface UserAdminView {
  uid: string;
  email: string;
  displayName?: string | null;
  rol: 'admin' | 'operador' | 'cliente';
  activo: boolean;
  dni?: string;
}
