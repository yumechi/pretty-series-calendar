DROP DATABASE IF EXISTS pretty_calendar;
CREATE DATABASE pretty_calendar CHARACTER SET utf8mb4;

USE pretty_calendar;

DROP TABLE IF EXISTS pretty_calendar;
CREATE TABLE pretty_calendar (
    pretty_calendar_id INT(11) AUTO_INCREMENT COMMENT 'プリティーカレンダーID',
    created DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    creator VARCHAR(100) CHARACTER SET utf8mb4 DEFAULT '旅人のアイドルさん' COMMENT '作成者',
    event_title VARCHAR(200) CHARACTER SET utf8mb4  NOT NULL COMMENT 'イベントタイトル',
    event_start DATETIME NOT NULL COMMENT 'イベント開始日時',
    event_end DATETIME NOT NULL COMMENT 'イベント終了日時',
    event_detail text CHARACTER SET utf8mb4 COMMENT 'イベント概要',
    event_id VARCHAR(100) NOT NULL COMMENT 'Googleカレンダーに登録されたID',
    index idx_event_date(event_start, event_end),
    PRIMARY KEY (pretty_calendar_id)
);
