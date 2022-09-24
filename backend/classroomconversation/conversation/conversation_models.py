from pydantic import BaseModel


class Node(BaseModel):
    id: str
    shape: str


class Illustration(Node):
    img: str


class ConversationNode(Node):
    label: str
    illustrations: list[Illustration]


class LinkedConversationItem(ConversationNode):
    probability: float | None


class Response(ConversationNode):
    links: list[Node]


class Choice(ConversationNode):
    responses: list[Response]
