DROP DATABASE IF exists CEOS;
CREATE DATABASE CEOS DEFAULT CHARACTER SET utf8;

use CEOS;

SET foreign_key_checks = 0;

DROP TABLE IF exists user;
create table user
		(uid smallint unsigned NOT NULL AUTO_INCREMENT,
         id VARCHAR (20) NOT NULL,
         password VARCHAR(255) NOT NULL,
         name VARCHAR(5) NOT NULL,
         en_name VARCHAR(50) NOT NULL,
         birth_date DATE NOT NULL,
         phone_number VARCHAR(15) NOT NULL,
         email VARCHAR (255) NOT NULL,
         email_verified boolean NOT NULL default false,
         web_address VARCHAR(255) default NULL,
         univ VARCHAR(30) NOT NULL,
         major VARCHAR(30) NOT NULL,
         univ_id VARCHAR(30) NOT NULL,
         field tinyint unsigned default 3 CHECK(field = 0 or 1 or 2 or 3),/** 0은 기획 1은 개발 2는 디자인 3은 기본**/
         interest VARCHAR(255) default NULL,
         speciality VARCHAR(255) default NULL,
         mention VARCHAR(255),
         career_0 VARCHAR(255) default NULL,
         career_1 VARCHAR(255) default NULL,
         career_2 VARCHAR(255) default NULL,
         career_3 VARCHAR(255) default NULL,
         verify_code VARCHAR(50) default NULL,
         CEOSorder tinyint default NULL,
         profile_image VARCHAR(255) default NULL,
         primary key(uid),
         unique(id)
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists temp;
create table temp (
	name VARCHAR(5) NOT NULL,
    univ VARCHAR(30) NOT NULL,
    major VARCHAR(30) NOT NULL,
    univ_id VARCHAR(30) NOT NULL,
    field tinyint unsigned default 3 CHECK(field = 0 or 1 or 2 or 3),/** 0은 기획 1은 개발 2는 디자인 3은 기본**/
    profile_image VARCHAR(255) default NULL,
    CEOSorder tinyint default NULL,
    mention VARCHAR(255)
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists qna;
create table qna(
	qid int unsigned NOT NULL AUTO_INCREMENT,
	title VARCHAR(100) NOT NULL,
    writer smallint unsigned default 0,
    content text NOT NULL,
    written_time datetime,
    view_num tinyint unsigned default 0,
    primary key(qid)
) Engine =InnoDB DEFAULT CHARSET = utf8;

CREATE
    TRIGGER qna_triger BEFORE INSERT
            ON qna FOR EACH ROW
    SET
        NEW.written_time = NOW(); 

DROP TABLE IF exists qna_reply;
create table qna_reply (
	qrid int unsigned NOT NULL AUTO_INCREMENT,
    qid int unsigned NOT NULL,
    writer smallint unsigned default 0,
    content VARCHAR(255) NOT NULL,
    written_time datetime ,
    primary key(qrid , qid),
    foreign key(qid) references qna(qid) ON DELETE CASCADE ON UPDATE CASCADE
) Engine = InnoDB DEFAULT CHARSET = utf8;

CREATE
    TRIGGER qna_reply_triger BEFORE INSERT
            ON qna_reply FOR EACH ROW
    SET
        NEW.written_time = NOW();
        
        
DROP TABLE IF exists anony;
create table anony(
	anid int unsigned NOT NULL AUTO_INCREMENT,
	title VARCHAR(100) NOT NULL,
    writer smallint unsigned,
    content text NOT NULL,
    written_time datetime,
    view_num tinyint unsigned default 0,
    primary key(anid),
	foreign key(writer) references user(uid) ON DELETE SET NULL ON UPDATE CASCADE
) Engine =InnoDB DEFAULT CHARSET = utf8;

CREATE
    TRIGGER anony_triger BEFORE INSERT
            ON anony FOR EACH ROW
    SET
        NEW.written_time = NOW(); 

DROP TABLE IF exists anony_reply;
create table anony_reply (
	anrid int unsigned NOT NULL AUTO_INCREMENT,
    anid int unsigned NOT NULL,
    writer smallint unsigned,
    content VARCHAR(255) NOT NULL,
    written_time datetime ,
    primary key(anrid , anid),
    foreign key(anid) references anony(anid) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(writer) references user(uid) ON DELETE SET NULL ON UPDATE CASCADE
) Engine = InnoDB DEFAULT CHARSET = utf8;

CREATE
    TRIGGER anony_reply_triger BEFORE INSERT
            ON anony_reply FOR EACH ROW
    SET
        NEW.written_time = NOW();

DROP TABLE IF exists board;
create table board
	(bid int unsigned NOT NULL AUTO_INCREMENT,
     title VARCHAR(100) NOT NULL,
     writer smallint unsigned,
     content  text  NOT NULL,
     written_time datetime,
     view_num tinyint unsigned default 0,
     primary key(bid),
     foreign key(writer) references user(uid) ON DELETE SET NULL ON UPDATE CASCADE
    ) Engine =InnoDB DEFAULT CHARSET = utf8;
    
    CREATE
    TRIGGER board_triger BEFORE INSERT
            ON board FOR EACH ROW
    SET
        NEW.written_time = NOW();
    
DROP TABLE IF exists board_notice;
create table board_notice
	(bnid int unsigned NOT NULL,
    primary key(bnid),
    foreign key(bnid) references board(bid) ON DELETE CASCADE ON UPDATE CASCADE
    ) Engine =InnoDB DEFAULT CHARSET = utf8;
    
DROP TABLE IF exists reply;
create table reply(
	rid int unsigned NOT NULL AUTO_INCREMENT,
    bid int unsigned NOT NULL,
    writer smallint unsigned,
    content VARCHAR(255) NOT NULL,
    written_time datetime ,
    primary key(rid , bid),
    foreign key(bid) references board(bid) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(writer) references user(uid) ON DELETE SET NULL ON UPDATE CASCADE
) Engine =InnoDB DEFAULT CHARSET = utf8;

    CREATE
    TRIGGER reply_triger BEFORE INSERT
            ON reply FOR EACH ROW
    SET
        NEW.written_time = NOW();
        
DROP TABLE IF exists notice;
create table notice(
	nid int unsigned NOT NULL AUTO_INCREMENT,
	title VARCHAR(100) NOT NULL,
    writer smallint unsigned,
    content text NOT NULL,
    written_time datetime,
    view_num tinyint unsigned default 0,
    primary key(nid),
	foreign key(writer) references user(uid) ON DELETE SET NULL ON UPDATE CASCADE
) Engine =InnoDB DEFAULT CHARSET = utf8;

CREATE
    TRIGGER notice_triger BEFORE INSERT
            ON notice FOR EACH ROW
    SET
        NEW.written_time = NOW(); 

DROP TABLE IF exists activity;
create table activity(
	aid mediumint unsigned NOT NULL AUTO_INCREMENT,
    a_order VARCHAR(5) NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_image VARCHAR(255) NOT NULL,
    semester tinyint unsigned NOT NULL,   /** 학기 어떻게 구분할껀지 알려줬으면 함 나는 숫자로 생각하고 이걸로 넣은거**/
    primary key(aid)
    ) Engine =InnoDB DEFAULT CHARSET = utf8;
    
DROP TABLE IF exists hire;
create table hire(
	hid mediumint unsigned NOT NULL AUTO_INCREMENT,
    intro_co VARCHAR(25) NOT NULL,
    want_peo VARCHAR(35) NOT NULL,
    content VARCHAR(305) NOT NULL,
    manager VARCHAR(5) NOT NULL,
    call_num VARCHAR(15) default NULL,
    phone_num VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    web_address VARCHAR(255) default NULL,
    primary key(hid)
) Engine =InnoDB DEFAULT CHARSET = utf8;

SET foreign_key_checks = 1;