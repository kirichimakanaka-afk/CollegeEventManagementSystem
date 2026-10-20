drop database if exists college_events;
create database college_events;
use college_events;

-- tables

create table Students (
    student_id int auto_increment primary key,
    full_name varchar(100),
    email varchar(100) unique,
    password_hash varchar(255),
    department varchar(50),
    programme varchar(50),
    year_of_study int,
    role varchar(20) default 'student'
);

create table Events (
    event_id int auto_increment primary key,
    title varchar(150),
    description text,
    venue varchar(100),
    event_date datetime,
    capacity int,
    created_by int,
    foreign key (created_by) references Students(student_id)
);

-- links students to events (many-to-many)
create table Registrations (
    registration_id int auto_increment primary key,
    student_id int,
    event_id int,
    registered_at timestamp default current_timestamp,
    status varchar(20) default 'registered',
    foreign key (student_id) references Students(student_id),
    foreign key (event_id) references Events(event_id)
);

create table Feedback (
    feedback_id int auto_increment primary key,
    student_id int,
    event_id int,
    rating int,
    comments text,
    submitted_at timestamp default current_timestamp,
    foreign key (student_id) references Students(student_id),
    foreign key (event_id) references Events(event_id)
);

-- sample data

insert into Students (full_name, email, password_hash, department, programme, year_of_study, role) values
('Admin User', 'admin@college.edu', 'hash_admin', 'Administration', null, null, 'admin'),
('Mutende Mulenga', 'mutende@college.edu', 'hash_02', 'SOET', 'Data Analytics', 2, 'student'),
('Triumph Mpuya', 'triumph@college.edu', 'hash_03', 'SOET', 'Data Science', 3, 'student'),
('David Oscar', 'david@college.edu', 'hash_04', 'SOET', 'Information Systems', 1, 'student'),
('Kimberly Makanaka', 'kimberly@college.edu', 'hash_05', 'SOET', 'Computer Science', 2, 'student'),
('Sharon Nkala', 'sharon@college.edu', 'hash_06', 'SOET', 'Business IT', 3, 'student'),
('Tashinga Gwara', 'tashinga@college.edu', 'hash_07', 'SOET', 'Data Science', 2, 'student'),
('Nigel Chapwanya', 'nigel@college.edu', 'hash_08', 'SOET', 'Cyber Security', 4, 'student'),
('Aaron Amini', 'aaron@college.edu', 'hash_09', 'SOET', 'Software Engineering', 1, 'student'),
('Hastings Blackson', 'hastings@college.edu', 'hash_10', 'SOET', 'Computer Science', 3, 'student');

insert into Events (title, description, venue, event_date, capacity, created_by) values
('Hackathon 2026', '24-hour coding competition', 'Main Auditorium', '2026-11-10 09:00:00', 100, 1),
('Career Fair', 'Meet recruiters and alumni', 'Sports Hall', '2026-11-20 10:00:00', 300, 1),
('Cultural Day', 'Music, food and performances', 'Campus Grounds', '2026-12-05 12:00:00', 500, 1),
('Cyber Security Workshop', 'Hands-on ethical hacking', 'Lab 3', '2026-11-15 14:00:00', 40, 1);

insert into Registrations (student_id, event_id, status) values
(2, 1, 'attended'),
(3, 1, 'attended'),
(5, 1, 'attended'),
(7, 1, 'attended'),
(10, 1, 'registered'),
(2, 2, 'registered'),
(4, 2, 'registered'),
(6, 2, 'registered'),
(9, 2, 'registered'),
(3, 3, 'registered'),
(5, 3, 'registered'),
(6, 3, 'registered'),
(8, 3, 'registered'),
(8, 4, 'registered'),
(10, 4, 'registered'),
(2, 4, 'cancelled');

insert into Feedback (student_id, event_id, rating, comments) values
(2, 1, 5, 'Great event, learned a lot!'),
(3, 1, 4, 'Well organised, but the venue was crowded.'),
(5, 1, 5, 'Loved the teamwork and the prizes.'),
(7, 1, 3, 'Good idea, needed more mentors.');

-- check the data loaded

select * from Students;
select * from Events;

select Students.full_name, Events.title, Registrations.status
from Registrations
join Students on Registrations.student_id = Students.student_id
join Events on Registrations.event_id = Events.event_id;

