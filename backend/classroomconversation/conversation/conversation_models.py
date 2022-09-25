from pydantic import BaseModel


class Node(BaseModel):
    id: str
    shape: str
    label: str


class Illustration(Node):
    pass


class ConversationNode(Node):
    illustrations: list[Illustration]


class LinkedConversationItem(ConversationNode):
    probability: float | None


class Response(ConversationNode):
    links: list[Node]


class Choice(ConversationNode):
    responses: list[Response]


class IllustrationChoice(ConversationNode, Illustration):
    pass
