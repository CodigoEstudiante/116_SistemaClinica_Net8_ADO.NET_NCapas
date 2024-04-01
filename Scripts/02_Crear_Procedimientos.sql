
USE DBClinica

go
--- CONFIGURACION ---

create FUNCTION [dbo].[SplitString]  ( 
	@string NVARCHAR(MAX), 
	@delimiter CHAR(1)  
)
RETURNS
@output TABLE(valor NVARCHAR(MAX)  ) 
BEGIN 
	DECLARE @start INT, @end INT 
	SELECT @start = 1, @end = CHARINDEX(@delimiter, @string) 
	WHILE @start < LEN(@string) + 1
	BEGIN 
		IF @end = 0  
        SET @end = LEN(@string) + 1 

		INSERT INTO @output (valor)  
		VALUES(SUBSTRING(@string, @start, @end - @start)) 
		SET @start = @end + 1 
		SET @end = CHARINDEX(@delimiter, @string, @start) 
	END 
	RETURN
END

go

--- PROCEDIMIENTOS PARA ROLUSUARIO ---
create procedure sp_listaRolUsuario
as
begin
 select IdRolUsuario,Nombre,convert(char(10),FechaCreacion,103)[FechaCreacion] from RolUsuario
end

go

--- PROCEDIMIENTOS PARA USUARIO ---

create procedure sp_listaUsuario(
@IdRolUsuario int
)
as
begin
	select u.IdUsuario,u.NumeroDocumentoIdentidad,u.Nombre,u.Apellido,u.Correo,u.Clave,ru.IdRolUsuario,ru.Nombre[NombreRol],
	convert(char(10),u.FechaCreacion,103)[FechaCreacion]
	from Usuario u
	inner join RolUsuario ru on ru.IdRolUsuario = u.IdRolUsuario
	where u.IdRolUsuario = iif(@IdRolUsuario=0,u.IdRolUsuario,@IdRolUsuario)
end

go

create procedure sp_guardarUsuario
(
@NumeroDocumentoIdentidad varchar(50),
@Nombre varchar(50),
@Apellido varchar(50),
@Correo varchar(50),
@Clave varchar(50),
@IdRolUsuario int,
@MsgError varchar(100) OUTPUT
)
as
begin
	set @MsgError = ''

	if(not exists(select IdUsuario from Usuario where NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad))
		insert into Usuario(NumeroDocumentoIdentidad,Nombre,Apellido,Correo,Clave,IdRolUsuario) values
		(@NumeroDocumentoIdentidad,@Nombre,@Apellido,@Correo,@Clave,@IdRolUsuario)
	else
		set @MsgError = 'El usuario ya existe'
end

go

create procedure sp_editarUsuario
(
@IdUsuario int,
@NumeroDocumentoIdentidad varchar(50),
@Nombre varchar(50),
@Apellido varchar(50),
@Correo varchar(50),
@Clave varchar(50),
@IdRolUsuario int,
@MsgError varchar(100) OUTPUT
)
as
begin
	set @MsgError = ''
	if(not exists(select IdUsuario from Usuario where NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad and IdUsuario != @IdUsuario))
		update Usuario set
		NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad,
		Nombre = @Nombre,
		Apellido = @Apellido,
		Correo = @Correo,
		Clave = @Clave,
		IdRolUsuario = @IdRolUsuario
		where IdUsuario = @IdUsuario
	else
		set @MsgError = 'El usuario ya existe'
end

go

create procedure sp_eliminarUsuario
(
@IdUsuario int
)
as
begin
 delete top (1) from Usuario
 where IdUsuario = @IdUsuario
end

go

create procedure sp_loginUsuario
(
@DocumentoIdentidad varchar(50),
@Clave varchar(50)
)
as
begin

	select u.IdUsuario,u.NumeroDocumentoIdentidad,u.Nombre,u.Apellido,u.Correo,ru.Nombre[NombreRol] from Usuario u
	inner join RolUsuario ru on ru.IdRolUsuario = u.IdRolUsuario
	where u.NumeroDocumentoIdentidad = @DocumentoIdentidad and u.Clave = @Clave
end

go

--- PROCEDIMIENTOS PARA ESPECIALIDAD ---

create procedure sp_listaEspecialidad
as
begin
 select IdEspecialidad,Nombre,convert(char(10),FechaCreacion,103)[FechaCreacion] from Especialidad
end

go

create procedure sp_guardarEspecialidad
(
@Nombre varchar(100),
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''

	if(not exists(select IdEspecialidad from Especialidad where Nombre = @Nombre))
		insert into Especialidad(Nombre) values(@Nombre)
	else
		set @msgError = 'La especialidad ya existe'
end

go


create procedure sp_editarEspecialidad
(
@IdEspecialidad int,
@Nombre varchar(100),
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''
	if(not exists(select IdEspecialidad from Especialidad where Nombre = @Nombre and IdEspecialidad != @IdEspecialidad))
		update Especialidad set
		Nombre = @Nombre
		where IdEspecialidad = @IdEspecialidad
	else
		set @msgError = 'La especialidad ya existe'
end

go


create procedure sp_eliminarEspecialidad
(
@IdEspecialidad int
)
as
begin
 delete top (1) from Especialidad
 where IdEspecialidad = @IdEspecialidad
end

go

--- PROCEDIMIENTOS PARA DOCTOR ---

create procedure sp_listaDoctor
as
begin
	select d.IdDoctor,d.NumeroDocumentoIdentidad,d.Nombres,d.Apellidos,d.Genero,e.IdEspecialidad,e.Nombre[NombreEspecialidad],
	convert(char(10),d.FechaCreacion,103)[FechaCreacion]
	from Doctor d
	inner join Especialidad e on e.IdEspecialidad = d.IdEspecialidad
end

go

create procedure sp_guardarDoctor
(
@NumeroDocumentoIdentidad varchar(50),
@Nombres varchar(50),
@Apellidos varchar(50),
@Genero varchar(50),
@IdEspecialidad int,
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''

	if(not exists(select IdDoctor from Doctor where NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad))
	begin
		insert into Doctor(NumeroDocumentoIdentidad,Nombres,Apellidos,Genero,IdEspecialidad) values
		(@NumeroDocumentoIdentidad,@Nombres,@Apellidos,@Genero,@IdEspecialidad)

		if(not exists(select IdUsuario from Usuario where NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad))
			insert into Usuario(NumeroDocumentoIdentidad,Nombre,Apellido,Correo,Clave,IdRolUsuario) values
			(@NumeroDocumentoIdentidad,@Nombres,@Apellidos,'',@NumeroDocumentoIdentidad,3)

	end
	else
		set @msgError = 'El doctor ya existe'
end

go

create procedure sp_editarDoctor
(
@IdDoctor int,
@NumeroDocumentoIdentidad varchar(50),
@Nombres varchar(50),
@Apellidos varchar(50),
@Genero varchar(50),
@IdEspecialidad int,
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''

	if(not exists(select IdDoctor from Doctor where NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad and IdDoctor != @IdDoctor))
		update Doctor set 
		NumeroDocumentoIdentidad = @NumeroDocumentoIdentidad,
		Nombres  = @Nombres,
		Apellidos = @Apellidos,
		Genero = @Genero,
		IdEspecialidad = @IdEspecialidad
		where IdDoctor = @IdDoctor
	else
		set @msgError = 'El doctor ya existe'
end

go

create procedure sp_eliminarDoctor
(
@IdDoctor int
)
as
begin
 delete top (1) from Doctor
 where IdDoctor = @IdDoctor
end

go

create procedure sp_listaDoctorHorario
as
begin
	select dh.IdDoctorHorario, d.NumeroDocumentoIdentidad,d.Nombres,d.Apellidos,dh.NumeroMes,
	convert(char(5),dh.HoraInicioAM,108)HoraInicioAM,convert(char(5),dh.HoraFinAM,108)HoraFinAM,
	convert(char(5),dh.HoraInicioPM,108)HoraInicioPM,convert(char(5),dh.HoraFinPM,108)HoraFinPM,
	convert(char(10),dh.FechaCreacion,103)[FechaCreacion]
	from DoctorHorario dh
	inner join Doctor d on d.IdDoctor = dh.IdDoctor
end

go

create procedure sp_registrarDoctorHorario
(
@IdDoctor int,
@NumeroMes int,
@HoraInicioAM varchar(5),
@HoraFinAM varchar(5),
@HoraInicioPM varchar(5),
@HoraFinPM varchar(5),
@Fechas varchar(max),
@msgError varchar(100) OUTPUT
)
as
begin
	set dateformat dmy
	set @msgError = ''
	declare @IdDoctorHorario int
	declare @HI_AM time = convert(time,@HoraInicioAM)
	declare @HF_AM time = convert(time,@HoraFinAM)
	declare @HI_PM time = convert(time,@HoraInicioPM)
	declare @HF_PM time = convert(time,@HoraFinPM)

	begin try

			begin tran
	
			if(exists(select convert(date,a.valor)[fecha],month(convert(date,a.valor))[mes],b.valor
			from dbo.SplitString(@Fechas, ',')a
			left join dbo.SplitString(@NumeroMes, ',') b on convert(int, month(convert(date,a.valor))) =  b.valor
			where b.valor is null))
			begin
				set @msgError = 'Todas las fechas deben estar dentro del mismo mes'
			end

			if(exists(select IdDoctor from DoctorHorario where IdDoctor = @IdDoctor and NumeroMes = @NumeroMes))
			begin
				set @msgError = 'El doctor ya tiene registrado su horario para el mes seleccionado'
			end

			if(@msgError='')
			begin
				insert into DoctorHorario(IdDoctor,NumeroMes,HoraInicioAM,HoraFinAM,HoraInicioPM,HoraFinPM) values
				(@IdDoctor,@NumeroMes,@HoraInicioAM,@HoraFinAM,@HoraInicioPM,@HoraFinPM)
			
				set @IdDoctorHorario = SCOPE_IDENTITY()
	
				;WITH HORAS_AM AS (
					SELECT @HI_AM AS HoraTurno
					UNION ALL
					SELECT  DATEADD(MINUTE, 30, HoraTurno) FROM HORAS_AM WHERE DATEADD(MINUTE, 30, HoraTurno)<=@HF_AM
				)
				SELECT HoraTurno into #HorarioAM FROM HORAS_AM
	
				;WITH HORAS_PM AS (
					SELECT @HI_PM AS HoraTurno
					UNION ALL
					SELECT  DATEADD(MINUTE, 30, HoraTurno) FROM HORAS_PM WHERE DATEADD(MINUTE, 30, HoraTurno)<=@HF_PM
				)
				SELECT HoraTurno into #HorarioPM FROM HORAS_PM
	
	
				select @IdDoctorHorario[IdDoctorHorario],'AM'[Turno],HoraTurno[TurnoHora],0[Reservado] into #Horario from #HorarioAM
				UNION ALL
				select @IdDoctorHorario,'PM',HoraTurno,0 from #HorarioPM
	
				
				insert into DoctorHorarioDetalle(IdDoctorHorario,Fecha,Turno,TurnoHora,Reservado)
				select @IdDoctorHorario,CONVERT(date,f.valor),h.Turno,h.TurnoHora,h.Reservado
				from dbo.SplitString(@Fechas, ',') f
				CROSS JOIN #Horario h
				order by CONVERT(date,f.valor),TurnoHora asc
	
			end
				
			commit tran
	end try
	begin catch
		rollback tran
		set @msgError = ERROR_MESSAGE()
	end catch

end

go


create PROCEDURE sp_listaDoctorHorarioDetalle
@IdDoctor INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CONVERT(char(10), dhd.fecha, 103) AS [Fecha],
        (
            SELECT
				dhd2.IdDoctorHorarioDetalle,
				dhd2.Turno,
                CONVERT(char(5), dhd2.TurnoHora, 108) AS [TurnoHora]
            FROM
                DoctorHorarioDetalle dhd2
				INNER JOIN DoctorHorario dh2 ON dh2.IdDoctorHorario = dhd2.IdDoctorHorario
            WHERE
                dhd2.fecha = dhd.fecha
				and dhd2.Reservado = 0
				and dh2.IdDoctor = @IdDoctor
            FOR XML PATH('Hora'), TYPE, ROOT('Horarios')
        )
    FROM
        DoctorHorarioDetalle dhd
        INNER JOIN DoctorHorario dh ON dh.IdDoctorHorario = dhd.IdDoctorHorario
    WHERE
        dh.IdDoctor = @IdDoctor
    GROUP BY
    dhd.fecha
    FOR XML PATH('FechaAtencion'), ROOT('HorarioDoctor'), TYPE;
END

go

create procedure sp_eliminarDoctorHorario(
@IdDoctorHorario int,
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''
	if ((select count(*) from DoctorHorarioDetalle 
	where IdDoctorHorario = @IdDoctorHorario and Reservado = 1) > 0
	)
	begin
		set @msgError = 'No se puede eliminar porque un turno ya fue reservado'
	end
	else
	begin
		delete from DoctorHorarioDetalle where IdDoctorHorario = @IdDoctorHorario
		delete from DoctorHorario where IdDoctorHorario = @IdDoctorHorario
	end
end


go
--- PROCEDIMIENTOS PARA CITA ---

create procedure sp_guardarCita
(
@IdUsuario int,
@IdDoctorHorarioDetalle int,
@IdEstadoCita int,
@FechaCita varchar(10),
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''
	set dateformat dmy

	begin try
		begin tran

		if(not exists(select IdDoctorHorarioDetalle from DoctorHorarioDetalle where IdDoctorHorarioDetalle = @IdDoctorHorarioDetalle and Reservado = 1))
		begin

			update DoctorHorarioDetalle set
			Reservado = 1
			where IdDoctorHorarioDetalle = @IdDoctorHorarioDetalle

			insert into Cita(IdUsuario,IdDoctorHorarioDetalle,IdEstadoCita,FechaCita) values
			(@IdUsuario,@IdDoctorHorarioDetalle,@IdEstadoCita,convert(date,@FechaCita))

		end
		else
			set @msgError = 'El horario no esta disponible'

		commit tran
	end try
	begin catch
		rollback tran
		set @msgError = 'Error al registrar el horario'
	end catch

end

go

create procedure sp_ListaCitasPendiente(
@IdUsuario int
)
as
begin
	select c.IdCita, convert(char(10),FechaCita,103)[FechaCita],e.Nombre[NombreEspecialidad],d.Nombres,d.Apellidos,convert(char(5),dhd.TurnoHora,108)[HoraCita] from Cita c
	inner join DoctorHorarioDetalle dhd on dhd.IdDoctorHorarioDetalle = c.IdDoctorHorarioDetalle
	inner join DoctorHorario dh on dh.IdDoctorHorario = dhd.IdDoctorHorario
	inner join Doctor d on d.IdDoctor = dh.IdDoctor
	inner join Especialidad e on e.IdEspecialidad = d.IdEspecialidad
	where c.FechaCita >= GETDATE() and c.IdEstadoCita = 1 and c.IdUsuario = @IdUsuario
end

go

create procedure sp_CancelarCita
(
@IdCita int,
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''
	set dateformat dmy

	begin try
		begin tran

		update Cita set IdEstadoCita = 3 where IdCita = @IdCita

		declare @IdDoctorHorarioDetalle int = (
			select c.IdDoctorHorarioDetalle from Cita c
			inner join DoctorHorarioDetalle dhd on dhd.IdDoctorHorarioDetalle = c.IdDoctorHorarioDetalle
			where c.IdCita = @IdCita
		)

		update DoctorHorarioDetalle set Reservado = 0 where IdDoctorHorarioDetalle = @IdDoctorHorarioDetalle

		commit tran
	end try
	begin catch
		rollback tran
		set @msgError = 'Error al cancelar al cita'
	end catch

end

go


create procedure sp_ListaHistorialCitas(
@IdUsuario int
)
as
begin
	select c.IdCita, convert(char(10),FechaCita,103)[FechaCita],e.Nombre[NombreEspecialidad],d.Nombres,d.Apellidos,convert(char(5),dhd.TurnoHora,108)[HoraCita],
	isnull(c.Indicaciones,'')[Indicaciones]
	from Cita c
	inner join DoctorHorarioDetalle dhd on dhd.IdDoctorHorarioDetalle = c.IdDoctorHorarioDetalle
	inner join DoctorHorario dh on dh.IdDoctorHorario = dhd.IdDoctorHorario
	inner join Doctor d on d.IdDoctor = dh.IdDoctor
	inner join Especialidad e on e.IdEspecialidad = d.IdEspecialidad
	where c.FechaCita < GETDATE() and c.IdEstadoCita = 2 and c.IdUsuario = @IdUsuario
end

go

create procedure sp_ListaCitasAsignadas(
@IdDoctor int,
@IdEstadoCita int
)
as
begin
	select c.IdCita, convert(char(10),c.FechaCita,103)[FechaCita],convert(char(5),dhd.TurnoHora,108)[HoraCita],
	u.Nombre,u.Apellido,ec.Nombre[EstadoCita],c.Indicaciones from Cita c
	inner join Usuario u on u.IdUsuario = c.IdUsuario
	inner join EstadoCita ec on ec.IdEstadoCita = c.IdEstadoCita
	inner join DoctorHorarioDetalle dhd on dhd.IdDoctorHorarioDetalle = c.IdDoctorHorarioDetalle
	inner join DoctorHorario dh on dh.IdDoctorHorario = dhd.IdDoctorHorario
	inner join Doctor d on d.IdDoctor = dh.IdDoctor
	inner join Usuario u2 on u2.NumeroDocumentoIdentidad = d.NumeroDocumentoIdentidad
	where c.IdEstadoCita = @IdEstadoCita and u2.IdUsuario = @IdDoctor
	order by c.FechaCita desc
end

go

create procedure sp_CambiarEstadoCita
(
@IdCita int,
@IdEstadoCita int,
@Indicaciones varchar(100) = '',
@msgError varchar(100) OUTPUT
)
as
begin
	set @msgError = ''
	set dateformat dmy

	begin try
		begin tran

		update Cita set IdEstadoCita = @IdEstadoCita, Indicaciones = iif(@Indicaciones='',Indicaciones,@Indicaciones) where IdCita = @IdCita

		commit tran
	end try
	begin catch
		rollback tran
		set @msgError = 'No se pudo cambiar estado'
	end catch

end
