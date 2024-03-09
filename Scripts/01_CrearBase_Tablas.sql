
create database  DBClinica

go

Use DBClinica

go

create table RolUsuario(
IdRolUsuario int primary key identity,
Nombre varchar(50),
FechaCreacion datetime default getdate()
)
go

Create table Usuario(
IdUsuario int primary key identity,
NumeroDocumentoIdentidad varchar(50),
Nombre varchar(50),
Apellido varchar(50),
Correo varchar(50),
Clave varchar(50),
IdRolUsuario int references RolUsuario(IdRolUsuario),
FechaCreacion datetime default getdate()
)

go


Create table Especialidad(
IdEspecialidad int primary key identity,
Nombre varchar(50),
FechaCreacion datetime default getdate()
)

go

Create table Doctor(
IdDoctor int primary key identity,
NumeroDocumentoIdentidad varchar(50),
Nombres varchar(50),
Apellidos varchar(50),
Genero varchar(1),
IdEspecialidad int references Especialidad(IdEspecialidad),
FechaCreacion datetime default getdate()
)

go

Create table DoctorHorario(
IdDoctorHorario int primary key identity,
IdDoctor int references Doctor(IdDoctor),
NumeroMes int,
HoraInicioAM time,
HoraFinAM time,
HoraInicioPM time,
HoraFinPM time,
FechaCreacion datetime default getdate()
)
go

Create table DoctorHorarioDetalle
(
IdDoctorHorarioDetalle int primary key identity,
IdDoctorHorario int references DoctorHorario(IdDoctorHorario),
Fecha date,
Turno varchar(2),
TurnoHora time,
Reservado bit,
FechaCreacion datetime default getdate()
)

go

create table EstadoCita(
IdEstadoCita int primary key identity,
Nombre varchar(50),
FechaCreacion datetime default getdate()
)
go

Create table Cita(
IdCita int primary key identity,
IdUsuario int references Usuario(IdUsuario),
IdDoctorHorarioDetalle int references DoctorHorarioDetalle(IdDoctorHorarioDetalle),
IdEstadoCita int references EstadoCita(IdEstadoCita),
FechaCita datetime,
Indicaciones varchar(1000),
FechaCreacion datetime default getdate()
)

go

SET IDENTITY_INSERT RolUsuario ON
insert into RolUsuario(IdRolUsuario,Nombre) values
(1,'Administrador'),
(2,'Paciente'),
(3,'Doctor')
SET IDENTITY_INSERT RolUsuario OFF


go

SET IDENTITY_INSERT Especialidad ON
insert into Especialidad(IdEspecialidad,Nombre) values
(1,'Psicología'),
(2,'Urología'),
(3,'Pediatría'),
(4,'Otorrinolaringología'),
(5,'Oftalmología'),
(6,'Neurología'),
(7,'Neumología'),
(8,'Nutrición'),
(9,'Medicina General'),
(10,'Gastroenterología'),
(11,'Endocrinología'),
(12,'Dermatología')
SET IDENTITY_INSERT Especialidad OFF

GO

INSERT INTO Doctor(NumeroDocumentoIdentidad,Nombres,Apellidos,Genero,IdEspecialidad) VALUES
('10000000','Alexandra','Alvarez','F',1),
('10000001','Abigail','Azizi','F',1),
('10000002','Justina','Thiarre','F',1),
('10000003','Alana','Gomez','F',1),
('10000004','Ivana','Rojas','F',2),
('10000005','Macon','Alonsos','M',2),
('10000006','Herrod','Tapia','M',2),
('10000007','Serena','Renato','F',2),
('10000008','Herman','Trinidad','M',3),
('10000009','Derek','Daniel','M',3),
('10000010','Lani','Alvarez','F',3),
('10000011','Blaze','Maximiliano','M',3),
('10000012','Nicole','Atlas','F',4),
('10000013','Nasim','Carrasco','F',4),
('10000014','Karleigh','Javier','F',4),
('10000015','Rooney','Zuniga','F',4),
('10000016','Hasad','Joaquin','F',4),
('10000017','Tamara','Contreras','F',5),
('10000018','Rhoda','Castro','F',5),
('10000019','Orli','Florencia','F',5),
('10000020','Montana','Castro','F',5),
('10000021','Aquila','Jara','F',6),
('10000022','Jenette','Tomas','F',6),
('10000023','Sylvester','Tapia','M',6),
('10000024','Colin','Florencia','M',6),
('10000025','Galvin','Francisco','M',6),
('10000026','Glenna','Benjamin','F',7),
('10000027','Kay','Carla','F',7),
('10000028','Jacob','Augustin','M',7),
('10000029','Travis','Martina','M',7),
('10000030','Olga','Gabriela','F',8),
('10000031','Noelani','Carla','F',8),
('10000032','Steven','Rodriguez','M',8),
('10000033','Kylan','Carrasco','M',8),
('10000034','Driscoll','Diego','M',9),
('10000035','Brenna','Gabriela','F',10),
('10000036','Lionel','Herrera','M',10),
('10000037','Garth','Diaz','F',10),
('10000038','Graiden','Soto','M',10),
('10000039','Dominic','Morales','M',11),
('10000040','Barclay','Martinez','F',11),
('10000041','Cameran','Flores','F',11),
('10000042','Joan','Joaquin','M',11),
('10000043','Xanthus','Munoz','F',11),
('10000044','Hedley','Sanchez','M',11),
('10000045','Melissa','Zavala','F',11),
('10000046','Gretchen','Vasquez','M',12),
('10000047','Regina','Ramirez','F',12),
('10000048','Cameran','Vargas','F',12),
('10000049','Libby','Paz','F',12),
('10000050','Madeline','Pascal','F',12),
('10000051','Brady','Vega','F',1),
('10000052','Hashim','Torres','M',2),
('10000053','MacKenzie','Laura','F',3),
('10000054','Callum','Javier','M',4)

go

insert into EstadoCita(Nombre) values
('Pendiente'),
('Atendido'),
('Anulado')

go


insert into Usuario(NumeroDocumentoIdentidad,Nombre,Apellido,Correo,Clave,IdRolUsuario) values
('75757575','Jose','Mendez','Jose@clinica.pe','123',1),
('74747474','Maria','Espinoza','maria@clinica.pe','123',2)

go

insert into Usuario(NumeroDocumentoIdentidad,Nombre,Apellido,Correo,Clave,IdRolUsuario)
select NumeroDocumentoIdentidad,Nombres,Apellidos,'',NumeroDocumentoIdentidad,3 from Doctor

go
