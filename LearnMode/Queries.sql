CREATE TABLE Users(uid int primary key AUTO_INCREMENT NOT NULL, first_name varchar(30) NOT NULL, last_name varchar(30), email varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, picture text, isBanned bool default false)

CREATE TABLE Students(uid INT NOT NULL, FOREIGN KEY (uid) REFERENCES Users(uid), attends varchar(255), major varchar(255), education varchar(255));

CREATE TABLE Instructors(iid INT NOT NULL AUTO_INCREMENT primary key, uid INT NOT NULL, FOREIGN KEY (uid) REFERENCES Users(uid), university varchar(255), department varchar(255));

CREATE TABLE Professors(uid INT NOT NULL, FOREIGN KEY (uid) REFERENCES Users(uid), university varchar(255), department varchar(255));

CREATE TABLE Modules(mid INT PRIMARY KEY  AUTO_INCREMENT NOT NULL, name varchar(255), description TEXT, creator int not null, FOREIGN KEY (creator) REFERENCES Users(uid), is_public boolean default false, code varchar(255) default null, image varchar(255), date_created datetime default now());

CREATE TABLE Sections(sid INT PRIMARY KEY AUTO_INCREMENT NOT NULL, name varchar(255), professor int not null, FOREIGN KEY (professor) REFERENCES Professors(uid), module int not null, FOREIGN KEY (module) REFERENCES Modules(mid), code varchar(255) default null, date_created datetime default now());

CREATE TABLE Instructs(iid INT NOT NULL, FOREIGN KEY (iid) REFERENCES Instructors(iid), sid INT NOT NULL, FOREIGN KEY (sid) REFERENCES Sections(sid), permission_viewGrades boolean default false, permission_removeStudents boolean default false, permission_editModule boolean default false, PRIMARY KEY (iid, sid));

CREATE TABLE Enrollments(uid INT NOT NULL, FOREIGN KEY (uid) REFERENCES Users(uid), sid INT NOT NULL, FOREIGN KEY (sid) REFERENCES Sections(sid), enrollment_date datetime default now(), PRIMARY KEY (uid, sid));

CREATE TABLE DynamicContent(cid INT PRIMARY KEY AUTO_INCREMENT NOT NULL, module INT NOT NULL, FOREIGN KEY (module) REFERENCES Modules(mid), name varchar(255), description TEXT, type varchar(255) NOT NULL, data JSON NOT NULL, ind INT NOT NULL);

CREATE TABLE Evaluations(eid INT PRIMARY KEY AUTO_INCREMENT NOT NULL, module INT NOT NULL, FOREIGN KEY (module) REFERENCES Modules(mid), name varchar(255) NOT NULL, description varchar(255), creator int not null, FOREIGN KEY (creator) REFERENCES Users(uid), is_diagnostic boolean default false, is_enabled boolean default true);

CREATE TABLE Questions(qid INT PRIMARY KEY AUTO_INCREMENT NOT NULL, evaluation INT NOT NULL, FOREIGN KEY (evaluation) REFERENCES Evaluations(eid), prompt text NOT NULL, information TEXT, image varchar(255), ind INT NOT NULL);

CREATE TABLE Options(oid INT PRIMARY KEY AUTO_INCREMENT NOT NULL, question INT NOT NULL, FOREIGN KEY (question) REFERENCES Questions(qid), answer TEXT NOT NULL, is_correct boolean NOT null, ind INT);

CREATE TABLE Scores(uid INT NOT NULL, FOREIGN KEY (uid) REFERENCES Users(uid), evaluation INT NOT NULL, FOREIGN KEY (evaluation) REFERENCES Evaluations(eid), score INT NOT NULL, max_score INT NOT NULL, PRIMARY KEY(uid, evaluation), is_diagnostic boolean NOT NULL, date_taken datetime default now());
