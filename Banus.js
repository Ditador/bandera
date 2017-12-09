var fund;
var img;
var mouseXant;
var mouseYant;
var bols = [];

var minX;
var minY;
var maxX;
var maxY;

var minXimg;
var minYimg;
var maxXimg;
var maxYimg;

var zise = 500;

function preload() {
    img = loadImage('Patrocinadores.png');
}

function setup() {
    createCanvas(innerWidth,innerHeight);
    noStroke();
    
    fund = color(255);
    
    minX = width/2 - zise/2;
    maxX = width/2 + zise/2;
    minY = height/2 - zise/2;
    maxY = height/2 + zise/2;
    
    minXimg = 0;
    maxXimg = img.width;
    minYimg = 0;
    maxYimg = img.height;
    
    bol = {
        x: width/2,
        y: height/2,
        fx: width/2,
        fy: height/2,
        w: zise,
        h: zise,
        min: 2,
        cor: color(0),
        velox: 0,
        veloy: 0,
        movendo: function() {
            return !(this.x == this.fx && this.y == this.fy);
        },
        getColor: function() {
            x = map(this.fx, minX, maxX, minXimg, maxXimg);
            y = map(this.fy, minY, maxY, minYimg, maxYimg);
            this.cor = color(img.get(x,y));
        },
        animarCima:function() {
            this.x += (this.fx -this.x) *0.05;
            this.y += (this.fy -this.y) *0.05;
        },
        animarBaxu: function() {
            if(this.x != this.fx){
                if (abs(this.fx - this.x) < abs(this.velox)) {
                    this.x = this.fx;
                } else {
                    this.x += this.velox;
                }
            }
            if(this.x != this.fy){
                if (abs(this.fy - this.y) < abs(this.veloy)) {
                    this.y = this.fy;
                } else {
                    this.y += this.veloy;
                }
            }
        },
        getVelo() {
            this.velox = (this.fx - this.x) / 30;
            this.veloy = (this.fy - this.y) / 30;
        },
        split:function() {
            w = this.w / 2;
            h = this.h / 2;
            if ( w < this.min ) {
                return [this];
            }
            
            let bols = [];
            for(let i=0; i < 4; i++) {
                bols.push(Object.create(bol));
                bols[i].w = w;
                bols[i].h = h;
                bols[i].x = this.x;
                bols[i].y = this.y;
            }
            bols[0].fx = this.x-w/2;
            bols[0].fy = this.y-h/2;
            bols[1].fx = this.x+w/2;
            bols[1].fy = this.y-h/2;
            bols[2].fx = this.x-w/2;
            bols[2].fy = this.y+h/2;
            bols[3].fx = this.x+w/2;
            bols[3].fy = this.y+h/2;  
    
            for(i=0;i<4;i++) {
                bols[i].getColor();
                bols[i].getVelo();
            }
            
            return bols;
        }
    }
    
    bol.getColor();
    bols.push(bol);
    
}

function draw() {
    background(fund);
    for(let i=bols.length-1; i >=0 ; i--) {
        let b = bols[i];
        fill(b.cor);
        if(similarColor(b.cor, fund)) {
            stroke(200);
            strokeWeight(1);
        } else {
            noStroke();
        }
        b.animarBaxu();
        ellipse(b.x,b.y,b.w,b.h);
        
        if (!b.movendo()) {
            if (dist(mouseXant, mouseYant,b.x,b.y) > b.w / 2) {
                if (dist(mouseX, mouseY,b.x,b.y) < b.w / 2) {
                    novas = b.split();
                    bols.splice(i,1);
                    Array.prototype.push.apply(bols,novas);
                }
            }
        }
    }
    mouseXant = mouseX;
    mouseYant = mouseY;
}
    
function dist(ax, ay, bx, by) {
    dist = Math.sqrt((ax -bx)^2 + (ay - by)^2);
    return dist;
}

function similarColor(cor_a, cor_b) {
    let a = cor_a.levels;
    let b = cor_b.levels;
    
    for(let i = 0; i < 4; i++) {
        if(abs(a[i] - b[i]) > 20) {
            return false;
        }
    }
    return true;
}