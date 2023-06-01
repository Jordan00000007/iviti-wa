import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected,areaUpdate,lineAUpdate,lineBUpdate,lineUpdate } from "../../store/areas";


const AreaEdit = (props) => {


    const [polygons, setPolygons] = useState([])
    const [areaName, setAreaName] = useState('')

    const [radius, setRadius] = useState(5);

    const [lineA, setLineA] = useState([]);
    const [lineB, setLineB] = useState([]);

    const [lineADrawing, setLineADrawing] = useState(false);
    const [lineBDrawing, setLineBDrawing] = useState(false);


    const [transPoly, setTransPoly] = useState([])
    const [transLineA, setTransLineA] = useState([])
    const [transLineB, setTransLineB] = useState([])
    const [nextPointA, setNextPointA] = useState({ x: 1, y: 1 })
    const [nextPointB, setNextPointB] = useState({ x: 1, y: 1 })
    //const [polygons, setPolygons] = useState(props.polygons)

    const [stopBubble, setStopBubble] = useState(false);

    const dispatch = useDispatch();

    const trans = (org) => {
        let ans = [];
        org.forEach(function (item) {
            ans.push(item.x);
            ans.push(item.y);
        });
        return ans
    }

    const checkDelete = (point, order) => {

        log('check delete')

        let tmpPolys = polygons;
        polygons.forEach(function (item, idx) {


            const dist = Math.sqrt(Math.pow((item.x - point.x), 2) + Math.pow((item.y - point.y), 2));

            if ((dist <= 15) && (order !== idx)) {
              
                tmpPolys = tmpPolys.filter(function (ele) {
                    return ele !== item;
                });
                setPolygons(tmpPolys);
                setTransPoly(trans(tmpPolys));
                //updateEditingData(tmpPolys);
            }

        });

        updateEditingData(tmpPolys);


    }

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
        var min = 99999;
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
            let dist = [];
            polygons.forEach(function (item, idx) {
                let obj = {}
                obj.id = idx;
                obj.dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
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

    const updatePosition = (x, y) => {

        let tmpPolygons = polygons;
        let minX = 0;
        let minY = 0;
        let maxX = props.width;
        let maxY = props.height;
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
        if (maxX > props.width) {
            tmpPolygons.forEach(function (item, idx) {
                item.x = item.x - (maxX - props.width);
            });
        }
        if (maxY > props.height) {
            tmpPolygons.forEach(function (item, idx) {
                item.y = item.y - (maxY - props.height);
            });
        }
        setPolygons(tmpPolygons);
        setTransPoly(trans(tmpPolygons))

        let tmpLineA = lineA;
        tmpLineA.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (minX < 0) item.x = item.x - minX;
            if (minY < 0) item.y = item.y - minY;
            if (maxX > props.width) item.x = item.x - (maxX - props.width);
            if (maxY > props.height) item.y = item.y - (maxY - props.height);

        });
        setLineA(tmpLineA);
        setTransLineA(trans(tmpLineA));

        log('tmpLineA')
        log(tmpLineA)

        let tmpLineB = lineB;
        tmpLineB.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (minX < 0) item.x = item.x - minX;
            if (minY < 0) item.y = item.y - minY;
            if (maxX > props.width) item.x = item.x - (maxX - props.width);
            if (maxY > props.height) item.y = item.y - (maxY - props.height);

        });
        setLineB(tmpLineB);
        setTransLineB(trans(tmpLineB));

        updateEditingLine([trans(tmpLineA),trans(tmpLineB)]);
    }

    const areaShapeArr = useSelector((state) => state.areas.areaShapeArr);
    const areaNameArr = useSelector((state) => state.areas.areaNameArr);
    const lineNameArr = useSelector((state) => state.areas.lineNameArr);
    const linePointArr = useSelector((state) => state.areas.linePointArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);

    const updateEditingData=(myData)=>{

        dispatch(areaUpdate(myData))

    }

    const updateEditingLine=(myData)=>{

        dispatch(lineUpdate(myData))

    }

   

    const cloneData=(myPoly)=>{

        let myArr=[];
        myPoly.forEach(function (item) {
            let myItem={};
            myItem.x=item.x;
            myItem.y=item.y;
            myArr.push(myItem);
        });

        return myArr;

    }

    useEffect(() => {

        const myData=cloneData(areaShapeArr[areaEditingIndex]);
        setAreaName(areaNameArr[areaEditingIndex][1])
        setPolygons(myData);
        setTransPoly(trans(myData));

        const lineAData=linePointArr[areaEditingIndex][0];
        if (lineAData){
            if (lineAData.length>1){
                setTransLineA(lineAData);
                setLineA([{"x":lineAData[0],"y":lineAData[1]},{"x":lineAData[2],"y":lineAData[3]}]);
            }
        }
        
        const lineBData=linePointArr[areaEditingIndex][1];
        if (lineBData){
            if (lineBData.length>1){
                setTransLineB(lineBData);
                setLineB([{"x":lineBData[0],"y":lineBData[1]},{"x":lineBData[2],"y":lineBData[3]}]);
            }
        }
        


    }, [props]);

    useStrictMode(true);

    useEffect(() => {

    }, []);


    return (
        <>
            {/* Edit Polygon Whole Group */}

            {
                (polygons!==[]) &&
            
                <Group
                    draggable={!props.lineMode}
                    x={0}
                    y={0}
                    onDragStart={event => {
                    }}
                    onDragMove={event => {
                    }}
                    onDragEnd={event => {

                        if (props.lineMode) {

                        } else {
                            if (!stopBubble) {
                                log('group drag end')
                                event.evt.stopPropagation();
                                const group = event.target;
                                updatePosition(group.x(), group.y());

                            }

                        }
                        setStopBubble(false);
                        updateEditingData(polygons);
                        
                    }}
                >

                    {/* Edit Polygon for Display */}
                    <Line
                        // for display
                        strokeWidth={5}
                        stroke="#FBB03B"
                        opacity={0.2}
                        lineJoin="round"
                        fill="red"
                        points={transPoly}
                        onMouseUp={event => {

                            log('mouse up')
                            log(props.lineMode)
                            log(lineADrawing)

                            if (props.mode==='line') {

                                if (lineADrawing) {

                                    setLineADrawing(false);
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setLineA(lineA.concat([{ x: x, y: y }]))
                                    setTransLineA(trans(lineA.concat([{ x: x, y: y }])))
                                    dispatch(lineAUpdate([lineA[0].x,lineA[0].y,x,y]))

                                }
                                if (lineBDrawing) {

                                    setLineBDrawing(false);
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setLineB(lineB.concat([{ x: x, y: y }]))
                                    setTransLineB(trans(lineB.concat([{ x: x, y: y }])))
                                    dispatch(lineBUpdate([lineB[0].x,lineB[0].y,x,y]))
                                    props.onComplete();
                                }
                            }

                        }}
                        onMouseDown={event => {

                            if (props.mode==='line') {

                                if (lineA.length === 0) {
                                    log('start draw line a')
                                    setLineADrawing(true);
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setNextPointA({ "x": x, "y": y });
                                    setLineA([{ "x": x, "y": y }]);
                                    setTransLineA(trans([{ "x": x, "y": y }]))

                                }
                                if ((lineA.length === 2) && (lineB.length === 0)) {
                                    log('start draw line b')
                                    setLineBDrawing(true);
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setNextPointB({ "x": x, "y": y });
                                    setLineB([{ "x": x, "y": y }]);
                                    setTransLineB(trans([{ "x": x, "y": y }]))

                                }
                            }

                        }}
                        onMouseMove={event => {

                            if (props.mode==='line') {

                                if (lineADrawing === true) {
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setNextPointA({ x, y })
                                }
                                if (lineBDrawing === true) {
                                    const x = event.evt.offsetX;
                                    const y = event.evt.offsetY;
                                    setNextPointB({ x, y })
                                }
                            }

                        }}
                        closed={true}
                        tag={{ id: 1, name: 'hexagon' }}


                        onDragStart={event => {
                            if (lineA === []) {
                                log('start draw line')
                            }

                        }}
                        onDragEnd={event => {
                        }}


                    >
                    </Line>

                    {/* Edit Polygon Label */}
                    {/* <Label x={getLabelX() + 15} y={getLabelY() - 40}> */}
                    <Label x={getLabelX(polygons)-60} y={getLabelY(polygons)-32}>
                        <Tag
                            fill={'white'}
                            opacity={1}
                            cornerRadius={10}
                            stroke='red'
                            strokeWidth={2}
                        />
                        <Text text={'  '+areaName+'  '}
                            fontSize={14}
                            fontFamily="roboto"
                            fill="red"
                            padding={6}
                            height={24}
                            lineHeight={1}
                        />
                    </Label>

                    {/* Edit Polygon for Add Node */}
                    {polygons.map((item, idx) => (
                        <Line
                            // for detect
                            key={idx}
                            strokeWidth={3}
                            stroke="red"
                            opacity={1}
                            lineJoin="round"
                            order={idx}
                            points={polygons
                                .flatMap(polygons => [polygons.x, polygons.y])
                                .concat([polygons[0].x, polygons[0].y])
                                .slice(idx * 2, (idx * 2) + 4)
                            }
                            onClick={event => {

                                const order = parseInt(event.target.attrs.order);
                                log('x')
                                log(event.target.getStage().getPointerPosition().x)
                                log('y')
                                log(event.target.getStage().getPointerPosition().y)
                                let newPolys = polygons;
                                newPolys.splice(order + 1, 0, { "x": event.target.getStage().getPointerPosition().x, "y": event.target.getStage().getPointerPosition().y });
                                log(newPolys)
                                setPolygons(newPolys);
                                setTransPoly(trans(polygons));
                                updateEditingData(polygons);

                            }}
                            closed={false}

                        />

                    ))}

                    {/* Edit Polygon Node */}
                    {polygons.map((item, idx) => (
                        <Circle
                            key={idx}
                            x={item.x}
                            y={item.y}
                            order={idx}
                            radius={radius}
                            fill={'white'}
                            stroke={'red'}
                            strokeWidth={2}
                            draggable={true}
                            onMouseOver={event => {
                                //setRadius(15)
                                log('mouse over')
                                //event.target.attrs.fill = 'red';
                                //log(event.target.attrs)
                            }}
                            onMouseLeave={event => {
                                //setRadius(10)
                                log('mouse leave')
                                //event.target.attrs.fill = 'white';
                                //event.target.attrs.radius = 10;
                            }}
                            onDragMove={event => {

                                log('circle drag move')
                                let tmp = polygons;
                                tmp[idx].x = event.target.attrs.x;
                                tmp[idx].y = event.target.attrs.y;
                                if (tmp[idx].x < 0) tmp[idx].x = 0;
                                if (tmp[idx].y < 0) tmp[idx].y = 0;
                                setPolygons(tmp);
                                setTransPoly(trans(tmp));
                                
                            }}
                            onDragEnd={event => {

                                log('circle drag end')
                                const order = parseInt(event.target.attrs.order);
                                log('order')
                                log(order)
                                checkDelete({ "x": event.target.attrs.x, "y": event.target.attrs.y }, order);
                                setStopBubble(true);
                                //updateEditingData();
                            }}
                        />
                    ))}

                    {/* Line A*/}
                    <Line
                        strokeWidth={3}
                        stroke="blue"
                        opacity={1}
                        lineJoin="round"
                        Draggable={props.lineMode}
                        points={(lineADrawing) ? transLineA.concat([nextPointA.x, nextPointA.y]) : transLineA}
                        onClick={event => {
                        }}
                        onDragMove={event => {
                            setStopBubble(true);
                            log('line A moving...')
                            log(event)

                        }}
                        closed={false}
                    />



                    {/* Line A Node*/}
                    {lineA.map((item, idx) => (
                        <Circle
                            key={idx}
                            x={item.x}
                            y={item.y}
                            order={idx}
                            radius={radius}
                            fill={'white'}
                            stroke={'blue'}
                            strokeWidth={2}
                            draggable={props.lineMode}
                            onMouseOver={event => {

                            }}
                            onMouseLeave={event => {

                            }}
                            onDragMove={event => {

                                const order = parseInt(event.target.attrs.order);
                                let tmp = lineA;
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                tmp[order].x = x;
                                tmp[order].y = y;
                                setLineA(tmp);
                                setTransLineA(trans(tmp));
                                if (order === 1) {
                                    setNextPointA({ x: x, y: y })
                                }

                            }}
                            onDragEnd={event => {
                                log('line A drag end');
                                dispatch(lineAUpdate(transLineA));
                            }}
                        />
                    ))}

                    {/* Line A Label */}
                    {
                        (lineA.length === 2) &&

                        <Label x={lineA[1].x+5} y={lineA[1].y+5}>
                            <Tag
                                fill={'white'}
                                opacity={1}
                                cornerRadius={10}
                                stroke={"blue"}
                                strokeWidth={2}
                            />
                            <Text text={`  ${lineNameArr[areaEditingIndex][0]}  `}
                                fontSize={14}
                                fontFamily="roboto"
                                fill="blue"
                                padding={6}
                                height={24}
                                lineHeight={1}
                            />
                        </Label>
                    }


                    {/* Line B*/}
                    <Line
                        strokeWidth={3}
                        stroke="blue"
                        opacity={1}
                        lineJoin="round"
                        //points={transLineB.concat([nextPointB.x,nextPointB.y])}
                        points={(lineBDrawing) ? transLineB.concat([nextPointB.x, nextPointB.y]) : transLineB}
                        onClick={event => {
                        }}
                        closed={false}
                    />

                    {/* Line B Node*/}
                    {lineB.map((item, idx) => (
                        <Circle
                            key={idx}
                            x={item.x}
                            y={item.y}
                            order={idx}
                            radius={radius}
                            fill={'white'}
                            stroke={'blue'}
                            strokeWidth={2}
                            draggable={props.lineMode}
                            onMouseOver={event => {

                            }}
                            onMouseLeave={event => {

                            }}
                            onDragMove={event => {

                                const order = parseInt(event.target.attrs.order);
                                let tmp = lineB;
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                tmp[order].x = x;
                                tmp[order].y = y;
                                setLineB(tmp);
                                setTransLineB(trans(tmp));
                                if (order === 1) {
                                    setNextPointB({ x: x, y: y })
                                }

                            }}
                            onDragEnd={event => {
                                dispatch(lineBUpdate(transLineB));
                                
                            }}
                        />
                    ))}

                    {/* Line B Label */}
                    {
                        (lineB.length === 2) &&

                        <Label x={lineB[1].x+5} y={lineB[1].y+5}>
                            <Tag
                                fill={'white'}
                                opacity={1}
                                cornerRadius={10}
                                stroke={'blue'}
                                strokeWidth={2}
                            />
                            <Text text={`  ${lineNameArr[areaEditingIndex][1]}  `}
                                fontSize={14}
                                fontFamily="roboto"
                                fill="blue"
                                padding={6}
                                height={24}
                                lineHeight={1}
                            />
                        </Label>
                    }

                </Group>
            }
        </>
    )

}

export default AreaEdit;