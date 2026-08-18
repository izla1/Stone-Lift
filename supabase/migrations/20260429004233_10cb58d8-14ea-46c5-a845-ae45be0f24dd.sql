UPDATE site_settings
SET value = jsonb_set(value, '{mapEmbed}', '"https://www.google.com/maps?q=StoneLift+%D9%84%D8%AA%D9%88%D8%B1%D9%8A%D8%AF+%D9%88%D8%AA%D8%B1%D9%83%D9%8A%D8%A8+%D8%A7%D9%84%D9%85%D8%B5%D8%A7%D8%B9%D8%AF&hl=en&t=m&z=16&ll=30.084924,31.3368674&output=embed"'::jsonb), updated_at = now()
WHERE key='contact';