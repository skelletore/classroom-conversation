# Start & End nodes
START_NODE: str = "star"
START_NODE_ALT_1: str = "star5"
START_NODE_ALT_2: str = "star6"
START_NODE_ALT_3: str = "star8"
END_NODE: str = "octagon"
# User's choice nodes
CHOICE_NODE: str = "roundrectangle"
# Partner's (e.g. pupil's) nodes
RESPONSE_NODE: str = "diamond"

# Illustration nodes
## Illustrations that are associated with a node, such as a choice.
## Displayed automatically when the associated node is 'active'
ILLUSTRATION_DEFAULT_NODE: str = "hexagon"
## Illustrations that can be selected by the user
ILLUSTRATION_CHOICE_NODE: str = "ellipse"

START_NODES: list[str] = [
  START_NODE,
  START_NODE_ALT_1,
  START_NODE_ALT_2,
  START_NODE_ALT_3,
]

VALID_SHAPES = START_NODES + [
  END_NODE,
  CHOICE_NODE,
  RESPONSE_NODE,
  ILLUSTRATION_DEFAULT_NODE,
  ILLUSTRATION_CHOICE_NODE,
]
