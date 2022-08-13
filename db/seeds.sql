INSERT INTO department (department_name)
VALUES
  ('Sales'),
  ('Human Resources'),
  ('Engineering'),
  ('Customer Service');

  
INSERT INTO role (title, salary, department_id) 
VALUES
  ('Sales lead', 50000.80, '1'),
  ('Sales associate', 10000.10, '1'),
  ('HR Rep', 50000.80, '2'),
  ('HR Manager', 70000.80, '2'),
  ('Engineer', 80000.80, '3'),
  ('Senior Engineer', 100000.80, '3'),
  ('Customer Service Rep', 10000.80, '4'),
  ('Customer Service Lead', 40000.80, '4');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Harry', 'Potter', 1, null),
  ('Ash', 'Katchum', 2, 8),
  ('Misty', 'Trainer', 3, 8),
  ('Jessica', 'Day', 4, 4),
  ('Nick', 'Miller', 5, null),
  ('Schmidt', 'Schmidt', 6, null),
  ('Coach', 'Friend', 7, 1),
  ('Winston', 'Bishop', 8, 1),
  ('Robby', 'Friend', 1, 5);