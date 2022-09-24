from typing import Tuple
import xml.etree.ElementTree as ElementTree
from urllib.parse import urlparse
import re

from .const import START_NODE, END_NODE, CHOICE_NODE, RESPONSE_NODE, ILLUSTRATION_DEFAULT_NODE, ILLUSTRATION_CHOICE_NODE
from .conversation_models import Illustration, LinkedConversationItem, Node


def get_graphml() -> dict[str, str]:
    return {
        "graph": "{http://graphml.graphdrawing.org/xmlns}graph",
        "key": "{http://graphml.graphdrawing.org/xmlns}key",
        "node": "{http://graphml.graphdrawing.org/xmlns}node",
        "edge": "{http://graphml.graphdrawing.org/xmlns}edge",
        "data": "{http://graphml.graphdrawing.org/xmlns}data",
        "shapenode": "{http://www.yworks.com/xml/graphml}ShapeNode",
        "geometry": "{http://www.yworks.com/xml/graphml}Geometry",
        "fill": "{http://www.yworks.com/xml/graphml}Fill",
        "boderstyle": "{http://www.yworks.com/xml/graphml}BorderStyle",
        "nodelabel": "{http://www.yworks.com/xml/graphml}NodeLabel",
        "shape": "{http://www.yworks.com/xml/graphml}Shape",
        "polyLine": "{http://www.yworks.com/xml/graphml}PolyLineEdge",
        "arrow": "{http://www.yworks.com/xml/graphml}Arrows",
        "bendStyle": "{http://www.yworks.com/xml/graphml}BendStyle",
        "path": "{http://www.yworks.com/xml/graphml}Path",
        "linestyle": "{http://www.yworks.com/xml/graphml}LineStyle",
        "edgelabel": "{http://www.yworks.com/xml/graphml}EdgeLabel",
    }


########## VALIDATION HELPERS ###############


def get_node_data_key(root) -> str:
    graphml = get_graphml()
    for key in root.findall(graphml.get("key")):
        if key.get("yfiles.type") and key.get("yfiles.type") == "nodegraphics":
            return key.get("id")
    return ""


def get_edge_data_key(root) -> str:
    graphml = get_graphml()
    for key in root.findall(graphml.get("key")):
        if key.get("yfiles.type") and key.get("yfiles.type") == "edgegraphics":
            return key.get("id")
    return ""


def get_tree_root_graph(file):
    graphml = get_graphml()
    file.seek(0)
    tree = ElementTree.parse(file)
    root = tree.getroot()
    graph = root.find(graphml.get("graph"))

    return (tree, root, graph, graphml)


def get_all_nodes(graph) -> list[Node]:
    graphml = get_graphml()
    return graph.findall(graphml.get("node"))


def get_all_edges(graph):
    graphml = get_graphml()
    return graph.findall(graphml.get("edge"))


def get_edge_data(edge, root):
    data_key = get_edge_data_key(root)
    return edge.find(get_graphml().get("data") + "[@key='" + data_key + "']")


def get_node_by_id(id, graph) -> Node:
    graphml = get_graphml()
    node = graph.find(graphml.get("node") + "[@id='" + id + "']")
    return node if node else None


### LABEL HELPERS ###


def get_node_label(node, root) -> str:
    data_key = get_node_data_key(root)

    graphml = get_graphml()
    data = node.find(graphml.get("data") + "[@key='" + data_key + "']")
    shapenode = data.find(graphml.get("shapenode"))
    labels = shapenode.findall(graphml.get("nodelabel"))

    for label in labels:
        if label.text and len(label.text.strip()) > 0:
            return label.text
    return ""


def get_edge_label(edge, root) -> str:
    graphml = get_graphml()
    data = get_edge_data(edge, root)
    line = data.find(graphml.get("polyLine"))

    if not line:
        return ""

    edgelabel = line.find(graphml.get("edgelabel"))

    if not edgelabel:
        return ""

    return edgelabel.text


### HELPERS NODE SHAPE ###
def get_node_shape(node, root) -> str:
    node_shape = None
    graphml = get_graphml()
    data_key_id = get_node_data_key(root)
    graph_key = graphml.get("data") + "[@key='" + data_key_id + "']"
    data = node.find(graph_key)
    shapenode = data.find(graphml.get("shapenode"))

    if shapenode is not None:
        node_shape = shapenode.find(graphml.get("shape")).get("type")
    return node_shape if node_shape else None


def is_node_shape(shape, node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return shape in node_shape if node_shape else False


def is_start_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return START_NODE in node_shape if node_shape else False


def is_end_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return END_NODE in node_shape if node_shape else False


def is_choice_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return CHOICE_NODE in node_shape if node_shape else False


def is_response_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return RESPONSE_NODE in node_shape if node_shape else False


def is_illustration_default_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return ILLUSTRATION_DEFAULT_NODE in node_shape if node_shape else False


def is_illustration_choice_node(node, root) -> bool:
    node_shape = get_node_shape(node, root)
    return ILLUSTRATION_CHOICE_NODE in node_shape if node_shape else False


def is_conversation_item_node(node, root) -> bool:
    if is_choice_node(node, root) or is_response_node(node, root):
        return True
    return False


def is_illustration_node(node, root) -> bool:
    if is_illustration_default_node(node, root) or is_illustration_choice_node(node, root):
        return True
    return False


def get_all_choices(graph, root) -> list[Node]:
    return [node for node in get_all_nodes(graph) if is_choice_node(node, root)]


def get_all_responses(graph, root) -> list[Node]:
    return [node for node in get_all_nodes(graph) if is_response_node(node, root)]


def get_all_conversation_items(graph, root) -> list[Node]:
    return [node for node in get_all_nodes(graph) if is_conversation_item_node(node, root)]


def get_all_illustrations(graph, root) -> list[Node]:
    return [node for node in get_all_nodes(graph) if is_illustration_node(node, root)]


### PARSER HELPERS ###
def find_linked_conversation_items(edges, uniform, root, graph) -> list[LinkedConversationItem]:
    responses = []
    for edge in edges:
        target = edge.get("target")
        node = get_node_by_id(target, graph)
        shape = get_node_shape(node, root)
        if is_conversation_item_node(node, root):
            if not uniform and is_response_node(node, root):
                probability = 0
                try:
                    probability = float(get_edge_label(edge, root))
                except ValueError:
                    pass

                responses.append(
                    {"id": target, "shape": shape, "probability": probability}
                )
            else:
                responses.append({"id": target, "shape": shape})
    return responses


def is_valid_img_src(src: str) -> bool:
    PERMITTED_IMG_SOURCES = ["internal"]    # use ["*"] to allow any source
    def is_permitted():
        if not PERMITTED_IMG_SOURCES or len(PERMITTED_IMG_SOURCES) < 1:
            return False
        if "*" in PERMITTED_IMG_SOURCES:
            return True
        try:
            # split url
            url = urlparse(src)
            # no domain, i.e. internally hosted
            if url.netloc == "":
                # ensure that path, i.e. image name, is valid
                return re.match(r"^[a-zA-Z0-9-_]{1,}$", url.path)
            if url.netloc in PERMITTED_IMG_SOURCES:
                return True
            return False
        except Exception as error:
            print(f"An error occurred while validating image source '{src}'.")
            print(error)
            return False
    return is_permitted()


def find_illustrations(edges, root, graph, uniform, illustration_type = "any") -> Tuple[list[Illustration], list[str]]:
    if (illustration_type and illustration_type not in ["any", "default", "choice"]) or illustration_type == None:
        illustration_type = "any"
    errors: list[str] = []
    illustrations: list[Illustration] = []
    for edge in edges:
        target_id = edge.get("target")
        node = get_node_by_id(target_id, graph)

        links = find_linked_conversation_items(edges, uniform, root, graph)

        if (
            illustration_type == "any" and is_illustration_node(node, root)
        ) or (
            illustration_type == "default" and is_illustration_default_node(node, root)
        ) or (
            illustration_type == "choice" and is_illustration_choice_node(node, root)
        ):
            label = get_node_label(node, root)
            shape = get_node_shape(node, root)

            # prefix internals with /illustration/
            if re.match(r"^[a-zA-Z0-9-_]{1,}$", label):
                label = f"/illustration/{label}"
            illustrations.append({"id": target_id, "img": label, "shape": shape, "links": links})                
    
    return illustrations, errors
