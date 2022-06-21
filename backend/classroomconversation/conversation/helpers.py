import xml.etree.ElementTree as ElementTree
from .const import DIAMOND, HEXAGON, OCTAGON, RECTANGLE, STAR


def get_graphml():
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


def get_node_data_key(root):
    graphml = get_graphml()
    for key in root.findall(graphml.get("key")):
        if key.get("yfiles.type") and key.get("yfiles.type") == "nodegraphics":
            return key.get("id")
    return ""


def get_edge_data_key(root):
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


def get_all_nodes(graph):
    graphml = get_graphml()
    return graph.findall(graphml.get("node"))


def get_all_edges(graph):
    graphml = get_graphml()
    return graph.findall(graphml.get("edge"))


def get_edge_data(edge, root):
    data_key = get_edge_data_key(root)
    return edge.find(get_graphml().get("data") + "[@key='" + data_key + "']")


def get_node_by_id(id, graph):
    graphml = get_graphml()
    node = graph.find(graphml.get("node") + "[@id='" + id + "']")
    return node if node else None


### LABEL HELPERS ###


def get_node_label(node, root):
    data_key = get_node_data_key(root)

    graphml = get_graphml()
    data = node.find(graphml.get("data") + "[@key='" + data_key + "']")
    shapenode = data.find(graphml.get("shapenode"))
    labels = shapenode.findall(graphml.get("nodelabel"))

    for label in labels:
        if label.text and len(label.text.strip()) > 0:
            return label.text
    return ""


def get_edge_label(edge, root):
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


def get_node_shape(node, root):
    node_shape = None
    graphml = get_graphml()
    data_key_id = get_node_data_key(root)
    graph_key = graphml.get("data") + "[@key='" + data_key_id + "']"
    data = node.find(graph_key)
    shapenode = data.find(graphml.get("shapenode"))

    if shapenode is not None:
        node_shape = shapenode.find(graphml.get("shape")).get("type")
    return node_shape if node_shape else None


def is_node_shape(shape, node, root):
    node_shape = get_node_shape(node, root)
    return shape in node_shape if node_shape else False


def is_diamond(node, root):
    node_shape = get_node_shape(node, root)
    return DIAMOND in node_shape if node_shape else False


def is_star(node, root):
    node_shape = get_node_shape(node, root)
    return STAR in node_shape if node_shape else False


def is_rectangle(node, root):
    node_shape = get_node_shape(node, root)
    return RECTANGLE in node_shape if node_shape else False


def is_octagon(node, root):
    node_shape = get_node_shape(node, root)
    return OCTAGON in node_shape if node_shape else False


def is_hexagon(node, root):
    node_shape = get_node_shape(node, root)
    return HEXAGON in node_shape if node_shape else False


def get_all_rectangles(graph, root):
    return [node for node in get_all_nodes(graph) if is_rectangle(node, root)]


### PARSER HELPERS ###


def find_answers(edges, uniform, root, graph):
    answers = []
    for edge in edges:
        target = edge.get("target")
        node = get_node_by_id(target, graph)
        shape = get_node_shape(node, root)
        if not is_hexagon(node, root):
            if not uniform:
                probability = 0
                try:
                    probability = float(get_edge_label(edge, root))
                except ValueError:
                    pass

                answers.append(
                    {"id": target, "shape": shape, "probability": probability}
                )
            else:
                answers.append({"id": target, "shape": shape})
    return answers


def find_alternatives(edges, root, graph):
    alternatives = []
    for edge in edges:
        target = edge.get("target")
        node = get_node_by_id(target, graph)
        if not is_hexagon(node, root):
            alternatives.append(target)
    return alternatives


def is_valid_img_src(src: str) -> bool:
    # TODO: FIX
    PERMITTED_IMG_SOURCES = ["*"]
    def is_permitted():
        if not PERMITTED_IMG_SOURCES:
            return False
        if PERMITTED_IMG_SOURCES[0] == "*":
            return True
        # TODO: get base domain
        if src in PERMITTED_IMG_SOURCES:
            return True
        return False
    return is_permitted()


def find_illustrations(edges, root, graph):
    # TODO: Move validation to validation.py
    errors = []
    illustrations = []
    for edge in edges:
        target = edge.get("target")
        node = get_node_by_id(target, graph)
        if is_hexagon(node, root):
            label = get_node_label(node, root)
            if is_valid_img_src(label):
                illustrations.append(
                    {"id": target, "img": label}
                )
            else:
                errors.append(f"Illustration linked to {target} is not a valid image source.")

    return illustrations, errors
