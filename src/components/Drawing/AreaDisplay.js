import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected } from "../../store/areas";
import LabelButton from '../../components/Buttons/LabelButton';
import { lineADelete, lineBDelete, areaDelete,lineAUpdate,lineBUpdate } from "../../store/areas";
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

    const areaDependOn = useSelector((state) => state.areas.areaDependOn);

    const [selectedOrder, setSelectedOrder] = useState(1);
    const [mouseOverOrder, setMouseOverOrder] = useState(-1);

    const [lineASelected, setLineASelected] = useState(false);
    const [lineBSelected, setLineBSelected] = useState(false);
    const [lineAHover, setLineAHover] = useState(false);
    const [lineBHover, setLineBHover] = useState(false);

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
        log('--- line point data changed ---')
        log(linePoint)
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
                <Group key={`polygon_${idx}`}>

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
                            //
                            if (props.mode === 'select') {
                                handleAreaSelected(idx);
                                setLineASelected(false);
                                setLineBSelected(false);
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
                               
                                Draggable={true}
                             
                                onDragEnd={event => {

                                    log('drag end')
                                    event.evt.stopPropagation();
                                    let group = event.target;
                                    updateLineA(group.x(), group.y());
                                    group.position({ x: 0, y: 0 });
                                    group.getLayer().draw();
                                    
                                }}
                            >
                                <>
                                    <Line
                                        strokeWidth={((lineASelected || lineAHover) && (idx === areaEditingIndex)) ? 6 : 3}
                                        stroke="blue"
                                        opacity={1}
                                        fill="#E2E6EA"
                                        lineJoin="round"
                                        Draggable={false}
                                        points={linePointArr[idx][0]}
                                        onClick={event => {
                                            setLineASelected(true);
                                            setLineBSelected(false);
                                        }}
                                        onMouseDown={event => {
                                            setLineASelected(true);
                                            setLineBSelected(false);
                                        }}
                                        onMouseOver={event => {

                                            setLineAHover(true);
                                        }}
                                        onMouseLeave={event => {

                                            setLineAHover(false);
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
                                                    setLineASelected(true);
                                                    setLineBSelected(false);
                                                }}
                                                onMouseDown={event => {
                                                    setLineASelected(true);
                                                    setLineBSelected(false);
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
                               
                               Draggable={true}
                              
                               onDragEnd={event => {

                                   log('drag end')
                                   event.evt.stopPropagation();
                                   const group = event.target;
                                   updateLineB(group.x(), group.y());
                                   group.position({ x: 0, y: 0 });
                                   group.getLayer().draw();
                                   
                               }}
                           >
                            <Line
                                strokeWidth={((lineBSelected || lineBHover) && (idx === areaEditingIndex)) ? 6 : 3}
                                stroke="blue"
                                opacity={1}
                                lineJoin="round"
                                Draggable={props.lineMode}
                                points={linePointArr[idx][1]}
                                onClick={event => {
                                    setLineBSelected(true);
                                    setLineASelected(false);
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