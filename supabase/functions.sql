-- Function to calculate current period balance
CREATE OR REPLACE FUNCTION get_period_balance(
  p_user_id UUID,
  p_period_type VARCHAR,
  p_start_date DATE DEFAULT CURRENT_DATE
)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
  v_balance DECIMAL(15, 2) := 0;
  v_start_date DATE;
  v_end_date DATE;
BEGIN
  -- Calculate date range based on period type
  CASE p_period_type
    WHEN 'daily' THEN
      v_start_date := p_start_date;
      v_end_date := p_start_date;
    WHEN 'weekly' THEN
      v_start_date := DATE_TRUNC('week', p_start_date)::DATE;
      v_end_date := v_start_date + INTERVAL '6 days';
    WHEN 'monthly' THEN
      v_start_date := DATE_TRUNC('month', p_start_date)::DATE;
      v_end_date := (DATE_TRUNC('month', p_start_date) + INTERVAL '1 month - 1 day')::DATE;
    ELSE
      RAISE EXCEPTION 'Invalid period_type: %', p_period_type;
  END CASE;

  -- Calculate balance (income - expense)
  SELECT COALESCE(SUM(
    CASE 
      WHEN type = 'income' THEN amount
      WHEN type = 'expense' THEN -amount
      ELSE 0
    END
  ), 0)
  INTO v_balance
  FROM transactions
  WHERE user_id = p_user_id
    AND date >= v_start_date
    AND date <= v_end_date;

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check limit violations
CREATE OR REPLACE FUNCTION check_limit_violations(
  p_user_id UUID
)
RETURNS TABLE (
  limit_id UUID,
  limit_amount DECIMAL(15, 2),
  current_spending DECIMAL(15, 2),
  period_type VARCHAR,
  category_id UUID,
  is_violated BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH period_spending AS (
    SELECT 
      l.id as limit_id,
      l.amount as limit_amount,
      l.period_type,
      l.category_id,
      l.start_date,
      COALESCE(SUM(t.amount), 0) as current_spending
    FROM limits l
    LEFT JOIN transactions t ON 
      t.user_id = l.user_id
      AND t.type = 'expense'
      AND (
        l.category_id IS NULL OR t.category_id = l.category_id
      )
      AND (
        CASE l.period_type
          WHEN 'daily' THEN t.date = CURRENT_DATE
          WHEN 'weekly' THEN t.date >= DATE_TRUNC('week', CURRENT_DATE)::DATE 
            AND t.date <= (DATE_TRUNC('week', CURRENT_DATE)::DATE + INTERVAL '6 days')
          WHEN 'monthly' THEN t.date >= DATE_TRUNC('month', CURRENT_DATE)::DATE 
            AND t.date <= (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
        END
      )
    WHERE l.user_id = p_user_id
    GROUP BY l.id, l.amount, l.period_type, l.category_id, l.start_date
  )
  SELECT 
    ps.limit_id,
    ps.limit_amount,
    ps.current_spending,
    ps.period_type,
    ps.category_id,
    (ps.current_spending > ps.limit_amount) as is_violated
  FROM period_spending ps;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for transaction summaries by period
CREATE OR REPLACE VIEW transaction_summaries AS
SELECT 
  user_id,
  DATE_TRUNC('month', date)::DATE as period_start,
  'monthly' as period_type,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance,
  COUNT(*) as transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date)::DATE;

-- Grant access to the view
GRANT SELECT ON transaction_summaries TO authenticated;

