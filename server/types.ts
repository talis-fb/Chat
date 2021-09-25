
type UserPin = string

interface Mensagem {
    from: UserPin,
    body: string
}

interface Conversation {
    cod: string,
    members: UserPin[],
    messages: Mensagem[]
}

interface User {
    pin: UserPin,
    name: string,
    password: string,
    conversations: Array<{ contact: UserPin, cod:string }>
}

type AuthToken = string

export { UserPin, Mensagem, User, Conversation, AuthToken }
