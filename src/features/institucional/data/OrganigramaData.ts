// Definición de la estructura de datos para los miembros del organigrama
export type MemberInfo = {
  id: string
  name: string
  position: string
  department?: string
  bio?: string
  email?: string
  phone?: string
  imageUrl: string
  gremio?: string 
  children?: MemberInfo[]
}

// Datos de los miembros
export const members: MemberInfo[] = [
  {
    id: "presidente",
    name: "Prof. María Silvina Rollet",
    position: "Presidente",
    bio: "Líder con más de 15 años de experiencia en el sector educativo. Especialista en gestión institucional y desarrollo de políticas educativas.",
    email: "msrollet@ejemplo.com",
    phone: "+54 11 1234-5678",
    imageUrl: "/organigrama/presidente.jpg",
  },
  {
    id: "secretaria",
    name: "Teresita R. Proz",
    position: "Secretaria General",
    bio: "Coordinadora de actividades institucionales con amplia experiencia en gestión administrativa y organización de eventos.",
    email: "tproz@ejemplo.com",
    phone: "+54 11 2345-6789",
    imageUrl: "/organigrama/Teresita.jpg",
  },
  {
    id: "vocal1",
    name: "German Aranda",
    position: "Vocal",
    department: "Estatal",
    bio: "Especialista en políticas públicas con enfoque en el desarrollo de programas educativos a nivel provincial.",
    email: "garanda@ejemplo.com",
    imageUrl: "/organigrama/German.jpg",
  },
  {
    id: "vocal2",
    name: "Maria Esmilce Blanchet",
    position: "Vocal",
    department: "Estatal",
    bio: "Experta en evaluación institucional y desarrollo de proyectos educativos innovadores.",
    email: "mblanchet@ejemplo.com",
    imageUrl: "/organigrama/blanchet.jpg",
  },
  {
    id: "vocal3",
    name: "Analia Espindola",
    position: "Vocal",
    department: "Gremial",
    gremio: "A.M.E.T",
    bio: "Representante con amplia trayectoria en defensa de los derechos laborales en el ámbito educativo.",
    email: "aespindola@ejemplo.com",
    imageUrl: "/organigrama/Analia.jpg",
  },
  {
    id: "vocal4",
    name: "Delia Juliana Zacarias",
    position: "Vocal",
    department: "Gremial",
    gremio: "SUTECO",
    bio: "Especialista en negociación colectiva y mediación de conflictos laborales en el sector educativo.",
    email: "dzacarias@ejemplo.com",
    imageUrl: "/organigrama/Delia.jpg",
  },
]