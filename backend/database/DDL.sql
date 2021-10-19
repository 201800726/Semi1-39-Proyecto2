CREATE DATABASE proyecto2; 
USE proyecto2; 

CREATE TABLE USUARIO (
    username VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE PUBLICACION (
	idPublicacion INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
	fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    texto TEXT NOT NULL, 
    imagen VARCHAR(255), 
    usuario VARCHAR(255) NOT NULL,
    CONSTRAINT FOREIGN KEY fk_usuario(usuario) REFERENCES USUARIO(username)
); 

CREATE TABLE AMISTAD (
    usuario VARCHAR(255) NOT NULL, 
    amigo VARCHAR(255) NOT NULL,
    CONSTRAINT FOREIGN KEY fk_usuario(usuario) REFERENCES USUARIO(username) ON DELETE CASCADE, 
    CONSTRAINT FOREIGN KEY fk_amigo(amigo) REFERENCES USUARIO(username) ON DELETE CASCADE
); 

CREATE TABLE SOLICITUD (
    idSolicitud INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    usuario VARCHAR(255) NOT NULL, 
    amigo VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 0, /* 0 - No aceptada, 1 - Aceptada*/
    CONSTRAINT FOREIGN KEY fk_usuario(usuario) REFERENCES USUARIO(username) ON DELETE CASCADE, 
    CONSTRAINT FOREIGN KEY fk_amigo(amigo) REFERENCES USUARIO(username) ON DELETE CASCADE
); 

CREATE TABLE MENSAJE (
    idMensaje INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    mensaje TEXT NOT NULL, 
    emisor VARCHAR(255) NOT NULL, 
    receptor VARCHAR(255) NOT NULL, 
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT FOREIGN KEY fk_usuario(emisor) REFERENCES USUARIO(username) ON DELETE CASCADE, 
    CONSTRAINT FOREIGN KEY fk_amigo(receptor) REFERENCES USUARIO(username) ON DELETE CASCADE
);

CREATE TABLE ETIQUETA (
	idEtiqueta INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    etiqueta VARCHAR(255) NOT NULL, 
    publicacion INT NOT NULL, 
    CONSTRAINT FOREIGN KEY fk_publicacion(publicacion) REFERENCES PUBLICACION(idPublicacion) ON DELETE CASCADE
); 

