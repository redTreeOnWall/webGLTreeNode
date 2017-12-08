



console.log("hellow node!");
//树
class Tree {
    tree: Array<TreeNode> = [];
}
//树的节点
class TreeNode {
    id: number;
    name: string;
    parent: TreeNode;
    tree: Tree;
    children:Array<TreeNode>=[];
    constructor(name: string, tree: Tree) {
        this.name = name;
        this.tree = tree;
        this.tree.tree[this.tree.tree.length] = this;
    }
    tojsonobj() {
        var l = this.tree.tree;
        var rootjo:TreeNode|null =null;
        for (var t in l) {
            var jo = {
                node: l[t],
                children: {}
            }
           if (l[t].parent != undefined) {
                l[t].parent.children[l[t].parent.children.length]=l[t]
            } else{
                rootjo = l[t];
            }
        }
        return rootjo;
    }
}
//test
class NodeMain {
    static main() {

    };
    static test() {
        var tree = new Tree();
        var root = new TreeNode("root", tree);
        var c1 = new TreeNode("c1", tree);
        var c2 = new TreeNode("c2", tree);
        var c3 = new TreeNode("c3", tree);
        c1.parent = root;
        c2.parent = root;
        c3.parent = c2;
        var rt = c3.tojsonobj();
        return rt;
    }
}