export const BIG_ASS_SAMPLE_QUERY = `WITH monthly_usage AS (
  SELECT
    customer_id,
    product_category,
    EXTRACT(YEAR FROM session_start_time) AS year,
    EXTRACT(MONTH FROM session_start_time) AS month,
    COUNT(DISTINCT session_id) AS total_sessions,
    ROUND(AVG(session_duration_seconds), 2) AS avg_session_duration,
    SUM(purchase_amount_usd) AS monthly_revenue
  FROM
    user_activity_logs
  WHERE
    session_start_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
    AND purchase_amount_usd IS NOT NULL
  GROUP BY
    customer_id,
    product_category,
    year,
    month
),

revenue_trend AS (
  SELECT
    customer_id,
    SUM(monthly_revenue) AS total_revenue_12mo,
    ROUND(
      (MAX(monthly_revenue) - MIN(monthly_revenue)) / NULLIF(MIN(monthly_revenue), 0),
      2
    ) AS revenue_growth_ratio
  FROM monthly_usage
  GROUP BY customer_id
),

churn_risk_scores AS (
  SELECT
    customer_id,
    MAX(DATE_DIFF(CURRENT_DATE(), MAX(session_start_time), DAY)) AS days_since_last_active,
    CASE
      WHEN MAX(DATE_DIFF(CURRENT_DATE(), MAX(session_start_time), DAY)) > 90 THEN 'HIGH'
      WHEN MAX(DATE_DIFF(CURRENT_DATE(), MAX(session_start_time), DAY)) > 30 THEN 'MEDIUM'
      ELSE 'LOW'
    END AS churn_risk
  FROM user_activity_logs
  GROUP BY customer_id
),

final_aggregated_view AS (
  SELECT
    r.customer_id,
    r.total_revenue_12mo,
    r.revenue_growth_ratio,
    c.churn_risk,
    u.product_category,
    u.month,
    u.total_sessions,
    u.avg_session_duration,
    u.monthly_revenue
  FROM revenue_trend r
  JOIN churn_risk_scores c ON r.customer_id = c.customer_id
  JOIN monthly_usage u ON r.customer_id = u.customer_id
)

SELECT
  customer_id,
  churn_risk,
  ROUND(total_revenue_12mo, 2) AS revenue_last_12_months,
  ROUND(revenue_growth_ratio * 100, 2) AS revenue_growth_pct,
  ARRAY_AGG(
    STRUCT(
      product_category,
      month,
      total_sessions,
      avg_session_duration,
      monthly_revenue
    )
    ORDER BY month
  ) AS usage_trend
FROM final_aggregated_view
GROUP BY customer_id, churn_risk, total_revenue_12mo, revenue_growth_ratio
ORDER BY revenue_growth_ratio DESC
LIMIT 10;`;