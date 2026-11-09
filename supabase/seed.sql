insert into public.countries(code,name_it,name_en,flag,sort_order) values
('IT','Italia','Italy','🇮🇹',1),('JP','Giappone','Japan','🇯🇵',2),('MX','Messico','Mexico','🇲🇽',3),
('FR','Francia','France','🇫🇷',4),('IN','India','India','🇮🇳',5),('TH','Thailandia','Thailand','🇹🇭',6),
('CN','Cina','China','🇨🇳',7),('TR','Turchia','Turkey','🇹🇷',8),('MA','Marocco','Morocco','🇲🇦',9),
('BR','Brasile','Brazil','🇧🇷',10) on conflict(code) do nothing;
