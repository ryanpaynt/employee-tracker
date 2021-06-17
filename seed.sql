USE employee_db;

INSERT INTO employee(f_name, l_name, role_id, manager_id)
VALUES("Ryan", "Paynter", 1, null);
INSERT INTO employee(f_name, l_name, role_id, manager_id)
VALUES("Kirstyn", "Paynter", 2, null);

INSERT INTO department(name)
VALUES("Human Resources");


INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 1000000, 3);
INSERT INTO role(title, salary, department_id)
VALUES("Photographer", 10000, 12);

