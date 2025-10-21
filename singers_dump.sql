--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-10-21 17:44:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24832)
-- Name: albumi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.albumi (
    id integer NOT NULL,
    pjevac_id integer,
    naziv_albuma character varying(100) NOT NULL,
    godina_izdanja integer,
    izdavacka_kuca character varying(100),
    broj_pjesama integer,
    trajanje_minuta integer
);


ALTER TABLE public.albumi OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24831)
-- Name: albumi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.albumi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.albumi_id_seq OWNER TO postgres;

--
-- TOC entry 4798 (class 0 OID 0)
-- Dependencies: 217
-- Name: albumi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.albumi_id_seq OWNED BY public.albumi.id;


--
-- TOC entry 216 (class 1259 OID 24825)
-- Name: pjevaci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pjevaci (
    id integer NOT NULL,
    ime_prezime character varying(100) NOT NULL,
    nadimak character varying(50),
    datum_rodjenja date,
    mjesto_rodjenja character varying(100),
    zanr character varying(50),
    aktivan_od integer,
    broj_nagrada integer,
    broj_albuma integer,
    najpoznatije_pjesma character varying(100),
    drzava_podrijetla character varying(50)
);


ALTER TABLE public.pjevaci OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24824)
-- Name: pjevaci_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pjevaci_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pjevaci_id_seq OWNER TO postgres;

--
-- TOC entry 4799 (class 0 OID 0)
-- Dependencies: 215
-- Name: pjevaci_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pjevaci_id_seq OWNED BY public.pjevaci.id;


--
-- TOC entry 4640 (class 2604 OID 24835)
-- Name: albumi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albumi ALTER COLUMN id SET DEFAULT nextval('public.albumi_id_seq'::regclass);


--
-- TOC entry 4639 (class 2604 OID 24828)
-- Name: pjevaci id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pjevaci ALTER COLUMN id SET DEFAULT nextval('public.pjevaci_id_seq'::regclass);


--
-- TOC entry 4792 (class 0 OID 24832)
-- Dependencies: 218
-- Data for Name: albumi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.albumi (id, pjevac_id, naziv_albuma, godina_izdanja, izdavacka_kuca, broj_pjesama, trajanje_minuta) FROM stdin;
1	1	1989	2014	Big Machine	13	49
2	1	Lover	2019	Republic	18	61
3	2	÷ (Divide)	2017	Asylum	12	46
4	2	x (Multiply)	2014	Asylum	12	50
5	3	Thank U, Next	2019	Republic	12	41
6	3	Positions	2020	Republic	14	41
7	4	24K Magic	2016	Atlantic	9	33
8	5	When We All Fall Asleep	2019	Darkroom	14	43
9	6	Illuminate	2016	Island	13	45
10	7	Future Nostalgia	2020	Warner	11	37
11	8	Fine Line	2019	Columbia	12	46
12	9	Purpose	2015	Def Jam	13	48
13	10	The Fame	2008	Interscope	15	50
\.


--
-- TOC entry 4790 (class 0 OID 24825)
-- Dependencies: 216
-- Data for Name: pjevaci; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pjevaci (id, ime_prezime, nadimak, datum_rodjenja, mjesto_rodjenja, zanr, aktivan_od, broj_nagrada, broj_albuma, najpoznatije_pjesma, drzava_podrijetla) FROM stdin;
1	Taylor Swift	T-Swizzle	1989-12-13	Reading, Pennsylvania	Pop	2006	546	10	Shake It Off	SAD
2	Ed Sheeran	Ed	1991-02-17	Halifax, West Yorkshire	Pop	2005	159	7	Shape of You	UK
3	Ariana Grande	Ari	1993-06-26	Boca Raton, Florida	Pop/R&B	2008	202	7	Thank U, Next	SAD
4	Bruno Mars	Bruno	1985-10-08	Honolulu, Hawaii	Pop/R&B	2004	126	4	Uptown Funk	SAD
5	Billie Eilish	Billie	2001-12-18	Los Angeles, California	Pop	2015	89	2	Bad Guy	SAD
6	Shawn Mendes	Shawn	1998-08-08	Toronto, Ontario	Pop	2013	67	4	Señorita	Kanada
7	Dua Lipa	Dua	1995-08-22	London	Pop	2014	45	2	New Rules	UK
8	Harry Styles	Harry	1994-02-01	Redditch, Worcestershire	Pop/Rock	2010	78	3	Watermelon Sugar	UK
9	Justin Bieber	JB	1994-03-01	London, Ontario	Pop	2007	224	6	Sorry	Kanada
10	Lady Gaga	Gaga	1986-03-28	New York City, New York	Pop	2005	315	6	Bad Romance	SAD
\.


--
-- TOC entry 4800 (class 0 OID 0)
-- Dependencies: 217
-- Name: albumi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.albumi_id_seq', 13, true);


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 215
-- Name: pjevaci_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pjevaci_id_seq', 10, true);


--
-- TOC entry 4644 (class 2606 OID 24837)
-- Name: albumi albumi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albumi
    ADD CONSTRAINT albumi_pkey PRIMARY KEY (id);


--
-- TOC entry 4642 (class 2606 OID 24830)
-- Name: pjevaci pjevaci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pjevaci
    ADD CONSTRAINT pjevaci_pkey PRIMARY KEY (id);


--
-- TOC entry 4645 (class 2606 OID 24838)
-- Name: albumi albumi_pjevac_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albumi
    ADD CONSTRAINT albumi_pjevac_id_fkey FOREIGN KEY (pjevac_id) REFERENCES public.pjevaci(id);


-- Completed on 2025-10-21 17:45:01

--
-- PostgreSQL database dump complete
--

