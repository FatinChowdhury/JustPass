PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                course TEXT NOT NULL,
                evalName TEXT NOT NULL,
                grade REAL NOT NULL,
                weight REAL NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            );
INSERT INTO grades VALUES(1,'user_2yHiu97OznUSUyzBoQzhFGFerZP','ComSci','Tutorial1',80.0,2.0,'2025-06-09 20:12:29');
INSERT INTO grades VALUES(2,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP360','mt1',76.0,20.0,'2025-06-09 20:42:46');
INSERT INTO grades VALUES(3,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP360','mt2',96.0,20.0,'2025-06-09 20:43:02');
INSERT INTO grades VALUES(4,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP360','assignments',50.0,10.0,'2025-06-09 20:43:24');
INSERT INTO grades VALUES(5,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP360','final',78.0,50.0,'2025-06-09 20:43:51');
INSERT INTO grades VALUES(6,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP310','mt1',90.0,25.0,'2025-06-09 22:54:34');
INSERT INTO grades VALUES(7,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP310','assignments',90.0,25.0,'2025-06-09 23:20:40');
INSERT INTO grades VALUES(8,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','COMP310','final',65.0,50.0,'2025-06-10 04:12:12');
INSERT INTO grades VALUES(9,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','CHEM301','assign 1',56.0,5.0,'2025-06-12 23:04:43');
INSERT INTO grades VALUES(10,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','CHEM301','assign 2',70.0,5.0,'2025-06-12 23:05:15');
INSERT INTO grades VALUES(12,'user_2uSeQ7EbyDBTOgB0k9yTICHsrBh','CHEM301','final',1.0,90.0,'2025-06-12 23:09:15');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('grades',12);
CREATE INDEX idx_userId ON grades(userId);
CREATE INDEX idx_course ON grades(course);
COMMIT;
