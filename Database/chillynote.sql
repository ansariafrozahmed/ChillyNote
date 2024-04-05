PGDMP      ;                |            stproject_management     15.6 (Ubuntu 15.6-1.pgdg23.10+1)     16.2 (Ubuntu 16.2-1.pgdg23.10+1)     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16388    stproject_management    DATABASE     z   CREATE DATABASE stproject_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_IN';
 $   DROP DATABASE stproject_management;
                postgres    false            �            1259    16390 
   admin_user    TABLE     �   CREATE TABLE public.admin_user (
    uid integer NOT NULL,
    user_name character varying(255),
    user_email character varying(255),
    role character varying(50) DEFAULT 'admin'::character varying,
    user_password character varying(255)
);
    DROP TABLE public.admin_user;
       public         heap    postgres    false            �            1259    16389    admin_user_uid_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_user_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_user_uid_seq;
       public          postgres    false    215            �           0    0    admin_user_uid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.admin_user_uid_seq OWNED BY public.admin_user.uid;
          public          postgres    false    214            �            1259    16400    all_employees    TABLE     �  CREATE TABLE public.all_employees (
    uid integer NOT NULL,
    employee_name character varying(100),
    employee_email character varying(100),
    employee_password character varying(100),
    employee_designation character varying(100),
    employee_id integer,
    employee_role character varying(50),
    role_type character varying(255) DEFAULT 'employee'::character varying
);
 !   DROP TABLE public.all_employees;
       public         heap    postgres    false            �            1259    16399    all_employees_uid_seq    SEQUENCE     �   CREATE SEQUENCE public.all_employees_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.all_employees_uid_seq;
       public          postgres    false    217            �           0    0    all_employees_uid_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.all_employees_uid_seq OWNED BY public.all_employees.uid;
          public          postgres    false    216            �            1259    16407    all_projects    TABLE     �  CREATE TABLE public.all_projects (
    project_id integer NOT NULL,
    project_name character varying(255),
    project_description text,
    project_start_date timestamp with time zone,
    project_end_date timestamp with time zone,
    modules jsonb,
    additional_note text,
    assigned_employee_id integer[],
    project_status character varying(50),
    project_creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    key integer NOT NULL
);
     DROP TABLE public.all_projects;
       public         heap    postgres    false            �            1259    16421    all_projects_key_seq    SEQUENCE     �   CREATE SEQUENCE public.all_projects_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.all_projects_key_seq;
       public          postgres    false    219            �           0    0    all_projects_key_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.all_projects_key_seq OWNED BY public.all_projects.key;
          public          postgres    false    220            �            1259    16406    all_projects_project_id_seq    SEQUENCE     �   CREATE SEQUENCE public.all_projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.all_projects_project_id_seq;
       public          postgres    false    219            �           0    0    all_projects_project_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.all_projects_project_id_seq OWNED BY public.all_projects.project_id;
          public          postgres    false    218            �           2604    16393    admin_user uid    DEFAULT     p   ALTER TABLE ONLY public.admin_user ALTER COLUMN uid SET DEFAULT nextval('public.admin_user_uid_seq'::regclass);
 =   ALTER TABLE public.admin_user ALTER COLUMN uid DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    16403    all_employees uid    DEFAULT     v   ALTER TABLE ONLY public.all_employees ALTER COLUMN uid SET DEFAULT nextval('public.all_employees_uid_seq'::regclass);
 @   ALTER TABLE public.all_employees ALTER COLUMN uid DROP DEFAULT;
       public          postgres    false    217    216    217            �           2604    16410    all_projects project_id    DEFAULT     �   ALTER TABLE ONLY public.all_projects ALTER COLUMN project_id SET DEFAULT nextval('public.all_projects_project_id_seq'::regclass);
 F   ALTER TABLE public.all_projects ALTER COLUMN project_id DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16422    all_projects key    DEFAULT     t   ALTER TABLE ONLY public.all_projects ALTER COLUMN key SET DEFAULT nextval('public.all_projects_key_seq'::regclass);
 ?   ALTER TABLE public.all_projects ALTER COLUMN key DROP DEFAULT;
       public          postgres    false    220    219            �          0    16390 
   admin_user 
   TABLE DATA           U   COPY public.admin_user (uid, user_name, user_email, role, user_password) FROM stdin;
    public          postgres    false    215   #       �          0    16400    all_employees 
   TABLE DATA           �   COPY public.all_employees (uid, employee_name, employee_email, employee_password, employee_designation, employee_id, employee_role, role_type) FROM stdin;
    public          postgres    false    217   �#       �          0    16407    all_projects 
   TABLE DATA           �   COPY public.all_projects (project_id, project_name, project_description, project_start_date, project_end_date, modules, additional_note, assigned_employee_id, project_status, project_creation_date, key) FROM stdin;
    public          postgres    false    219   �%       �           0    0    admin_user_uid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_user_uid_seq', 1, true);
          public          postgres    false    214            �           0    0    all_employees_uid_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.all_employees_uid_seq', 8, true);
          public          postgres    false    216            �           0    0    all_projects_key_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.all_projects_key_seq', 9, true);
          public          postgres    false    220            �           0    0    all_projects_project_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.all_projects_project_id_seq', 14, true);
          public          postgres    false    218            �           2606    16398    admin_user admin_user_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_pkey PRIMARY KEY (uid);
 D   ALTER TABLE ONLY public.admin_user DROP CONSTRAINT admin_user_pkey;
       public            postgres    false    215                        2606    16405     all_employees all_employees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.all_employees
    ADD CONSTRAINT all_employees_pkey PRIMARY KEY (uid);
 J   ALTER TABLE ONLY public.all_employees DROP CONSTRAINT all_employees_pkey;
       public            postgres    false    217                       2606    16414    all_projects all_projects_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.all_projects
    ADD CONSTRAINT all_projects_pkey PRIMARY KEY (project_id);
 H   ALTER TABLE ONLY public.all_projects DROP CONSTRAINT all_projects_pkey;
       public            postgres    false    219            �   p   x�3�MJ�LQN,MILO,�LL���s(�KR�3����2� ��*F�*�*�f�y^��^)�~)�%���.�>Ρei��Ue�I�����.A޹��%�\1z\\\ 7#�      �   �  x�m�ɲ�0�u|
�C���k&��"Vo�D��Ai|�V��떺I��&�s�g.)�����G�E��b��!OA_���KĘ�q�d�4>��l��ns�\��|ݠ�t**�k�t>	9�\	�R@����`yGHO�G8�&1�@R��;a��N����I`P�c�ɜ]��R	^,1(W��J N&#�3�Æ1n]�C½j�'�,��*��(�� z��Y`U��r;�%���<6���[Ejt�6fg�����-��m\�]`Ǐ˯e��Ek|���R�ݫ����hȊZE]���g��]�0l R����앰�W����&�J�أ�l����?2��5e�њ���#�2zw�'�vtm���XJ�/x^���U>�N����W�Q�'���N�_�q���CzX��Ǜ6ى
�;�\��tO�(\a�e�D4�H3����{m5�'b�`�s�c��ѿa����N	w      �   �   x�]�]�0���_!�-���9ī~BW���#Si�"���42�p�^ #�AY�O�����.0�����@���'��ejI�C&�:D�S�}Y*z���̿?:�Ė���㺳h*�խ�����n_R�JLθ���ק�j��5�U�hDl�(�~��B&q�R|�0�o�BE�     