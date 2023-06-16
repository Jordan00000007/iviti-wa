import log from "./console";
const geometric = require("geometric");


const lineIntersectsPolygon=(myLine,myPolygon)=>{

    //const line=[[115,150],[1037,150]]
    //const polygon = [[476, 150],[546, 150],[546, 110],[566, 53],[574, 50],[576, 20],[578, 50],[586, 53],[606, 110],[606, 150],[676, 150],[676, 270],[476, 270]];

    let tmpPoly=[]
    myPolygon.forEach(ele => {
        tmpPoly.push([ele.x,ele.y])
    });

    return(geometric.lineIntersectsPolygon(myLine, tmpPoly));


}

export const lineInPolygon=(myLine,myPolygon)=>{

    //const line=[[115,150],[1037,150]]
    //const polygon = [[476, 150],[546, 150],[546, 110],[566, 53],[574, 50],[576, 20],[578, 50],[586, 53],[606, 110],[606, 150],[676, 150],[676, 270],[476, 270]];

    let tmpPoly=[]
    myPolygon.forEach(ele => {
        tmpPoly.push([ele.x,ele.y])
    });

    let ans=false;
    if ((geometric.pointInPolygon(myLine[0],tmpPoly))&&(geometric.pointInPolygon(myLine[1],tmpPoly))){
        ans=true;
    }
 
    return ans;

}

export default lineIntersectsPolygon;