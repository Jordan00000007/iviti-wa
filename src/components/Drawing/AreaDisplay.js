import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected } from "../../store/areas";


const AreaDisplay=(props)=> {

    // const [polygons, setPolygons] = useState([
    //     [{"x":460,"y":173},{"x":553,"y":303},{"x":429,"y":374},{"x":55,"y":301},{"x":107,"y":90},{"x":257,"y":311},{"x":303,"y":127}],
    //     [{"x":727,"y":119},{"x":776,"y":202},{"x":603,"y":218},{"x":580,"y":102}],
    // ])

    const [areaShapeArr, setAreaShapeArr] = useState([])
    const [areaNameArr, setAreaNameArr] = useState([[,]])

    const [lineNameArr, setLineNameArr] = useState([[,]])
    const [lineRelationArr, setLineRelationArr] = useState([[,]])
    const [linePointArr, setLinePointArr] = useState([[[],[]]])

    const areaShape=useSelector((state) => state.areas.areaShapeArr);
    const areaName=useSelector((state) => state.areas.areaNameArr);
    const linePoint=useSelector((state) => state.areas.linePointArr);
    const lineRelation=useSelector((state) => state.areas.lineRelationArr);
    const lineName= useSelector((state) => state.areas.lineNameArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const linePanel = useSelector((state) => state.areas.linePanel);
    
    const areaDependOn = useSelector((state) => state.areas.areaDependOn);

    const [selectedOrder, setSelectedOrder] = useState(1);
    const [mouseOverOrder, setMouseOverOrder] = useState(-1);

    const dispatch = useDispatch();

    const getMax = (array, propName) => {
        var max = 0;
        var maxItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] > max) {
                max = item[propName];
                maxItem = item;
            }
        }
        return maxItem;
    }

    const getMin = (array, propName) => {
        var min = 999;
        var minItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] < min) {
                min = item[propName];
                minItem = item;
            }
        }
        return minItem;
    }

    const getLabelX = (polygons) => {

       if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist=[];
            polygons.forEach(function (item, idx) {
                let obj={}
                obj.id=idx;
                obj.dist=Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");
            return polygons[obj.id].x;
        }
        
        return 0;
    }

    const getLabelY = (polygons) => {

        if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist=[];
            polygons.forEach(function (item, idx) {
                let obj={}
                obj.id=idx;
                obj.dist=Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");
            return polygons[obj.id].y;
        }
        
        return 0;
    }

    const handleAreaSelected=(idx)=>{
        setSelectedOrder(idx);
        dispatch(areaSelected(idx));
    }


    useEffect(() => {
        setAreaShapeArr(areaShape); 
    }, [areaShape]);

    useEffect(() => {
        setAreaNameArr(areaName);
        setSelectedOrder(areaEditingIndex);  
    }, [areaName]);

    useEffect(() => {
        setLineNameArr(lineName);
    }, [lineName]);

    useEffect(() => {
        setLinePointArr(linePoint);
    }, [linePoint]);

    useEffect(() => {
        setLineRelationArr(lineRelation);
    }, [lineRelation]);

    useEffect(() => {
        setSelectedOrder(props.areaEditingIndex);
    }, [props.areaEditingIndex]);


    
   
    return (

      
        <>

            {areaShapeArr.map((item, idx) => (
                  
                (!(((props.mode==='edit')||(props.mode==='line'))&&(areaEditingIndex===idx))) &&
                <Group key={`polygon_${idx}`}>
                
                    <Line
                        key={`area_${idx}`}
                        strokeWidth={0}
                        stroke="red"
                        opacity={0.2}
                        lineJoin="round"
                        fill="red"
                        points={item
                            .flatMap(item => [item.x, item.y])
                            .concat([item[0].x, item[0].y])}
                        onClick={event => {
                            //
                            handleAreaSelected(idx)
                            //props.onClick(event, props.polygons[idx], props.polygonsName[idx], idx);
                        }}
                        //onClick={handleAreaSelected(idx)}
                        onMouseOver={event=>{
                            
                            //setSelected(true);
                            if (props.mode==='select') setMouseOverOrder(idx);
                           
                        }}
                        onMouseOut={event=>{
                        
                            //setSelected(false);
                            if (props.mode==='select') setMouseOverOrder(-1);
                        }}
                        closed={true}
                    />
                    <Line
                        key={`line_${idx}`}
                        strokeWidth={((mouseOverOrder===idx)||(selectedOrder===idx))?3:0}
                        stroke="red"
                        opacity={1}
                        lineJoin="round"
                    
                        points={item
                            .flatMap(item => [item.x, item.y])
                            .concat([item[0].x, item[0].y])}
                        closed={false}
                    />
                    <Label x={getLabelX(item)-60} y={getLabelY(item)-32 } key={`label_${idx}`}>
                        <Tag
                            key={`tag_${idx}`}
                            fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'white':'red'}
                            opacity={((mouseOverOrder===idx)||(selectedOrder===idx))?1:0.5}
                            cornerRadius={10}
                            stroke='red'
                            strokeWidth={2}
                        />
                        <Text text={'  '+areaNameArr[idx][1]+'  '} 
                            key={`text_${idx}`}
                            fontSize={14}
                            fontFamily="roboto"
                            fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'red':'white'}
                            padding={6}
                            height={24}
                            lineHeight={1}
                        />
                    </Label>        

                    {/* Line A*/}
                    {
                        (linePanel) &&
                        <>
                        <Line
                            strokeWidth={3}
                            stroke="blue"
                            opacity={1}
                            lineJoin="round"
                            Draggable={props.lineMode}
                            points={linePointArr[idx][0]}
                            //points={[50,50,100,100]}
                            onClick={event => {
                            }}
                            onDragMove={event => {
                            }}
                            closed={false}
                        />

                        {
                            (linePointArr[idx][0].length>0) &&
                        
                            <Label x={linePointArr[idx][0][2]+5} y={linePointArr[idx][0][3]+5}>
                                <Tag
                                    fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'white':'blue'}
                                    opacity={((mouseOverOrder===idx)||(selectedOrder===idx))?1:0.5}
                                    cornerRadius={10}
                                    stroke={"blue"}
                                    strokeWidth={2}
                                />
                                <Text text={`  ${lineNameArr[idx][0]}  `}
                                    fontSize={14}
                                    fontFamily="roboto"
                                    fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'blue':'white'}
                                    padding={6}
                                    height={24}
                                    lineHeight={1}
                                />
                            </Label>
                        }
                       
                        </>
                    }    

                    
                    {/* Line B*/}
                    {
                        
                        (linePanel) &&
                        <>
                        <Line
                            strokeWidth={3}
                            stroke="blue"
                            opacity={1}
                            lineJoin="round"
                            Draggable={props.lineMode}
                            points={linePointArr[idx][1]}
                            onClick={event => {
                            }}
                            onDragMove={event => {
                            }}
                            closed={false}
                        />

                        {
                            (linePointArr[idx][1].length>0) &&
                            <Label x={linePointArr[idx][1][2]+5} y={linePointArr[idx][1][3]+5}>
                            <Tag
                                fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'white':'blue'}
                                opacity={((mouseOverOrder===idx)||(selectedOrder===idx))?1:0.5}
                                cornerRadius={10}
                                stroke={"blue"}
                                strokeWidth={2}
                            />
                            <Text text={`  ${lineNameArr[idx][1]}  `}
                                fontSize={14}
                                fontFamily="roboto"
                                fill={((mouseOverOrder===idx)||(selectedOrder===idx))?'blue':'white'}
                                padding={6}
                                height={24}
                                lineHeight={1}
                            />
                            </Label>
                        }
                        </>
                    }    


                </Group>
            ))}

        </>
    )

}

export default AreaDisplay;