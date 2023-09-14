let genUserId = 10;

function User(name, mail, age) {
  this.id = genUserId++;
  this.nombre = name;
  this.email = mail;
  this.edad = age;
}

/*const jose = new User('jose', 'jose@m.com', 34);

const persona = {
    nombre: 'alguien',
    email: 'un correo',
    edad: 44
}*/
