INSERT INTO departments (name) values ("Administration");
INSERT INTO departments (name) values ("Testing");
INSERT INTO departments (name) values ("Engineering");
INSERT INTO departments (name) values ("Design");

INSERT INTO roles (title, salary, department_id) values("President",236000 ,1 );
INSERT INTO roles (title, salary, department_id) values("Vice President",174000 ,1 );
INSERT INTO roles (title, salary, department_id) values("Testing Director", 134000,2 );
INSERT INTO roles (title, salary, department_id) values("Engineering Director ",134000 ,3 );
INSERT INTO roles (title, salary, department_id) values("Design Director",120000 ,4 );
INSERT INTO roles (title, salary, department_id) values("Test Tech",98000 ,2 );
INSERT INTO roles (title, salary, department_id) values("Engineer",98000 ,3 );
INSERT INTO roles (title, salary, department_id) values("Designer",50000 ,4 );


INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id)
VALUES ("Robert", "Howard", 3,NULL);
INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id)
VALUES("Algernon","Blackwood",1,NULL);
INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id)
VALUES ("H.P.", "Lovecraft",2,2);
INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id)
VALUES ("Arthur","Machen",5,2);
INSERT INTO EMPLOYEES (first_name, last_name, role_id, manager_id)
VALUES ("Clark Ashton","Smith",8,4)