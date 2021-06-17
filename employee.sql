DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee {
id INT AUTO_INCREMENT,
f_name VARCHAR(30),
l_name VARCHAR(30),
role_id INT,
manager_id INT, 
}

CREATE TABLE department{
    id INT AUTO_INCREMENT,
    name VARCHAR(30),
}

CREATE TABLE role{
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary INT(5, 2),
    department_id INT,
}