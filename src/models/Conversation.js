export class Conversation {
  constructor(id, participants, lastMessage, timestamp) {
    this.id = id
    this.participants = participants
    this.lastMessage = lastMessage
    this.timestamp = timestamp
  }
}
