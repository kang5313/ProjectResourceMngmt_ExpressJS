PGDMP         $                w            ProjectResourceMngmt    11.4    11.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false                       1262    16772    ProjectResourceMngmt    DATABASE     �   CREATE DATABASE "ProjectResourceMngmt" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_Malaysia.1252' LC_CTYPE = 'English_Malaysia.1252';
 &   DROP DATABASE "ProjectResourceMngmt";
             postgres    false            �            1259    16785    project    TABLE     H  CREATE TABLE public.project (
    project_id integer NOT NULL,
    project_name character varying(100) NOT NULL,
    role_name character varying(30) NOT NULL,
    check_in_time timestamp with time zone NOT NULL,
    check_out_time timestamp with time zone,
    cal_session integer NOT NULL,
    grace_period integer NOT NULL
);
    DROP TABLE public.project;
       public         postgres    false            �            1259    16783    project_project_id_seq    SEQUENCE     �   CREATE SEQUENCE public.project_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.project_project_id_seq;
       public       postgres    false    198                       0    0    project_project_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.project_project_id_seq OWNED BY public.project.project_id;
            public       postgres    false    197            �            1259    49554    resource_usage    TABLE     �   CREATE TABLE public.resource_usage (
    record_id integer NOT NULL,
    project_id integer NOT NULL,
    rate double precision NOT NULL,
    res_usage double precision NOT NULL
);
 "   DROP TABLE public.resource_usage;
       public         postgres    false            �            1259    49552    resource_usage_project_id_seq    SEQUENCE     �   CREATE SEQUENCE public.resource_usage_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.resource_usage_project_id_seq;
       public       postgres    false    201                       0    0    resource_usage_project_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.resource_usage_project_id_seq OWNED BY public.resource_usage.project_id;
            public       postgres    false    200            �            1259    49550    resource_usage_record_id_seq    SEQUENCE     �   CREATE SEQUENCE public.resource_usage_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.resource_usage_record_id_seq;
       public       postgres    false    201                       0    0    resource_usage_record_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.resource_usage_record_id_seq OWNED BY public.resource_usage.record_id;
            public       postgres    false    199            �            1259    16778    role    TABLE     o   CREATE TABLE public.role (
    role_name character varying(30) NOT NULL,
    rate double precision NOT NULL
);
    DROP TABLE public.role;
       public         postgres    false            �
           2604    16788    project project_id    DEFAULT     x   ALTER TABLE ONLY public.project ALTER COLUMN project_id SET DEFAULT nextval('public.project_project_id_seq'::regclass);
 A   ALTER TABLE public.project ALTER COLUMN project_id DROP DEFAULT;
       public       postgres    false    197    198    198            �
           2604    49557    resource_usage record_id    DEFAULT     �   ALTER TABLE ONLY public.resource_usage ALTER COLUMN record_id SET DEFAULT nextval('public.resource_usage_record_id_seq'::regclass);
 G   ALTER TABLE public.resource_usage ALTER COLUMN record_id DROP DEFAULT;
       public       postgres    false    201    199    201            �
           2604    49558    resource_usage project_id    DEFAULT     �   ALTER TABLE ONLY public.resource_usage ALTER COLUMN project_id SET DEFAULT nextval('public.resource_usage_project_id_seq'::regclass);
 H   ALTER TABLE public.resource_usage ALTER COLUMN project_id DROP DEFAULT;
       public       postgres    false    200    201    201                      0    16785    project 
   TABLE DATA               �   COPY public.project (project_id, project_name, role_name, check_in_time, check_out_time, cal_session, grace_period) FROM stdin;
    public       postgres    false    198                    0    49554    resource_usage 
   TABLE DATA               P   COPY public.resource_usage (record_id, project_id, rate, res_usage) FROM stdin;
    public       postgres    false    201   4                 0    16778    role 
   TABLE DATA               /   COPY public.role (role_name, rate) FROM stdin;
    public       postgres    false    196   Q                  0    0    project_project_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.project_project_id_seq', 8, true);
            public       postgres    false    197                       0    0    resource_usage_project_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.resource_usage_project_id_seq', 1, false);
            public       postgres    false    200                       0    0    resource_usage_record_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.resource_usage_record_id_seq', 37, true);
            public       postgres    false    199            �
           2606    16790    project project_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);
 >   ALTER TABLE ONLY public.project DROP CONSTRAINT project_pkey;
       public         postgres    false    198            �
           2606    49560 "   resource_usage resource_usage_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.resource_usage
    ADD CONSTRAINT resource_usage_pkey PRIMARY KEY (record_id);
 L   ALTER TABLE ONLY public.resource_usage DROP CONSTRAINT resource_usage_pkey;
       public         postgres    false    201            �
           2606    16782    role role_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_name);
 8   ALTER TABLE ONLY public.role DROP CONSTRAINT role_pkey;
       public         postgres    false    196            �
           2606    49521    project project_role_name_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_role_name_fkey FOREIGN KEY (role_name) REFERENCES public.role(role_name) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.project DROP CONSTRAINT project_role_name_fkey;
       public       postgres    false    198    196    2701            �
           2606    49561 -   resource_usage resource_usage_project_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.resource_usage
    ADD CONSTRAINT resource_usage_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.resource_usage DROP CONSTRAINT resource_usage_project_id_fkey;
       public       postgres    false    2703    201    198                  x������ � �            x������ � �         1   x��
����4г0�Df\�� 9OONS=4I�,���)W� �|     