# Manual Técnico 

- [Objetivos](#objetivos)
- [Arquitectura](#arquitectura)
- [Usuarios IAM](#usuarios-iam)


## Objetivos 


### Objetivo General 

- Aplicar y conocer nuevas técnologias en la nube de forma simple, segura y rápida.

### Objetivos Especifícos

- Aplicar conocimientos adquiridos en el curso de Seminario de Sistemas 1.

- Integración de servicios en Amazon Web Services.

- Aplicar técnologias de la nube en un entorno real.


## Arquitectura
<div align="center"> 
    <img src="./assets/images/Arquitectura.png" width="550">
    <p align="center"> Arquitectura </p>
</div>
<br/>

La arquitectura de la aplicación fue realizada usando Angular como framework para el lado del frontend y Nodejs para el lado del backend. Estos servicios se levantaron en contenedores usando docker-compose y docker para poder empaquetar la aplicación. Se utilizo Rekoognition en API Gateway para poder realizar la funcionalidad de Inicio de Sesión con reconocimiento facial. También se utilizo Rekognition para poder filtar las publicaciones por etiquetas. 

Se utilizo para la base de datos MySQL, asi mismo se utizo docker-compose para poder levantarla dentro de una EC2 en AWS. Se utilizó Amazon Translate para poder traducir las publicaciones al idioma español. 

### Modelo Relacional Base de Datos 

La base de datos de la aplicación fue implementada con MySQL, contiene las siguientes tablas. 
- USUARIO
- AMISTAD 
- MENSAJE 
- PUBLICACION
- ETIQUETA

<div align="center"> 
    <img src="./assets/images/DB.png" width="550">
    <p align="center"> Base de datos </p>
</div>
<br/>

## Usuarios IAM

### Administrador_201801182 

Se creo para poder dar acceso a la consola de Administración de AWS. 

#### Política Asociada 

- AdministratorAccess 
- IAMUserChangePassword

<div align="center"> 
    <img src="./assets/images/IAM_1.png" width="550">
    <p align="center"> Administrador_201801182 </p>
</div>
<br/>

### Admin_Rekognition_201801182

Se creo para poder administrar Rekognition para el reconocimiento de etiquetas de la imagen de una publicación.   

#### Política Asociada 

- AmazonS3FullAccess
- AmazonRekognitionFullAccess

<div align="center"> 
    <img src="./assets/images/IAM_2.png" width="550">
    <p align="center">  Admin_Rekognition_201801182 </p>
</div>
<br/>


### Administrador_Translate

Se creo para poder manejar la funcionalidad de traducción desde programación. 

#### Política Asociada 

- TranslateFullAccess

<div align="center"> 
    <img src="./assets/images/IAM_3.png" width="550">
    <p align="center">  Administrador_Translate </p>
</div>
<br/>

### Admin_S3

Se creo para poder administrar S3 desde programación.

#### Política Asociada 

- AmazonS3FullAccess

<div align="center"> 
    <img src="./assets/images/IAM_4.png" width="550">
    <p align="center">  Admin_S3 </p>
</div>
<br/>

## Roles

### login-role-vshsvm57

Utilizado para implementar funcionalidad de inicio de sesión utilizando el servicio de AWS Lambda. 

#### Política Asociada 

- AmazonRekognitionFullAccess
- AWSLambdaBasicExecutionRole

<div align="center"> 
    <img src="./assets/images/IAM_5.png" width="550">
    <p align="center">  Rol: login </p>
</div>
<br/>