DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
id INT AUTO_INCREMENT,
f_name VARCHAR(30),
l_name VARCHAR(30),
role_id INT,
manager_id INT, 
);

CREATE TABLE department(
    id INT AUTO_INCREMENT,
    name VARCHAR(30),
);

CREATE TABLE role(
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary INT(10, 2),
    department_id INT,
);

INSERT INTO employee(f_name, l_name, role_id, manager_id)
VALUES("Ryan", "Paynter", 1, null);

INSERT INTO department(name)
VALUES("Human Resources");

INSERT INTO role(title, salary, department_id)
VALUES("Manager", 1000000, 3);

SELECT * FROM employee
SELECT * FROM department
SELECT * FROM role
