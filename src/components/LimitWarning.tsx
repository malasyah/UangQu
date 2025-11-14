import { useEffect, useState } from 'react';
import { checkLimitViolations } from '../services/limitService';
import WarningAnimation from './WarningAnimation';

interface LimitWarningProps {
  userId: string | undefined;
  enabled?: boolean;
}

export default function LimitWarning({ userId, enabled = true }: LimitWarningProps) {
  const [violations, setViolations] = useState<any[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!userId || !enabled) return;

    const checkViolations = async () => {
      try {
        const data = await checkLimitViolations(userId);
        const activeViolations = data.filter((v) => v.is_violated);
        setViolations(activeViolations);
        setShowWarning(activeViolations.length > 0);
      } catch (error) {
        console.error('Error checking limit violations:', error);
      }
    };

    checkViolations();
    const interval = setInterval(checkViolations, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId, enabled]);

  if (violations.length === 0) return null;

  const violationMessages = violations.map((v) => {
    const period = v.period_type;
    const spent = v.current_spending.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
    const limit = v.limit_amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
    return `Your ${period} limit of ${limit} has been exceeded! You've spent ${spent}.`;
  });

  return (
    <WarningAnimation
      show={showWarning}
      message={violationMessages[0] || 'Spending limit exceeded!'}
      onClose={() => setShowWarning(false)}
    />
  );
}

