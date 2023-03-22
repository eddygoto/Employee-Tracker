INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Software Engineer', 100000, 1),
    ('Accountant', 120000, 2),
    ('Lawyer', 180000, 3),
    ('Marketer', 80000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Erling', 'Haaland', 1, 2),
    ('Kylian', 'Mbappe', 2, 3),
    ('Gabriel', 'Jesus', 3, 4),
    ('Bukayo', 'Saka', 4, 1);