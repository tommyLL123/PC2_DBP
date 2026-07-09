export type AlertTone = 'success' | 'error' | 'info';

const TONE_CLASSES: Record<AlertTone, string> = {
  success: 'notice notice-success',
  error: 'notice notice-error',
  info: 'notice notice-info'
};

export function Alert({ tone, children }: { tone: AlertTone; children: React.ReactNode }) {
  return (
    <div role="alert" className={TONE_CLASSES[tone]}>
      {children}
    </div>
  );
}
