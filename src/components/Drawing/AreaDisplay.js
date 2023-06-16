import log from "../../utils/console";
import {lineInPolygon} from "../../utils/geometric";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected } from "../../store/areas";
import LabelButton from '../../components/Buttons/LabelButton';
import { lineADelete, lineBDelete, areaDelete,lineAUpdate,lineBUpdate,areaUpdate } from "../../store/areas";
import { LegendToggle } from "@mui/icons-material";



const AreaDisplay = forwardRef((props, ref) => {

    const [areaShapeArr, setAreaShapeArr] = useState([])
    const [areaNameArr, setAreaNameArr] = useState([[,]])

    const [lineNameArr, setLineNameArr] = useState([[,]])
    const [lineRelationArr, setLineRelationArr] = useState([[,]])
    const [linePointArr, setLinePointArr] = useState([[[], []]])

    const areaShape = useSelector((state) => state.areas.areaShapeArr);
    const areaName = useSelector((state) => state.areas.areaNameArr);
    const linePoint = useSelector((state) => state.areas.linePointArr);
    const lineRelation = useSelector((state) => state.areas.lineRelationArr);
    const lineName = useSelector((state) => state.areas.lineNameArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const linePanel = useSelector((state) => state.areas.linePanel);


    const drawWidth = useSelector((state) => state.sources.drawWidth);
    const drawHeight = useSelector((state) => state.sources.drawHeight);

    const areaDependOn = useSelector((state) => state.areas.areaDependOn);

    const [selectedOrder, setSelectedOrder] = useState(1);
    const [mouseOverOrder, setMouseOverOrder] = useState(-1);

    const [lineASelected, setLineASelected] = useState(false);
    const [lineBSelected, setLineBSelected] = useState(false);
    const [lineAHover, setLineAHover] = useState(false);
    const [lineBHover, setLineBHover] = useState(false);

    const [stopBubble, setStopBubble] = useState(false);


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

    const getLabelX = (polygons, myText) => {

        if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist = [];
            polygons.forEach(function (item, idx) {
                let obj = {}
                obj.id = idx;
                obj.dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");
            //log('myText.length='+myText.length)
            //const myOffset=((myText.length)/2)*20;
            const myOffset = Math.round(6.66 * myText.length) + 33;
            return polygons[obj.id].x - myOffset;
        }

        return 0;
    }

    const getLabelY = (polygons) => {

        if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist = [];
            polygons.forEach(function (item, idx) {
                let obj = {}
                obj.id = idx;
                obj.dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");
            return polygons[obj.id].y;
        }

        return 0;
    }

    const handleAreaSelected = (idx) => {
        setSelectedOrder(idx);
        dispatch(areaSelected(idx));
    }

    
    const updateLineA = (x, y) => {

        let tmpLine=[];
        tmpLine.push(linePoint[areaEditingIndex][0][0]+x);
        tmpLine.push(linePoint[areaEditingIndex][0][1]+y);
        tmpLine.push(linePoint[areaEditingIndex][0][2]+x);
        tmpLine.push(linePoint[areaEditingIndex][0][3]+y);
        dispatch(lineAUpdate(tmpLine))
    }

    const updateLineB = (x, y) => {

        let tmpLine=[];
        tmpLine.push(linePoint[areaEditingIndex][1][0]+x);
        tmpLine.push(linePoint[areaEditingIndex][1][1]+y);
        tmpLine.push(linePoint[areaEditingIndex][1][2]+x);
        tmpLine.push(linePoint[areaEditingIndex][1][3]+y);
        dispatch(lineBUpdate(tmpLine))
    }

    const cloneData = (myPoly) => {

        let myArr = [];
        myPoly.forEach(function (item) {
            let myItem = {};
            myItem.x = item.x;
            myItem.y = item.y;
            myArr.push(myItem);
        });

        return myArr;

    }

    const updatePosition = (group) => {

        const x=group.x();
        const y=group.y();

        let tmpPolygons = cloneData(areaShapeArr[areaEditingIndex]);
    
        let minX = 0;
        let minY = 0;
        let maxX = drawWidth;
        let maxY = drawHeight;
        tmpPolygons.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (item.x < minX) minX = item.x;
            if (item.y < minY) minY = item.y;
            if (item.x > maxX) maxX = item.x;
            if (item.y > maxY) maxY = item.y;

        });
        if (minX < 0) {
            tmpPolygons.forEach(function (item, idx) {
                item.x = item.x - minX;
            });
        }
        if (minY < 0) {
            tmpPolygons.forEach(function (item, idx) {
                item.y = item.y - minY;
            });
        }
        if (maxX > drawWidth) {
            tmpPolygons.forEach(function (item, idx) {
                item.x = item.x - (maxX - drawWidth);
            });
        }
        if (maxY > drawHeight) {
            tmpPolygons.forEach(function (item, idx) {
                item.y = item.y - (maxY - drawHeight);
            });
        }
        dispatch(areaUpdate(tmpPolygons));
    
        let tmpLineA = [];
        tmpLineA.push(linePointArr[areaEditingIndex][0][0]+x);
        tmpLineA.push(linePointArr[areaEditingIndex][0][1]+y);
        tmpLineA.push(linePointArr[areaEditingIndex][0][2]+x);
        tmpLineA.push(linePointArr[areaEditingIndex][0][3]+y);
        if (minX < 0){
            tmpLineA[0]=tmpLineA[0]-minX;
            tmpLineA[2]=tmpLineA[2]-minX;
        }
        if (minY < 0){
            tmpLineA[1]=tmpLineA[1]-minY;
            tmpLineA[3]=tmpLineA[3]-minY;
        }
        if (maxX > drawWidth){
            tmpLineA[0]=tmpLineA[0]- (maxX - drawWidth);
            tmpLineA[2]=tmpLineA[2]- (maxX - drawWidth);
        }
        if (maxY > drawHeight){
            tmpLineA[1]=tmpLineA[1]- (maxY - drawHeight);
            tmpLineA[3]=tmpLineA[3]- (maxY - drawHeight);
        }
        dispatch(lineAUpdate(tmpLineA));

        let tmpLineB = [];
        tmpLineB.push(linePointArr[areaEditingIndex][1][0]+x);
        tmpLineB.push(linePointArr[areaEditingIndex][1][1]+y);
        tmpLineB.push(linePointArr[areaEditingIndex][1][2]+x);
        tmpLineB.push(linePointArr[areaEditingIndex][1][3]+y);
        if (minX < 0){
            tmpLineB[0]=tmpLineB[0]-minX;
            tmpLineB[2]=tmpLineB[2]-minX;
        }
        if (minY < 0){
            tmpLineB[1]=tmpLineB[1]-minY;
            tmpLineB[3]=tmpLineB[3]-minY;
        }
        if (maxX > drawWidth){
            tmpLineB[0]=tmpLineB[0]- (maxX - drawWidth);
            tmpLineB[2]=tmpLineB[2]- (maxX - drawWidth);
        }
        if (maxY > drawHeight){
            tmpLineB[1]=tmpLineB[1]- (maxY - drawHeight);
            tmpLineB[3]=tmpLineB[3]- (maxY - drawHeight);
        }
        dispatch(lineBUpdate(tmpLineB));

        group.position({ x: 0, y: 0 });
        group.getLayer().draw();


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

    useImperativeHandle(ref, () => ({

        handleDeleteObject: () => {
            //setShow(true);
            log('delete line on area editing ...')
            if ((!lineASelected) && (!lineBSelected)) {
                dispatch(areaDelete());
            }
            if (lineASelected) {

                dispatch(lineADelete());
                setLineASelected(false);
            }
            if (lineBSelected) {

                dispatch(lineBDelete());
                setLineBSelected(false);
            }
        }

    }));

    return (
        <>
            {areaShapeArr.map((item, idx) => (

                (!(((props.mode === 'edit') || (props.mode === 'line')) && (areaEditingIndex === idx))) &&
                <Group 
                    key={`polygon_${idx}`}
                    draggable={(idx === areaEditingIndex)?true:false}
                    x={0}
                    y={0}
                    onDragStart={event => {
                    }}
                    onDragMove={event => {
                      
                    }}
                    onDragEnd={event => {

                        if(!stopBubble){
                         
                            const group = event.target;
                            updatePosition(group);
                        }
                        setStopBubble(false);
                    
                    }}                
                    onMouseDown={event => {
                       
                    }}
                >

                    <Line
                        key={`area_${idx}`}
                        strokeWidth={0}
                        stroke="red"
                        opacity={0.15}
                        lineJoin="round"
                        fill="red"
                        points={item
                            .flatMap(item => [item.x, item.y])
                            .concat([item[0].x, item[0].y])}
                        onClick={event => {
                            log('area click')
                            if (props.mode === 'select') {
                                handleAreaSelected(idx);
                                setLineASelected(false);
                                setLineBSelected(false);
                                setLineAHover(false);
                                setLineBHover(false);
                            }
                            //props.onClick(event, props.polygons[idx], props.polygonsName[idx], idx);
                        }}
                        //onClick={handleAreaSelected(idx)}
                        onMouseOver={event => {

                            //setSelected(true);
                            if (props.mode === 'select') setMouseOverOrder(idx);

                        }}
                        onMouseOut={event => {

                            //setSelected(false);
                            if (props.mode === 'select') setMouseOverOrder(-1);
                        }}
                        closed={true}
                    />
                    <Line
                        key={`line_${idx}`}
                        strokeWidth={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 3 : 0}
                        stroke="red"
                        opacity={1}
                        lineJoin="round"

                        points={item
                            .flatMap(item => [item.x, item.y])
                            .concat([item[0].x, item[0].y])}
                        closed={false}
                    />
                    <Label x={getLabelX(item, areaNameArr[idx][1])} y={getLabelY(item) - 32} key={`label_${idx}`} >
                        {/* <Label x={0} y={0} key={`label_${idx}`} onClick={(e)=>{log(e.target.parent)}}> */}
                        <Tag
                            key={`tag_${idx}`}
                            fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'white' : 'red'}
                            opacity={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 1 : 0.5}
                            cornerRadius={10}
                            stroke='red'
                            strokeWidth={2}
                        />
                        <Text text={'  ' + areaNameArr[idx][1] + '  '}
                            key={`text_${idx}`}
                            fontSize={14}
                            fontFamily="roboto"
                            fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'red' : 'white'}
                            padding={6}
                            height={24}
                            lineHeight={1}

                        />

                    </Label>

                    {/* Line A*/}
                    {
                        (linePanel) &&
                        <>
                            <Group 
                               
                                Draggable={(idx === areaEditingIndex)?true:false}
                             
                                onDragEnd={event => {

                                    setStopBubble(true);
                                  
                                    const group = event.target;
                                    const x = group.x();
                                    const y = group.y();


                                    let tmpLine=[
                                        [linePoint[areaEditingIndex][0][0]+x,linePoint[areaEditingIndex][0][1]+y],
                                        [linePoint[areaEditingIndex][0][2]+x,linePoint[areaEditingIndex][0][3]+y]
                                    ];
                                 
                                    
                                   
                                    if (lineInPolygon(tmpLine,areaShapeArr[idx])){
                                           
                                        log('inside')

                                        updateLineA(group.x(), group.y());
                                        group.position({ x: 0, y: 0 });
                                        group.getLayer().draw();
                                     
                                    }else{

                                        log('outside')

                                        updateLineA(0, 0);
                                        group.position({ x: 0, y: 0 });
                                        group.getLayer().draw();
                                    }

                                    
                                }}

                              
                            >
                                <>
                                    <Line
                                        strokeWidth={((lineASelected || lineAHover) && (idx === areaEditingIndex)) ? 6 : 3}
                                        stroke="blue"
                                        hitStrokeWidth={25}
                                        opacity={1}
                                        fill="#E2E6EA"
                                        lineJoin="round"
                                        Draggable={false}
                                        points={linePointArr[idx][0]}
                                        onClick={event => {
                                            if (idx === areaEditingIndex){
                                                setLineASelected(true);
                                                setLineBSelected(false);
                                            }
                                        }}
                                        onMouseDown={event => {
                                            if (idx === areaEditingIndex){
                                                setLineASelected(true);
                                                setLineBSelected(false);
                                            }
                                        }}
                                        onMouseOver={event => {
                                            if (idx === areaEditingIndex){
                                                setLineAHover(true);
                                            }
                                        }}
                                        onMouseLeave={event => {
                                            if (idx === areaEditingIndex){
                                                setLineAHover(false);
                                            }
                                        }}
                                       
                                        closed={false}
                                    />

                                    {
                                        (linePointArr[idx][0].length > 0) &&

                                        <Label x={linePointArr[idx][0][2] + 5} y={linePointArr[idx][0][3] + 5}>
                                            <Tag
                                                fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'white' : 'blue'}
                                                opacity={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 1 : 0.5}
                                                cornerRadius={10}
                                                stroke={"blue"}
                                                strokeWidth={2}
                                              
                                            />
                                            <Text text={`  ${lineNameArr[idx][0]}  `}
                                                fontSize={14}
                                                fontFamily="roboto"
                                                fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'blue' : 'white'}
                                                padding={6}
                                                height={24}
                                                lineHeight={1}
                                                onClick={event => {
                                                    if (idx === areaEditingIndex){
                                                        setLineASelected(true);
                                                        setLineBSelected(false);
                                                    }
                                                }}
                                                onMouseDown={event => {
                                                    if (idx === areaEditingIndex){
                                                        setLineASelected(true);
                                                        setLineBSelected(false);
                                                    }
                                                }}
                                                onMouseOver={event =>  {
                                                    if (idx === areaEditingIndex){
                                                        setLineAHover(true); 
                                                    }
                                                }}
                                                onMouseLeave={event => {
                
                                                    if (idx === areaEditingIndex){
                                                        setLineAHover(false); 
                                                    }
                                                }}

                                            />
                                        </Label>
                                    }
                                </>
                            </Group>
                        </>
                    }


                    {/* Line B*/}
                    {

                        (linePanel) &&
                        <>
                            <Group 
                               
                               Draggable={(idx === areaEditingIndex)?true:false}
                              
                               onDragEnd={event => {

                                   setStopBubble(true);
                                 
                                   const group = event.target;
                                   const x = group.x();
                                   const y = group.y();

                                   let tmpLine=[
                                       [linePoint[areaEditingIndex][1][0]+x,linePoint[areaEditingIndex][1][1]+y],
                                       [linePoint[areaEditingIndex][1][2]+x,linePoint[areaEditingIndex][1][3]+y]
                                   ];
                                
                                   if (lineInPolygon(tmpLine,areaShapeArr[idx])){
                                          
                                       updateLineB(group.x(), group.y());
                                       group.position({ x: 0, y: 0 });
                                       group.getLayer().draw();
                                    
                                   }else{
                                       updateLineB(0, 0);
                                       group.position({ x: 0, y: 0 });
                                       group.getLayer().draw();
                                   }
                                   
                               }}

                               
                           >
                            <Line
                                strokeWidth={((lineBSelected || lineBHover) && (idx === areaEditingIndex)) ? 6 : 3}
                                stroke="blue"
                                hitStrokeWidth={25}
                                opacity={1}
                                lineJoin="round"
                                Draggable={props.lineMode}
                                points={linePointArr[idx][1]}
                                onClick={event => {
                                    if (idx === areaEditingIndex){
                                        setLineBSelected(true);
                                        setLineASelected(false);
                                    }
                                }}
                                onMouseDown={event => {
                                    if (idx === areaEditingIndex){
                                        setLineBSelected(true);
                                        setLineASelected(false);
                                    }
                                }}
                                onMouseOver={event => {
                                    if (idx === areaEditingIndex){
                                        setLineBHover(true);
                                    }
                                }}
                                onMouseLeave={event => {
                                    if (idx === areaEditingIndex){
                                        setLineBHover(false);
                                    }
                                }}
                              
                                onDragMove={event => {
                                }}
                                closed={false}
                            />

                            {
                                (linePointArr[idx][1].length > 0) &&
                                <Label x={linePointArr[idx][1][2] + 5} y={linePointArr[idx][1][3] + 5}>
                                    <Tag
                                        fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'white' : 'blue'}
                                        opacity={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 1 : 0.5}
                                        cornerRadius={10}
                                        stroke={"blue"}
                                        strokeWidth={2}
                                    />
                                    <Text text={`  ${lineNameArr[idx][1]}  `}
                                        fontSize={14}
                                        fontFamily="roboto"
                                        fill={((mouseOverOrder === idx) || (selectedOrder === idx)) ? 'blue' : 'white'}
                                        padding={6}
                                        height={24}
                                        lineHeight={1}
                                        onClick={event => {
                                            setLineASelected(false);
                                            setLineBSelected(true);
                                        }}
                                        onMouseDown={event => {
                                            setLineASelected(false);
                                            setLineBSelected(true);
                                        }}
                                        onMouseOver={event => {

                                            setLineBHover(true);
                                        }}
                                        onMouseLeave={event => {
        
                                            setLineBHover(false);
                                        }}
                                    />
                                </Label>
                            }
                            </Group>
                        </>
                    }


                </Group>
            ))}

        </>
    )

});

export default AreaDisplay;