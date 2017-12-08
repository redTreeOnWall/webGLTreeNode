



//declare var THREE :any;
/**
 * 
 */
class World {

    /**
     * 
     */
    public constructor(name: string) {
        this.worldName = name;
    }
    worldName: string;
    /**
     * 
     */
    screenWidth: number;
    /**
     * 
     */

    screenHeight: number;
    /**
     * 
     */
    canvas: HTMLElement;
    /**
     * THREE render
     */
    renderer: THREE.WebGLRenderer;
    /**
     * three scence
     */
    scence: any;
    /**
     * 
     */
    camTag:THREE.Object3D;
    mainCamera: THREE.PerspectiveCamera;
    /**
     * 
     */
    objs: GameObjs;

    root:NodeG;
    mouseCtr:MouseControler;
    /**
     * 
     */
    init(): void {

        this.mouseCtr = new MouseControler();


        // TODO implement here
        Log.log(this.worldName + "  init")

        console.log("world innit :" + this.worldName);
        this.canvas = <HTMLElement>document.getElementById("webGl");
        //设置屏幕宽度和高度
        this.screenWidth = this.canvas.clientWidth;
        this.screenHeight = this.canvas.clientHeight;
        console.log(this.canvas);
        //设置渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha:true
        });
        this.renderer.setSize(this.screenWidth, this.screenHeight);//将渲染的大小设为与Canvas相同
        this.renderer.setClearColor(0x000000, 0.8);//设置默认颜色与透明度
        //    this.renderer.shadowMapEnabled=true;



        //初始化场景
        this.scence = new THREE.Scene();
        //初始化所有对象，并且添加场景对象


        var n = new NodeG(undefined, this.scence);
        this.root =n;

        var randTree = (num:number,maxNumber:number,node:NodeG)=>{
            num = num - 1;

            console.log("num:"+num);
            var m = Math.floor(maxNumber*Math.random())+1;
            for(let i =0;i<m;i++){
                node.children[i] = new NodeG(node,this.scence);
                if(num>0){
                    randTree(num,maxNumber,node.children[i])
               }
            }
        }
        randTree(8,3,this.root);


        //摄像机目标
        this.camTag = new THREE.Mesh();

        //设置摄像机
        this.mainCamera = new THREE.PerspectiveCamera(
            60,
            this.screenWidth / this.screenHeight,
            0.1,
            1000
        );
        this.camTag.add(this.mainCamera);
        this.scence.add(this.camTag);


        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(30, 20, 30);
        this.camTag.add(light);




        this.mainCamera.position.set(10, 0, 0);
      this.mainCamera.rotation.set(0,0.5*Math.PI,0);
        //  this.scence.add(this.mainCamera);
        console.log(this.mainCamera.rotation);
        console.log(this.mainCamera.getWorldPosition());

        // camT.add(this.mainCamera);
        var tree = NodeMain.test();
        console.log(this.scence);
    }

    /**
     *
     */
    update(): void {
    //    this.scence.updateMatrixWorld(true);
        this.renderer.render(this.scence, this.mainCamera);
        if(this.mouseCtr.isMouseDown){
            this.camTag.rotateY(-this.mouseCtr.getDx()*0.01);
        }else{
            this.root.ball.rotateY(0.002);
        }
       // this.root.ball.rotateY(0.01);
        // console.log( this.root)
    }

}

//表示一个节点图形
class NodeG {
    parent: NodeG;
    ball: THREE.Mesh;
    line: THREE.Line;
    name: string;
    id: number;
    color: THREE.Color;
    treeNode: TreeNode;
    children:Array<NodeG>=[];
    l:number;
    iter(n:NodeG,docall:(node:NodeG)=>{}){
        docall(n);
        if(n.children.length>0){
            for(var i in n.children){
                this.iter(n.children[i],docall);
            }
        }else{
            console.log("end path");
        }
    }
    constructor(parent: NodeG | undefined, scene: THREE.Scene) {
        this.l =3;
        //创建一个边长为1的球体
        //生成随机颜色
        var c = new THREE.Color();
        var cut1 = Math.random();
        var cut2 = Math.random();
        var cut3 = Math.random();
        var allC =  cut1+cut2+cut3;
        var r = 1.5*cut1/allC;
        var g = 1.5*cut2/allC;
        var b = 1.5* cut3/allC;
        c.setRGB(r,g,b);

       var object = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshPhongMaterial({ color: c, shininess: 1000 ,specular:0xffffff}));
        // var object = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshNormalMaterial());
        this.ball = object;
        if (parent == undefined) {
            object.material =new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 1000 ,specular:0xffffff});
            scene.add(object);
        } else {

            parent.children[parent.children.length] = this;
            //划线

            var cyg = new THREE.CylinderGeometry(0.02,0.02,this.l);
            var line =  new THREE.Mesh(cyg, new THREE.MeshPhongMaterial({ color:0xffffff, shininess: 10000 ,specular:0xffffff}));
            var lobg =  new THREE.Object3D();
            lobg.add(line);
            line.position.setY(this.l/2);
            //把这条线加入场景中
            parent.ball.add(lobg);

            lobg.add(object);
            object.position.setY(this.l);
            var randx =2* Math.PI*Math.random();
            var randy =2* Math.PI*Math.random();
            var randz =2* Math.PI*Math.random();
            lobg.rotation.set(randx,randy,randz);

            //控制位置
            /*
           var ey = Math.random() * 2* Math.PI;
           var ex = Math.random() * 2 * Math.PI;

            // var ey = Math.PI/2;
            // var ex = Math.PI/2;
            //投影
            var sha = this.l * Math.cos(ex);
            var x = sha * Math.cos(ey);
            var z = sha * Math.sin(ey);
            var y = this.l *Math.sin(ex);
            // var sha = this.l * Math.cos(ex);
            // var x = 0.5;
            // var z = 0;
            // var y = 0;

            console.log("==============");
            console.log(parent.ball.position);
            console.log(Math.pow((x*x+y*y+z*z),0.5));

            var v =  new THREE.Vector3(
                x,
                y,
                z,
            );
            console.log("v------");
            console.log(v);

          //  object.position.set(v.x,v.y,v.z);
          //  parent.ball.add(object);
            console.log("+++++++++++++")
            console.log(parent.ball.getWorldPosition());
            console.log(object.getWorldPosition());
            */

        }
    }
}


class MouseControler{
    isMouseDown:boolean = false;;
    deltPos:{x:number,y:number} = {
        x:0,
        y:0
    }
    thisPos:{x:number,y:number} = {
        x:0,
        y:0
    }
    dx:number = 0;;
    constructor(){
        console.log("mouse--------------------");
        document.addEventListener("mousemove",(e:any)=>{
            this.thisPos.x =e.pageX;
        },false);
        document.addEventListener("mousedown",(e:any)=>{
            this.thisPos.x =e.pageX;
            this.deltPos.x =e.pageX;;
            this.isMouseDown = true;
        },false);

        document.addEventListener("mouseup",()=>{
            this.isMouseDown = false;
        },false)
    }
    getDx(){
        this.dx = this.thisPos.x-this.deltPos.x;
        this.deltPos.x =this.thisPos.x;
        return this.dx;
    }
}